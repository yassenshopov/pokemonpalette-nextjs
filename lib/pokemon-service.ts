// Centralized Pokemon service for API calls and data management

import { logApiCall, logPokemonFetch } from './logger';
import speciesData from '@/data/species.json';

// Types for Pokemon API responses
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    home?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  cries?: {
    latest?: string;
  };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
}

export interface PokemonForm {
  id: number;
  name: string;
  sprites: PokemonSprites;
  pokemon: {
    name: string;
  };
}

export interface EvolutionChain {
  chain: {
    species: {
      name: string;
    };
    evolves_to: EvolutionChain['chain'][];
  };
}

// Enhanced Pokemon API service with improved caching
class PokemonAPIService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private cache = new Map<
    string,
    {
      data: unknown;
      timestamp: number;
      accessCount: number;
      lastAccessed: number;
    }
  >();
  private cacheTimeout = 30 * 60 * 1000; // 30 minutes - longer for Pokemon data
  private requestQueue = new Map<string, Promise<unknown>>();
  private maxCacheSize = 500; // Limit cache size to prevent memory issues
  private localStorageKey = 'pokemon-cache-v1';

  constructor() {
    // Load cache from localStorage on initialization
    this.loadCacheFromStorage();
  }

  private async fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    const startTime = Date.now();

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      logApiCall(url, 'GET', true, Date.now() - startTime);
      return cached.data as T;
    }

    // Check if request is already in progress to prevent duplicate calls
    const ongoingRequest = this.requestQueue.get(cacheKey);
    if (ongoingRequest) {
      return ongoingRequest as Promise<T>;
    }

    // Create new request promise
    const requestPromise = this.performRequest<T>(url, cacheKey, startTime);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up request queue
      this.requestQueue.delete(cacheKey);
    }
  }

  private async performRequest<T>(url: string, cacheKey: string, startTime: number): Promise<T> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second base delay

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'public, max-age=3600', // Browser cache for 1 hour
          },
        });
        const responseTime = Date.now() - startTime;

        if (!response.ok) {
          // For 5xx errors, retry; for 4xx errors, don't retry
          if (response.status >= 500 && attempt < maxRetries) {
            await this.delay(retryDelay * attempt);
            continue;
          }
          logApiCall(url, 'GET', false, responseTime, new Error(`HTTP ${response.status}`));
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Manage cache size - remove oldest entries if needed
        if (this.cache.size >= this.maxCacheSize) {
          this.evictOldestCacheEntries();
        }

        // Cache successful response
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          accessCount: 1,
          lastAccessed: Date.now(),
        });

        // Persist to localStorage
        this.saveCacheToStorage();

        logApiCall(url, 'GET', true, responseTime);
        return data;
      } catch (error) {
        // If this is the last attempt or not a network error, throw
        if (attempt === maxRetries || !this.isRetryableError(error)) {
          const responseTime = Date.now() - startTime;
          logApiCall(url, 'GET', false, responseTime, error as Error);
          throw error;
        }

        // Wait before retrying
        await this.delay(retryDelay * attempt);
      }
    }

    // This should never be reached due to the throw in the catch block
    throw new Error('Max retries exceeded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRetryableError(error: unknown): boolean {
    // Retry on network errors, timeouts, or 5xx server errors
    return (
      error instanceof TypeError || // Network error
      (error instanceof Error &&
        (error.message?.includes('fetch') ||
          error.message?.includes('timeout') ||
          error.message?.includes('5')))
    );
  }

  private evictOldestCacheEntries(): void {
    // Remove 20% of the oldest entries
    const entriesToRemove = Math.floor(this.maxCacheSize * 0.2);
    const entries = Array.from(this.cache.entries());

    // Sort by timestamp (oldest first)
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);

    for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }

    // Update localStorage after eviction
    this.saveCacheToStorage();
  }

  private loadCacheFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.localStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();

        // Only load non-expired entries
        Object.entries(parsed).forEach(([key, value]: [string, unknown]) => {
          if (
            typeof value === 'object' &&
            value !== null &&
            'timestamp' in value &&
            typeof value.timestamp === 'number' &&
            now - value.timestamp < this.cacheTimeout
          ) {
            this.cache.set(
              key,
              value as {
                data: unknown;
                timestamp: number;
                accessCount: number;
                lastAccessed: number;
              }
            );
          }
        });
      }
    } catch (error) {
      // Silent fail - localStorage issues shouldn't break the app
      console.warn('Failed to load Pokemon cache from localStorage:', error);
    }
  }

  private saveCacheToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const cacheObject = Object.fromEntries(this.cache.entries());
      localStorage.setItem(this.localStorageKey, JSON.stringify(cacheObject));
    } catch (error) {
      // Silent fail - localStorage quota exceeded or other issues
      console.warn('Failed to save Pokemon cache to localStorage:', error);
    }
  }

  async fetchPokemon(identifier: string | number): Promise<Pokemon> {
    const url = `${this.baseUrl}/pokemon/${identifier.toString().toLowerCase()}`;
    const cacheKey = `pokemon:${identifier}`;

    try {
      const data = await this.fetchWithCache<Pokemon>(url, cacheKey);
      logPokemonFetch(data.name, true);
      return data;
    } catch (error) {
      logPokemonFetch(identifier.toString(), false, error as Error);
      throw error;
    }
  }

  async fetchPokemonSpecies(identifier: string | number): Promise<PokemonSpecies> {
    const url = `${this.baseUrl}/pokemon-species/${identifier.toString().toLowerCase()}`;
    const cacheKey = `species:${identifier}`;

    return this.fetchWithCache<PokemonSpecies>(url, cacheKey);
  }

  async fetchPokemonForm(identifier: string): Promise<PokemonForm> {
    const url = `${this.baseUrl}/pokemon-form/${identifier}`;
    const cacheKey = `form:${identifier}`;

    return this.fetchWithCache<PokemonForm>(url, cacheKey);
  }

  async fetchEvolutionChain(url: string): Promise<EvolutionChain> {
    const cacheKey = `evolution:${url}`;
    return this.fetchWithCache<EvolutionChain>(url, cacheKey);
  }

  getSpeciesId(name: string): number | null {
    const typedSpeciesData = speciesData as Record<string, number>;
    return typedSpeciesData[name.toLowerCase()] || null;
  }

  // Utility methods
  getSpriteUrl(pokemon: Pokemon, isShiny: boolean = false, preferOfficial: boolean = true): string {
    const sprites = pokemon.sprites;

    if (preferOfficial && sprites.other?.['official-artwork']) {
      return isShiny
        ? sprites.other['official-artwork'].front_shiny ||
            sprites.front_shiny ||
            sprites.front_default ||
            ''
        : sprites.other['official-artwork'].front_default || sprites.front_default || '';
    }

    return isShiny
      ? sprites.front_shiny || sprites.front_default || ''
      : sprites.front_default || '';
  }

  getTypeColors(types: string[]): string[] {
    const typeColorMap: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };

    return types.map(type => typeColorMap[type.toLowerCase()] || typeColorMap.normal);
  }

  // Batch operations for better performance
  async fetchMultiplePokemon(identifiers: (string | number)[]): Promise<Pokemon[]> {
    const promises = identifiers.map(id => this.fetchPokemon(id));
    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<Pokemon> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  // Search functionality
  searchPokemon(query: string, limit: number = 10): Array<{ name: string; id: number }> {
    const typedSpeciesData = speciesData as Record<string, number>;
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return [];

    const results = Object.entries(typedSpeciesData)
      .filter(([name]) => name.includes(normalizedQuery))
      .map(([name, id]) => ({ name, id }))
      .sort((a, b) => {
        // Prioritize exact matches and starts-with matches
        const aStartsWith = a.name.startsWith(normalizedQuery);
        const bStartsWith = b.name.startsWith(normalizedQuery);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return a.name.localeCompare(b.name);
      })
      .slice(0, limit);

    return results;
  }

  // Clear cache method for memory management
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats for debugging
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
export const pokemonService = new PokemonAPIService();

// Convenience exports
export const {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchPokemonForm,
  fetchEvolutionChain,
  getSpeciesId,
  getSpriteUrl,
  getTypeColors,
  fetchMultiplePokemon,
  searchPokemon,
  clearCache,
  getCacheStats,
} = pokemonService;
