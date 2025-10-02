'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  ArrowRight,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  Shuffle,
} from 'lucide-react';
import speciesData from '@/data/species.json';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import ColorThief from 'colorthief';
import { useColors } from '@/contexts/color-context';
import {
  PokemonSpriteV2Props,
  PokemonData,
  PokemonFormData,
  EvolutionChainData,
} from '@/types/pokemon';

export function PokemonSpriteV2({ className = '' }: PokemonSpriteV2Props) {
  // Get color context for sharing data with other components
  const {
    setColors,
    setPokemonName: setContextPokemonName,
    setShiny,
    setForm,
    setOfficialArt,
    colors,
  } = useColors();

  // Helper function to get contrast color for text/icons
  const getContrastColor = (bgColor: string): string => {
    if (!bgColor) return '#000000';

    // Convert hex to RGB if needed
    let rgbColor = bgColor;
    if (bgColor.startsWith('#')) {
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      rgbColor = `rgb(${r}, ${g}, ${b})`;
    }

    // Parse RGB values
    const rgb = rgbColor.match(/\d+/g);
    if (!rgb) return '#000000';

    const [r, g, b] = rgb.map(Number);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const [pokemonInput, setPokemonInput] = useState('golduck');
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [dexNumber, setDexNumber] = useState('55');
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ name: string; id: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [forms, setForms] = useState<PokemonFormData[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChainData | null>(null);
  const [spriteKey, setSpriteKey] = useState(0);

  // Helper functions
  const getPokemonId = (input: string): number | null => {
    const numericId = parseInt(input);
    if (!isNaN(numericId) && numericId > 0 && numericId <= 1025) {
      return numericId;
    }
    const speciesId = (speciesData as Record<string, number>)[input.toLowerCase()];
    return speciesId || null;
  };

  const getPokemonName = (id: number): string => {
    const entry = Object.entries(speciesData as Record<string, number>).find(
      ([_, pokemonId]) => pokemonId === id
    );
    return entry ? entry[0] : id.toString();
  };

  const getRandomPokemon = (): { id: number; name: string } => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    const name = getPokemonName(randomId);
    return { id: randomId, name };
  };

  const getLocalImagePath = (pokemonId: number, shiny: boolean = false): string => {
    const timestamp = Date.now();
    if (shiny) {
      return `/images/pokemon/front/shiny/${pokemonId}.png?t=${timestamp}`;
    }
    return `/images/pokemon/front/${pokemonId}.png?t=${timestamp}`;
  };

  const getPokeApiImageUrl = (pokemonId: number, shiny: boolean = false): string => {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    const timestamp = Date.now();
    if (shiny) {
      return `${baseUrl}/shiny/${pokemonId}.png?t=${timestamp}`;
    }
    return `${baseUrl}/${pokemonId}.png?t=${timestamp}`;
  };

  const testLocalImage = (imagePath: string): Promise<boolean> => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  };

  const extractColors = async (imageUrl: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Try to handle CORS issues
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 6);
          const hexColors = palette.map(
            (color: number[]) => `#${color.map(c => c.toString(16).padStart(2, '0')).join('')}`
          );
          resolve(hexColors);
        } catch (error) {
          console.error('ColorThief error:', error);
          // Fallback: try to extract colors manually
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const colors = extractColorsFromImageData(imageData);
              resolve(colors);
            } else {
              reject(new Error('Canvas context not available'));
            }
          } catch (fallbackError) {
            console.error('Fallback color extraction failed:', fallbackError);
            reject(error);
          }
        }
      };

      img.onerror = () => {
        console.error('Failed to load image for color extraction:', imageUrl);
        reject(new Error('Failed to load image for color extraction'));
      };

      img.src = imageUrl;
    });
  };

  // Fallback color extraction function
  const extractColorsFromImageData = (imageData: ImageData): string[] => {
    const data = imageData.data;
    const colorMap = new Map<string, number>();

    // Sample every 10th pixel to avoid performance issues
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
        .toString(16)
        .padStart(2, '0')}`;
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }

    // Sort by frequency and return top 6 colors
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([color]) => color);
  };

  const fetchPokemonData = async (pokemonId: number) => {
    try {
      const response = await fetch(`/data/pokemon-data.json?t=${Date.now()}`);
      const data = await response.json();
      const localData = data.pokemon?.[pokemonId.toString()];

      if (localData) {
        return {
          ...localData,
          // Convert base_stats to baseStats to match component expectations
          baseStats: localData.base_stats
            ? {
                hp: localData.base_stats.hp,
                attack: localData.base_stats.attack,
                defense: localData.base_stats.defense,
                specialAttack: localData.base_stats.special_attack,
                specialDefense: localData.base_stats.special_defense,
                speed: localData.base_stats.speed,
              }
            : undefined,
          // Explicitly include genus to ensure it's not lost
          genus: localData.genus,
          forms: localData.forms || [],
          evolutionChain: localData.evolution_chain || null,
          evolutionChainId: localData.evolution_chain_id || null,
          hasGenderDifferences: localData.has_gender_differences || false,
          formsSwitchable: localData.forms_switchable || false,
        };
      }

      console.log(`⚠️ No local data found, fetching from PokeAPI for Pokemon ${pokemonId}`);
      const apiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const apiData = await apiResponse.json();

      // Try to get species information
      let speciesInfo = 'Pokémon';
      try {
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
        );
        const speciesData = await speciesResponse.json();
        speciesInfo =
          speciesData.genera?.find((g: any) => g.language.name === 'en')?.genus || 'Pokémon';
      } catch (error) {
        console.log('Could not fetch species data:', error);
      }

      return {
        types: apiData.types?.map((t: any) => t.type.name) || [],
        height: apiData.height / 10,
        weight: apiData.weight / 10,
        genus: speciesInfo,
        baseStats: {
          hp: apiData.stats?.[0]?.base_stat || 0,
          attack: apiData.stats?.[1]?.base_stat || 0,
          defense: apiData.stats?.[2]?.base_stat || 0,
          specialAttack: apiData.stats?.[3]?.base_stat || 0,
          specialDefense: apiData.stats?.[4]?.base_stat || 0,
          speed: apiData.stats?.[5]?.base_stat || 0,
        },
        abilities: apiData.abilities?.map((a: any) => a.ability.name) || [],
      };
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      return {};
    }
  };

  // Main function - defined as a regular function, not const
  async function fetchPokemonSprite(input: string, shiny: boolean = false) {
    console.log('fetchPokemonSprite called with:', { input, shiny });
    console.log('Starting to fetch Pokemon sprite...');
    setIsLoading(true);
    setError(null);

    try {
      const pokemonId = getPokemonId(input);
      console.log('Resolved Pokemon ID:', pokemonId);
      if (!pokemonId) {
        throw new Error('Invalid Pokemon name or number');
      }

      const localPath = getLocalImagePath(pokemonId, shiny);
      const localExists = await testLocalImage(localPath);

      let spriteUrl: string;
      if (localExists) {
        spriteUrl = localPath;
        console.log(`✅ Using local image for Pokemon ${pokemonId}: ${localPath}`);
      } else {
        spriteUrl = getPokeApiImageUrl(pokemonId, shiny);
        console.log(
          `⚠️ Local image not found, using PokeAPI for Pokemon ${pokemonId}: ${spriteUrl}`
        );
      }

      const pokemonName = getPokemonName(pokemonId);
      const additionalData = await fetchPokemonData(pokemonId);

      // Ensure we use the base Pokemon sprite, not a form sprite
      const baseSpriteUrl = getLocalImagePath(pokemonId, shiny);
      const baseSpriteExists = await testLocalImage(baseSpriteUrl);
      const finalSpriteUrl = baseSpriteExists
        ? baseSpriteUrl
        : getPokeApiImageUrl(pokemonId, shiny);

      const pokemonDataToSet = {
        id: pokemonId,
        name: pokemonName,
        sprite: finalSpriteUrl,
        isShiny: shiny,
        ...additionalData,
      };

      console.log('Setting Pokemon data:', pokemonDataToSet);
      setPokemonData(pokemonDataToSet);

      setDexNumber(pokemonId.toString());

      // Set forms and evolution chain data
      const pokemonForms = additionalData.forms || [];
      console.log(`Forms for Pokemon ${pokemonId}:`, pokemonForms);

      // Filter out forms that are just the same Pokemon (is_default: false but same name)
      const filteredForms = pokemonForms.filter(
        (form: PokemonFormData) => form.name !== pokemonName && form.form_type !== 'default'
      );

      console.log(`Filtered forms for Pokemon ${pokemonId}:`, filteredForms);
      setForms(filteredForms);
      setEvolutionChain(additionalData.evolutionChain || null);

      setIsExtractingColors(true);
      try {
        const colors = await extractColors(spriteUrl);
        setExtractedColors(colors);

        // Use setTimeout to batch context updates and prevent multiple re-renders
        setTimeout(() => {
          setContextPokemonName(pokemonName);
          setShiny(shiny);
          setForm('');
          setColors(colors);
        }, 0);
      } catch (colorError) {
        console.error('Error extracting colors:', colorError);
        setExtractedColors([]);
      } finally {
        setIsExtractingColors(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Pokemon';
      setError(errorMessage);
      console.error('Error fetching Pokemon sprite:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Load default Pokemon on component mount
  useEffect(() => {
    // Load Golduck (ID 55) as the default Pokemon
    console.log('PokemonSpriteV2 mounted, loading default Pokemon: Golduck');
    console.log('Current pokemonInput state:', pokemonInput);
    console.log('Current dexNumber state:', dexNumber);
    fetchPokemonSprite('golduck', false);
  }, []);

  const generateSuggestions = (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = Object.entries(speciesData as Record<string, number>)
      .filter(([name]) => name.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5)
      .map(([name, id]) => ({ name, id }));

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputChange = (value: string) => {
    setPokemonInput(value);
    generateSuggestions(value);

    // Try to sync with dex number if it's a valid Pokemon name
    const pokemonId = getPokemonId(value);
    if (pokemonId) {
      setDexNumber(pokemonId.toString());
    }
  };

  const handleSuggestionSelect = (suggestion: { name: string; id: number }) => {
    setPokemonInput(suggestion.name);
    setDexNumber(suggestion.id.toString());
    setShowSuggestions(false);
    fetchPokemonSprite(suggestion.name, isShiny);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleDexNumberChange = (direction: 'up' | 'down') => {
    const currentNumber = parseInt(dexNumber) || 1;
    const newNumber =
      direction === 'up' ? Math.min(currentNumber + 1, 1025) : Math.max(currentNumber - 1, 1);

    const pokemonName = getPokemonName(newNumber);
    setDexNumber(newNumber.toString());
    setPokemonInput(pokemonName);
    fetchPokemonSprite(pokemonName, isShiny);
  };

  const handleDexNumberInputChange = (value: string) => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 1025) {
      setDexNumber(value);
      const pokemonName = getPokemonName(numericValue);
      setPokemonInput(pokemonName);
      // Don't auto-fetch here, let user press enter or click submit
    } else if (value === '') {
      setDexNumber(value);
      setPokemonInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = pokemonInput.trim();
    if (trimmedInput) {
      console.log('Submitting Pokemon:', trimmedInput);
      fetchPokemonSprite(trimmedInput, isShiny);
      setShowSuggestions(false);
    }
  };

  const handleShinyToggle = () => {
    const newShinyState = !isShiny;
    setIsShiny(newShinyState);
    setShiny(newShinyState); // Update context
    if (pokemonData) {
      fetchPokemonSprite(pokemonData.name, newShinyState);
    }
  };

  const handleRandomize = () => {
    const randomPokemon = getRandomPokemon();
    setPokemonInput(randomPokemon.name);
    setDexNumber(randomPokemon.id.toString());
    fetchPokemonSprite(randomPokemon.name, isShiny);
    setShowSuggestions(false);
  };

  const handleEvolutionClick = (pokemonId: number, pokemonName: string) => {
    setPokemonInput(pokemonName);
    setDexNumber(pokemonId.toString());
    fetchPokemonSprite(pokemonName, isShiny);
    setShowSuggestions(false);
  };

  // Helper function to get the sprite URL for a form (used by both display and click handler)
  const getFormSpriteUrl = (form: PokemonFormData): string => {
    // Extract form ID from URL if not provided directly
    let actualFormId = form.form_id;
    if (!actualFormId && form.url) {
      const urlParts = form.url.split('/');
      const formIdFromUrl = parseInt(urlParts[urlParts.length - 2]);
      if (!isNaN(formIdFromUrl)) {
        actualFormId = formIdFromUrl;
      }
    }

    if (form.sprites?.front_default) {
      // Use the form's specific sprite
      return form.sprites.front_default;
    } else if (actualFormId && actualFormId !== pokemonData?.id) {
      // For forms with different IDs (like Mega forms), ALWAYS use PokeAPI
      // Form sprites are typically not available locally
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${actualFormId}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${actualFormId}.png`;
    } else {
      // For same-Pokemon forms, use local images if available
      return isShiny
        ? `/images/pokemon/front/shiny/${pokemonData?.id}.png`
        : `/images/pokemon/front/${pokemonData?.id}.png`;
    }
  };

  const handleFormClick = async (form: PokemonFormData) => {
    if (!pokemonData) {
      return;
    }

    // Use the same helper function as the form display
    const formSpriteUrl = getFormSpriteUrl(form);

    // Update the Pokemon data with the new sprite
    setPokemonData({
      ...pokemonData,
      sprite: formSpriteUrl,
    });

    // Update context with form information
    setForm(form.name);

    // Force re-render by updating the sprite key
    setSpriteKey(prev => prev + 1);
    setShowSuggestions(false);

    // Extract colors from the new form's sprite
    setIsExtractingColors(true);
    try {
      const colors = await extractColors(formSpriteUrl);
      setExtractedColors(colors);

      // Use setTimeout to batch context updates and prevent multiple re-renders
      setTimeout(() => {
        setContextPokemonName(pokemonData.name);
        setShiny(isShiny);
        setForm(form.name);
        setColors(colors);

        // Update official artwork for the form
        // For forms, we'll use the same sprite URL as the form sprite
        // since official artwork for forms might not be available
        setOfficialArt(formSpriteUrl);
      }, 0);
    } catch (colorError) {
      console.error('Error extracting colors from form sprite:', colorError);
      setExtractedColors([]);
    } finally {
      setIsExtractingColors(false);
    }
  };

  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const convertColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === rNorm) h = ((gNorm - bNorm) / diff) % 6;
      else if (max === gNorm) h = (bNorm - rNorm) / diff + 2;
      else h = (rNorm - gNorm) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

    return {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    };
  };

  const getFormTypeLabel = (form: PokemonFormData): string => {
    switch (form.form_type) {
      case 'mega':
        return 'Mega';
      case 'gigantamax':
        return 'Gigantamax';
      case 'alolan':
        return 'Alolan';
      case 'galarian':
        return 'Galarian';
      case 'hisui':
        return 'Hisuian';
      case 'paldean':
        return 'Paldean';
      case 'seasonal':
        return 'Seasonal';
      case 'gender':
        return 'Gender';
      case 'totem':
        return 'Totem';
      case 'primal':
        return 'Primal';
      case 'eternamax':
        return 'Eternamax';
      case 'origin':
        return 'Origin';
      case 'hero':
        return 'Hero';
      case 'zen':
        return 'Zen';
      case 'weather':
        return 'Weather';
      case 'color':
        return 'Color';
      case 'trim':
        return 'Trim';
      case 'style':
        return 'Style';
      case 'coat':
        return 'Coat';
      case 'sea':
        return 'Sea';
      case 'mood':
        return 'Mood';
      case 'strike':
        return 'Strike';
      case 'segment':
        return 'Segment';
      case 'family':
        return 'Family';
      case 'shape':
        return 'Shape';
      case 'default':
        return 'Default';
      default:
        return 'Form';
    }
  };

  const getFormTypeColor = (form: PokemonFormData): string => {
    switch (form.form_type) {
      case 'mega':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'gigantamax':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'alolan':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'galarian':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'hisui':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'paldean':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'seasonal':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'gender':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'totem':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'primal':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'eternamax':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300';
      case 'origin':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'hero':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'zen':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'weather':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'color':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'trim':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'style':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'coat':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'sea':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'mood':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'strike':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'segment':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'family':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'shape':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'default':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const findCurrentPokemonInChain = (
    chain: EvolutionChainData['chain'],
    targetId: number
  ): EvolutionChainData['chain'] | null => {
    if (chain.id === targetId) {
      return chain;
    }

    for (const evolution of chain.evolves_to || []) {
      const found = findCurrentPokemonInChain(evolution, targetId);
      if (found) return found;
    }

    return null;
  };

  const renderEvolutionChain = (
    chain: EvolutionChainData['chain'],
    level: number = 0
  ): React.JSX.Element => {
    const pokemonId = chain.id || parseInt(chain.species.url.split('/').slice(-2, -1)[0]);
    const pokemonName = chain.name || chain.species.name;
    const displayName = pokemonName.replace(/-/g, ' ');
    const isCurrentPokemon = pokemonId === pokemonData?.id;

    return (
      <div key={`${pokemonId}-${level}`} className="flex flex-col items-center">
        <div
          className="flex flex-col items-center space-y-2 cursor-pointer transition-all hover:scale-105 hover:bg-background/50 rounded-lg p-2"
          style={{
            border: isCurrentPokemon ? `2px solid ${colors[0] || '#3b82f6'}` : undefined,
            borderColor: !isCurrentPokemon && colors[0] ? colors[0] : undefined,
          }}
          onClick={() => handleEvolutionClick(pokemonId, pokemonName)}
          title={`Click to view ${displayName}`}
        >
          <div
            className="w-16 h-16 rounded-lg p-2 flex items-center justify-center"
            style={{
              background: colors[0]
                ? `linear-gradient(135deg, ${colors[0]}20, ${colors[0]}10)`
                : undefined,
              backgroundColor: colors[0] ? `${colors[0]}15` : undefined,
            }}
          >
            <ImageWithFallback
              src={
                isShiny
                  ? `/images/pokemon/front/shiny/${pokemonId}.png`
                  : `/images/pokemon/front/${pokemonId}.png`
              }
              alt={displayName}
              width={48}
              height={48}
              className="max-w-full max-h-full"
              style={{ imageRendering: 'pixelated' }}
              pokemonId={pokemonId}
              isShiny={isShiny}
              fallbackSrc={
                isShiny
                  ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`
                  : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
              }
            />
          </div>
          <div className="text-center">
            <div className="font-medium text-sm capitalize">{displayName}</div>
            <div className="text-xs text-muted-foreground">
              #{pokemonId.toString().padStart(3, '0')}
            </div>
          </div>
        </div>

        {chain.evolves_to && chain.evolves_to.length > 0 && (
          <div className="mt-4 flex flex-col items-center space-y-4">
            <div className="text-xs text-muted-foreground">↓</div>
            <div className="flex flex-wrap justify-center gap-4">
              {chain.evolves_to.map(evolution => renderEvolutionChain(evolution, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Pokemon Sprite */}
      {pokemonData && (
        <div className="flex justify-center mb-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <img
              key={`${pokemonData.sprite}-${spriteKey}`}
              src={pokemonData.sprite}
              alt={pokemonData.name}
              width={192}
              height={192}
              className="max-w-full max-h-full"
              style={{ imageRendering: 'pixelated' }}
              onError={e => {
                console.log('Image failed to load:', pokemonData.sprite);
                e.currentTarget.src = getPokeApiImageUrl(pokemonData.id, pokemonData.isShiny);
              }}
            />
            {/* Shiny Button in Top-Right Corner */}
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 h-8 w-8 rounded-full p-0 ${
                isShiny ? 'text-yellow-500' : 'text-muted-foreground'
              }`}
              onClick={handleShinyToggle}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Species Text */}
      {pokemonData && (
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            {pokemonData.genus ? `The ${pokemonData.genus} Pokémon` : 'Pokémon'}
          </p>
        </div>
      )}

      {/* Search Controls */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={pokemonInput}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Golduck"
              className="pl-10 pr-12"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
              disabled={isLoading}
              style={{
                backgroundColor: colors[0] || undefined,
                color: colors[0] ? getContrastColor(colors[0]) : undefined,
                borderColor: colors[0] || undefined,
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted ${
                      index === selectedSuggestionIndex ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="w-8 h-8 flex-shrink-0">
                      <ImageWithFallback
                        src={
                          isShiny
                            ? `/images/pokemon/front/shiny/${suggestion.id}.png`
                            : `/images/pokemon/front/${suggestion.id}.png`
                        }
                        alt={suggestion.name}
                        width={32}
                        height={32}
                        className="w-full h-full"
                        style={{ imageRendering: 'pixelated' }}
                        pokemonId={suggestion.id}
                        isShiny={isShiny}
                        fallbackSrc={
                          isShiny
                            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${suggestion.id}.png`
                            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${suggestion.id}.png`
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium capitalize">
                        {suggestion.name.replace(/-/g, ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        #{suggestion.id.toString().padStart(3, '0')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Dex Number and Randomize Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDexNumberChange('down')}
              disabled={isLoading || parseInt(dexNumber) <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Dex:</span>
              <Input
                type="number"
                value={dexNumber}
                onChange={e => handleDexNumberInputChange(e.target.value)}
                className="text-center w-16 h-8"
                min="1"
                max="1025"
                disabled={isLoading}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDexNumberChange('up')}
              disabled={isLoading || parseInt(dexNumber) >= 1025}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRandomize}
            disabled={isLoading}
            className="flex items-center gap-2 ml-auto"
          >
            <Shuffle className="h-4 w-4" />
            Randomize
          </Button>
        </div>
      </div>

      {/* Error and Loading States */}
      {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}
      {isLoading && (
        <div className="text-center text-muted-foreground text-sm mb-4">Loading Pokemon...</div>
      )}

      {/* Tabs */}
      {pokemonData && (
        <Tabs defaultValue="information" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="forms">Forms & Evolutions</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="information" className="space-y-4 mt-4">
            {/* Type */}
            {pokemonData.types && (
              <div>
                <h4 className="font-medium mb-2">Type</h4>
                <div className="flex gap-2">
                  {pokemonData.types.map(type => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        type === 'normal'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          : type === 'fire'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : type === 'water'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : type === 'electric'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : type === 'grass'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : type === 'ice'
                          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
                          : type === 'fighting'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : type === 'poison'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : type === 'ground'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : type === 'flying'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : type === 'psychic'
                          ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
                          : type === 'bug'
                          ? 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300'
                          : type === 'rock'
                          ? 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300'
                          : type === 'ghost'
                          ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
                          : type === 'dragon'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : type === 'dark'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          : type === 'steel'
                          ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                          : type === 'fairy'
                          ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Height and Weight */}
            {(pokemonData.height || pokemonData.weight) && (
              <div className="grid grid-cols-2 gap-4">
                {pokemonData.height && (
                  <div>
                    <h4 className="font-medium mb-1">Height</h4>
                    <p className="text-sm text-muted-foreground">{pokemonData.height} m</p>
                  </div>
                )}
                {pokemonData.weight && (
                  <div>
                    <h4 className="font-medium mb-1">Weight</h4>
                    <p className="text-sm text-muted-foreground">{pokemonData.weight} kg</p>
                  </div>
                )}
              </div>
            )}

            {/* Base Stats */}
            {pokemonData.baseStats && (
              <div>
                <h4 className="font-medium mb-2">Base Stats</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>HP</span>
                    <span>{pokemonData.baseStats.hp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attack</span>
                    <span>{pokemonData.baseStats.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Defense</span>
                    <span>{pokemonData.baseStats.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed</span>
                    <span>{pokemonData.baseStats.speed}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Abilities */}
            {pokemonData.abilities && pokemonData.abilities.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {pokemonData.abilities.map(ability => (
                    <span
                      key={ability}
                      className="px-2 py-1 bg-background/50 rounded text-xs capitalize"
                    >
                      {ability.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Future Updates Message */}
            <div className="text-center text-muted-foreground text-sm pt-4">
              More Pokémon details coming in future updates
            </div>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4 mt-4">
            {/* Forms Section */}
            {forms.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Forms</h4>
                <div className="grid grid-cols-2 gap-3">
                  {forms.map((form, index) => {
                    // Extract form ID from URL if not provided directly
                    let actualFormId = form.form_id;
                    if (!actualFormId && form.url) {
                      const urlParts = form.url.split('/');
                      const formIdFromUrl = parseInt(urlParts[urlParts.length - 2]);
                      if (!isNaN(formIdFromUrl)) {
                        actualFormId = formIdFromUrl;
                      }
                    }

                    // Determine the best sprite URL for this form
                    let formSpriteUrl: string;
                    let formFallbackUrl: string;

                    if (form.sprites?.front_default) {
                      // Use the form's specific sprite
                      formSpriteUrl = form.sprites.front_default;
                      formFallbackUrl = form.sprites.front_shiny || formSpriteUrl;
                    } else if (actualFormId && actualFormId !== pokemonData.id) {
                      // For forms with different IDs, use PokeAPI
                      formSpriteUrl = isShiny
                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${actualFormId}.png`
                        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${actualFormId}.png`;
                      formFallbackUrl = isShiny
                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${actualFormId}.png`
                        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${actualFormId}.png`;
                    } else {
                      // Fallback to current Pokemon's sprite
                      formSpriteUrl = isShiny
                        ? `/images/pokemon/front/shiny/${pokemonData.id}.png`
                        : `/images/pokemon/front/${pokemonData.id}.png`;
                      formFallbackUrl = isShiny
                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonData.id}.png`
                        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;
                    }

                    return (
                      <div
                        key={index}
                        className="bg-background/50 rounded-lg p-3 border cursor-pointer transition-all hover:bg-background/80 hover:border-blue-300 hover:shadow-md"
                        onClick={() => handleFormClick(form)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded flex items-center justify-center">
                            <ImageWithFallback
                              src={formSpriteUrl}
                              alt={form.name}
                              width={24}
                              height={24}
                              className="max-w-full max-h-full"
                              style={{ imageRendering: 'pixelated' }}
                              pokemonId={actualFormId || pokemonData.id}
                              isShiny={isShiny}
                              fallbackSrc={formFallbackUrl}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm capitalize">
                              {form.display_name || form.name.replace(/-/g, ' ')}
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getFormTypeColor(
                                form
                              )}`}
                            >
                              {getFormTypeLabel(form)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evolution Chain Section */}
            {evolutionChain && (
              <div>
                <h4 className="font-medium mb-3">Evolution Chain</h4>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex justify-center">
                    {renderEvolutionChain(evolutionChain.chain)}
                  </div>
                </div>
              </div>
            )}

            {/* No Data Message */}
            {forms.length === 0 && !evolutionChain && (
              <div className="text-center text-muted-foreground text-sm">
                No forms or evolution data available for this Pokemon.
              </div>
            )}
          </TabsContent>

          <TabsContent value="colors" className="space-y-3 mt-4">
            {isExtractingColors ? (
              <div className="text-center text-muted-foreground text-sm">Extracting colors...</div>
            ) : extractedColors.length > 0 ? (
              <div>
                <h4 className="font-medium mb-3">Color Palette</h4>
                <div className="grid grid-cols-2 gap-3">
                  {extractedColors.map((color, index) => {
                    const colorFormats = convertColor(color);
                    return (
                      <div
                        key={index}
                        className="group relative bg-background/50 rounded-lg p-3 cursor-pointer transition-all hover:bg-background/80"
                        onClick={() => copyColor(color)}
                      >
                        <div
                          className="w-full h-8 rounded mb-2 border"
                          style={{ backgroundColor: color }}
                        />
                        <div className="space-y-1 text-xs">
                          <div className="font-mono">{colorFormats.hex.toUpperCase()}</div>
                          <div className="font-mono text-muted-foreground">{colorFormats.rgb}</div>
                          <div className="font-mono text-muted-foreground">{colorFormats.hsl}</div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedColor === color ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm">
                No colors extracted yet. Load a Pokemon to see its color palette!
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
