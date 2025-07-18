'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChevronUp,
  ChevronDown,
  Shuffle,
  Sparkles,
  ArrowRight,
  Pencil,
  LucideGripVertical,
  Lock,
  Unlock,
  Search,
} from 'lucide-react';
import ColorThief from 'colorthief';
import { useColors } from '@/contexts/color-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import speciesData from '@/data/species.json';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';
import { PokemonSpriteSkeleton } from '@/components/ui/skeleton';

interface PokemonSpecies {
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    other?: {
      home?: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  forms: Array<{
    name: string;
    url: string;
  }>;
  varieties?: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
  height: number;
  weight: number;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}

interface EvolutionOption {
  name: string;
  condition?: string;
}

interface EvolutionChain {
  species: {
    name: string;
  };
  evolves_to: Array<{
    species: {
      name: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
      };
    }>;
  }>;
}

interface PokemonSuggestion {
  name: string;
  id: number;
  sprite: string;
}

interface PokemonFormOption {
  name: string;
  id: string;
  type: 'form' | 'variety';
  isDefault?: boolean;
  sprite?: string;
}

interface PokemonForm {
  id: number;
  name: string;
  form_name: string;
  pokemon: {
    name: string;
    url: string;
  };
  sprites: {
    front_default: string;
    front_shiny: string;
  };
}

// New interface for evolution chain display
interface EvolutionStage {
  name: string;
  id: number;
  isCurrent: boolean;
  condition?: string;
}

const PokemonService = {
  async fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!response.ok) throw new Error('Species not found');
    return response.json();
  },

  async fetchPokemon(identifier: string | number): Promise<Pokemon> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${identifier.toString().toLowerCase()}`
    );
    if (!response.ok) throw new Error('Pokemon not found');
    return response.json();
  },

  async fetchEvolutionChain(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Evolution chain not found');
    return response.json();
  },

  getSpeciesId(name: string): number | null {
    return (speciesData as Record<string, number>)[name.toLowerCase()] || null;
  },

  async fetchPokemonForm(id: string): Promise<PokemonForm> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}`);
    if (!response.ok) throw new Error('Pokemon form not found');
    return response.json();
  },
};

export function PokemonMenu() {
  // Pokemon data state
  const [pokemonName, setPokemonName] = useState('umbreon');
  const [dexNumber, setDexNumber] = useState('197');
  const [spriteUrl, setSpriteUrl] = useState('');
  const [speciesTitle, setSpeciesTitle] = useState('Select a Pokémon');
  const [pokemonData, setPokemonData] = useState<{
    height?: number;
    weight?: number;
    types?: string[];
  }>({});

  // UI state
  const [isShiny, setIsShiny] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bgColors, setBgColors] = useState<string[]>([]);
  const [currentForm, setCurrentForm] = useState<string>('');
  const [availableForms, setAvailableForms] = useState<PokemonFormOption[]>([]);
  const [baseSpeciesId, setBaseSpeciesId] = useState<number>(0);
  const [nextEvolution, setNextEvolution] = useState<string | null>(null);
  const [evolutionOptions, setEvolutionOptions] = useState<EvolutionOption[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionStage[][]>([]);
  const { setColors, setPokemonName: setContextPokemonName, setShiny, setForm } = useColors();
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  // Add tab state
  const [activeTab, setActiveTab] = useState<'info' | 'forms' | 'colors'>('colors');

  // Color extraction
  const extractColors = async (imageUrl: string) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 3);
      const hexColors = palette.map((rgb: number[]) => {
        const [r, g, b] = rgb;
        return `rgb(${r}, ${g}, ${b})`;
      });

      // Create new colors array respecting locked colors
      const newColors = hexColors.map((color, index) => {
        return lockedColors[index] ? bgColors[index] : color;
      });

      setBgColors(newColors);
      setColors(newColors);
      setShiny(isShiny);
      setForm(currentForm);

      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 1000);
    };

    img.src = imageUrl;
  };

  // Event handlers
  const handlePokemonFetch = async (
    identifier: string | number,
    skipSpecies?: boolean,
    isForm?: boolean
  ) => {
    setIsLoading(true);
    setShowSuggestions(false);
    try {
      let data;

      if (isForm) {
        // Fetch form data
        const formData = await PokemonService.fetchPokemonForm(identifier.toString());
        // Convert form data to match Pokemon interface structure
        data = {
          id: formData.id,
          name: formData.pokemon.name,
          sprites: {
            front_default: formData.sprites.front_default,
            front_shiny: formData.sprites.front_shiny,
          },
          forms: [], // Forms data isn't needed for form display
          height: 0, // Default value as forms don't have height data
          weight: 0, // Default value as forms don't have weight data
          types: [], // Default value as forms don't have types data
        };
      } else {
        // Convert name to ID if string is provided
        if (typeof identifier === 'string' && isNaN(Number(identifier))) {
          const speciesId = PokemonService.getSpeciesId(identifier);
          if (speciesId) {
            identifier = speciesId;
          }
        }
        data = await PokemonService.fetchPokemon(identifier);

        // Store Pokemon's height, weight and types
        setPokemonData({
          height: data.height / 10, // Convert to meters
          weight: data.weight / 10, // Convert to kg
          types: data.types?.map((t: { type: { name: string } }) => t.type.name) || [],
        });
      }

      if (!skipSpecies) {
        const speciesData = await PokemonService.fetchPokemonSpecies(data.id);
        setBaseSpeciesId(data.id);

        const forms = processFormsAndVarieties(speciesData, data);
        setAvailableForms(forms);
        setCurrentForm(data.id.toString());
        setDexNumber(data.id.toString());

        const englishGenus =
          speciesData.genera.find(
            (g: { genus: string; language: { name: string } }) => g.language.name === 'en'
          )?.genus || 'Unknown Pokemon';

        setSpeciesTitle(englishGenus);

        // Updated evolution chain logic
        const evoChain = await PokemonService.fetchEvolutionChain(speciesData.evolution_chain.url);

        // Extract full evolution chain
        const extractedChain = extractEvolutionChain(evoChain.chain, data.name);
        setEvolutionChain(extractedChain);

        // Set evolution options (for backward compatibility)
        let currentEvo = evoChain.chain;
        while (currentEvo) {
          if (currentEvo.species.name === data.name) {
            // Get all possible evolutions with their conditions
            const evolutions = currentEvo.evolves_to.map(
              (evo: EvolutionChain['evolves_to'][0]) => ({
                name: evo.species.name,
                condition: getEvolutionCondition(evo),
              })
            );
            setEvolutionOptions(evolutions);
            break;
          }

          // Check next evolution set
          const nextEvo = currentEvo.evolves_to.find(
            (evo: EvolutionChain['evolves_to'][0]) =>
              evo.evolves_to.some(e => e.species.name === data.name) ||
              evo.species.name === data.name
          );

          if (!nextEvo) break;
          currentEvo = nextEvo;
        }
      }

      const newSpriteUrl = isShiny ? data.sprites.front_shiny : data.sprites.front_default;

      setPokemonName(data.name);
      setContextPokemonName(data.name.replace(/-/g, ' '));
      setSpriteUrl(newSpriteUrl || '');

      if (newSpriteUrl) {
        extractColors(newSpriteUrl);
      }
    } catch (error) {
      logger.error('Failed to fetch Pokemon data', error, { identifier });
      setSpriteUrl('');
      if (!skipSpecies) {
        setSpeciesTitle('Select a Pokémon');
        setAvailableForms([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add name validation
  const handleNameSubmit = (name: string) => {
    const speciesId = PokemonService.getSpeciesId(name);
    if (speciesId) {
      handlePokemonFetch(speciesId);
    } else {
      // Handle invalid name
      logger.warn('Invalid Pokemon name provided', { name });
    }
  };

  // Optimize dex number validation
  const handleDexNumberChange = (change: number) => {
    const newNumber = Math.max(
      1,
      Math.min(Object.keys(speciesData).length, parseInt(dexNumber) + change)
    );
    setDexNumber(newNumber.toString());
  };

  // Add form change handler
  const handleFormChange = (form: string) => {
    setCurrentForm(form);
    const selectedForm = availableForms.find(f => f.id === form);
    handlePokemonFetch(form, true, selectedForm?.type === 'form');
  };

  // Effects
  useEffect(() => {
    if (dexNumber) {
      handlePokemonFetch(dexNumber);
    }
  }, [dexNumber]);

  useEffect(() => {
    if (currentForm) {
      const selectedForm = availableForms.find(f => f.id === currentForm);
      handlePokemonFetch(currentForm, true, selectedForm?.type === 'form');

      // Update sprite URLs for forms when shiny state changes
      if (baseSpeciesId) {
        setAvailableForms(prevForms =>
          prevForms.map(form => ({
            ...form,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              isShiny ? 'shiny/' : ''
            }${form.id}.png`,
          }))
        );
      }
    }
  }, [isShiny]);

  // Add useEffect to fetch initial Pokemon on mount
  useEffect(() => {
    handlePokemonFetch(197);
  }, []);

  // Render helpers
  const gradientStyle = bgColors.length
    ? {
        background: `linear-gradient(180deg, 
      ${bgColors[0]} 0%, 
      ${bgColors[0]} 33.33%, 
      ${bgColors[1]} 33.33%, 
      ${bgColors[1]} 66.66%, 
      ${bgColors[2]} 66.66%, 
      ${bgColors[2]} 100%)`,
      }
    : {};

  // Helper function to get evolution conditions
  const getEvolutionCondition = (evo: any): string => {
    if (evo.trigger?.name === 'level-up') {
      if (evo.min_level) return `Level ${evo.min_level}`;
      if (evo.min_happiness) return 'High Friendship';
      if (evo.time_of_day) return `${evo.time_of_day} time`;
    }
    if (evo.trigger?.name === 'use-item') {
      return evo.item?.name.replace('-', ' ') || 'Use item';
    }
    if (evo.trigger?.name === 'trade') return 'Trade';
    return '';
  };

  // Add color editing function
  const handleColorChange = useCallback(
    (index: number, newColor: string) => {
      const newColors = [...bgColors];
      newColors[index] = newColor;
      setBgColors(newColors);
      setColors(newColors);
    },
    [bgColors, setColors]
  );

  // Add these helper functions at the top of your component
  const getRGBFromString = (color: string) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return [0, 0, 0];
    return rgb.map(Number);
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getContrastRatio = (color1: string, color2: string) => {
    const [r1, g1, b1] = getRGBFromString(color1);
    const [r2, g2, b2] = getRGBFromString(color2);

    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    return (brightest + 0.05) / (darkest + 0.05);
  };

  const getContrastColor = (bgColor: string): { text: string; overlay: string } => {
    if (!bgColor) return { text: 'text-foreground', overlay: '' };

    const whiteContrast = getContrastRatio(bgColor, 'rgb(255, 255, 255)');
    const blackContrast = getContrastRatio(bgColor, 'rgb(0, 0, 0)');

    const needsOverlay = Math.max(whiteContrast, blackContrast) < 4.5;
    const textColor = whiteContrast > blackContrast ? 'text-white' : 'text-black';

    return {
      text: textColor,
      overlay: needsOverlay ? 'bg-black/10 dark:bg-white/10' : '',
    };
  };

  // Add a state to track the previous input value
  const [previousInputValue, setPreviousInputValue] = useState('');
  // Add state for keyboard navigation
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionScrollRef = useRef<HTMLDivElement>(null);
  // Add state to track if scrolling is needed
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  // Add this new function to handle input changes
  const handleNameInputChange = async (value: string) => {
    setPokemonName(value);

    // Only update suggestions if the input value has changed
    if (value !== previousInputValue) {
      // Filter species that start with the input value
      const matches = Object.entries(speciesData)
        .filter(([name]) => name.toLowerCase().startsWith(value.toLowerCase()))
        .map(([name, id]) => ({
          name,
          id,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            isShiny ? 'shiny/' : ''
          }${id}.png`,
        }));

      setSuggestions(matches);
      setShowSuggestions(value.length > 1);
      // Reset selected index when suggestions change
      setSelectedSuggestionIndex(-1);
    }

    // Focus the input field to prevent losing focus
    inputRef.current?.focus(); // Ensure the input retains focus

    // Update the previous input value
    setPreviousInputValue(value);
  };

  // Add this to handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => {
        const newIndex = prev < suggestions.length - 1 ? prev + 1 : 0;
        scrollToSuggestion(newIndex);
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : suggestions.length - 1;
        scrollToSuggestion(newIndex);
        return newIndex;
      });
    } else if (e.key === 'Enter') {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
        handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
      } else {
        handleNameSubmit(pokemonName);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Add function to scroll to the selected suggestion
  const scrollToSuggestion = (index: number) => {
    if (!suggestionScrollRef.current) return;

    const scrollContainer = suggestionScrollRef.current;
    const suggestionsItems = scrollContainer.querySelectorAll('button');

    if (index >= 0 && index < suggestionsItems.length) {
      const selectedItem = suggestionsItems[index];
      selectedItem.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  };

  // Add this to the suggestion button onClick
  const handleSuggestionSelect = useCallback(
    (suggestion: PokemonSuggestion) => {
      setPokemonName(suggestion.name);
      setShowSuggestions(false);
      handleNameSubmit(suggestion.name);
      inputRef.current?.focus(); // Ensure the input retains focus after selection
    },
    [handleNameSubmit]
  );

  // Utility function to capitalize the first letter of each word
  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  // Add this near your other useEffect hooks
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const buttons = document.querySelectorAll('.shiny-active');
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        // button.style.setProperty('--mouse-x', `${x}%`);
        // button.style.setProperty('--mouse-y', `${y}%`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const myRef = useRef<HTMLDivElement>(null);

  const getHueFromColor = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map(Number);

    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return Math.round(h * 360); // Convert to degrees
  };

  // Add a new state to control the rotation animation
  const [isRotating, setIsRotating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input

  const [lockedColors, setLockedColors] = useState<boolean[]>([false, false, false]);

  const toggleLock = (index: number) => {
    const newLocked = [...lockedColors];
    newLocked[index] = !newLocked[index];
    setLockedColors(newLocked);
  };

  const processFormsAndVarieties = (
    speciesData: PokemonSpecies,
    pokemonData: Pokemon
  ): PokemonFormOption[] => {
    const options: PokemonFormOption[] = [];

    // Process varieties from species data
    if (speciesData.varieties) {
      speciesData.varieties.forEach(v => {
        // Skip totem varieties and Own Tempo Rockruff
        if (
          !v.pokemon.name.toLowerCase().includes('totem') &&
          !v.pokemon.name.toLowerCase().includes('own-tempo')
        ) {
          const id = v.pokemon.url.split('/').slice(-2, -1)[0];
          options.push({
            name: v.pokemon.name.replace(/-/g, ' '),
            id: id,
            type: 'variety',
            isDefault: v.is_default,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              isShiny ? 'shiny/' : ''
            }${id}.png`,
          });
        }
      });
    }

    // Process forms from pokemon data
    if (pokemonData.forms) {
      const baseName = pokemonData.name.toLowerCase();
      pokemonData.forms.forEach(form => {
        // Skip if this form matches an existing variety or is a totem/own-tempo form
        const isExcluded =
          form.name.toLowerCase().includes('totem') ||
          form.url.toLowerCase().includes('totem') ||
          form.name.toLowerCase().includes('own-tempo');

        const id = form.url.split('/').slice(-2, -1)[0];
        if (!options.some(opt => opt.id === id) && !isExcluded) {
          let displayName = form.name.toLowerCase();
          displayName =
            displayName === baseName
              ? 'Default'
              : displayName.replace(`${baseName}-`, '').replace(/-/g, ' ');

          options.push({
            name: displayName,
            id: id,
            type: 'form',
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              isShiny ? 'shiny/' : ''
            }${id}.png`,
          });
        }
      });
    }

    // Capitalize all names
    return options.map(option => ({
      ...option,
      name: option.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }));
  };

  // New function to extract full evolution chain
  const extractEvolutionChain = (
    chain: any,
    currentPokemonName: string,
    condition?: string,
    depth = 0
  ): EvolutionStage[][] => {
    // Start with base evolution
    const baseSpeciesId = PokemonService.getSpeciesId(chain.species.name) || 0;

    // Log chain data for debugging
    if (depth === 0) {
      logger.debug('Evolution chain extracted', { chain });
    }

    const result: EvolutionStage[][] = [
      [
        {
          name: chain.species.name,
          id: baseSpeciesId,
          isCurrent: chain.species.name === currentPokemonName,
          condition: condition,
        },
      ],
    ];

    // Handle branching evolutions
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      // Handle each evolution path
      const nextStages: EvolutionStage[][] = [];

      chain.evolves_to.forEach((evo: any) => {
        const evoSpeciesId = PokemonService.getSpeciesId(evo.species.name) || 0;
        const isCurrentPokemon = evo.species.name === currentPokemonName;
        const evoCondition = getEvolutionCondition(evo);

        // Check if we already added this stage
        let stage1Found = false;
        for (const stage of nextStages) {
          if (stage.some(p => p.name === evo.species.name)) {
            stage1Found = true;
            break;
          }
        }

        if (!stage1Found) {
          nextStages.push([
            {
              name: evo.species.name,
              id: evoSpeciesId,
              isCurrent: isCurrentPokemon,
              condition: evoCondition,
            },
          ]);
        }

        // Process further evolutions recursively
        if (evo.evolves_to && evo.evolves_to.length > 0) {
          evo.evolves_to.forEach((nextEvo: any) => {
            const nextEvoSpeciesId = PokemonService.getSpeciesId(nextEvo.species.name) || 0;
            const isNextEvoCurrent = nextEvo.species.name === currentPokemonName;
            const nextEvoCondition = getEvolutionCondition(nextEvo);

            // Add stage 2 evolution
            let stage2Found = false;
            for (let i = 2; i < result.length; i++) {
              if (result[i] && result[i].some(p => p.name === nextEvo.species.name)) {
                stage2Found = true;
                break;
              }
            }

            if (!stage2Found) {
              // Make sure we have an array for stage 2
              if (!result[2]) result[2] = [];

              result[2].push({
                name: nextEvo.species.name,
                id: nextEvoSpeciesId,
                isCurrent: isNextEvoCurrent,
                condition: nextEvoCondition,
              });
            }

            // Handle potential stage 3+ evolutions
            if (nextEvo.evolves_to && nextEvo.evolves_to.length > 0) {
              nextEvo.evolves_to.forEach((stage3Evo: any, idx: number) => {
                const stage3Id = PokemonService.getSpeciesId(stage3Evo.species.name) || 0;
                const isStage3Current = stage3Evo.species.name === currentPokemonName;
                const stage3Condition = getEvolutionCondition(stage3Evo);

                // Add stage 3 evolution
                if (!result[3]) result[3] = [];

                result[3].push({
                  name: stage3Evo.species.name,
                  id: stage3Id,
                  isCurrent: isStage3Current,
                  condition: stage3Condition,
                });
              });
            }
          });
        }
      });

      // Add stage 1 evolutions to the result if not already included
      if (nextStages.length > 0 && !result[1]) {
        result[1] = nextStages.flat();
      }
    }

    // Special case handling for Scovillain and other Pokémon with unique evolution mechanisms
    // These might not be properly represented in the standard evolution chain
    if (currentPokemonName === 'scovillain') {
      const capsacidId = PokemonService.getSpeciesId('capsakid') || 0;
      result.length = 0; // Clear the array

      // Create proper evolution chain for Scovillain
      result.push([
        {
          name: 'capsakid',
          id: capsacidId,
          isCurrent: false,
          condition: undefined,
        },
      ]);

      result.push([
        {
          name: 'scovillain',
          id: PokemonService.getSpeciesId('scovillain') || 0,
          isCurrent: true,
          condition: 'Level up with Spicy Extract',
        },
      ]);
    }

    return result;
  };

  // Add function to check if scroll controls should be shown
  const checkScrollControls = () => {
    if (!suggestionScrollRef.current) return;

    const scrollContainer = suggestionScrollRef.current;
    const hasOverflow = scrollContainer.scrollHeight > scrollContainer.clientHeight;

    if (!hasOverflow) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    setCanScrollUp(scrollContainer.scrollTop > 0);
    setCanScrollDown(
      scrollContainer.scrollTop + scrollContainer.clientHeight < scrollContainer.scrollHeight
    );
  };

  // Add scroll handler functions
  const scrollSuggestions = (direction: 'up' | 'down') => {
    if (!suggestionScrollRef.current) return;

    const scrollContainer = suggestionScrollRef.current;
    const scrollAmount = direction === 'up' ? -100 : 100;

    scrollContainer.scrollBy({
      top: scrollAmount,
      behavior: 'smooth',
    });

    // Update scroll controls after scrolling
    setTimeout(checkScrollControls, 100);
  };

  // Update function to show suggestions
  useEffect(() => {
    if (showSuggestions) {
      // Check scroll controls when suggestions are shown
      setTimeout(checkScrollControls, 100);
    }
  }, [showSuggestions, suggestions.length]);

  return (
    <Card
      className="w-full h-full overflow-hidden flex flex-col border-none shadow-none px-2 sm:px-4 md:px-8 mt-16 sm:mt-8"
      // style={{ maxHeight: "calc(100vh - 80px)" }}
    >
      {/* Prominent Pokemon Sprite - INCREASED SIZE */}
      <div className="relative flex-shrink-0 flex items-center justify-center mx-auto p-2 sm:p-4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mt-2 sm:mt-4">
        {isLoading && !spriteUrl ? (
          <PokemonSpriteSkeleton size="lg" />
        ) : spriteUrl ? (
          <div
            className={`w-full h-full relative transition-all duration-300 ${
              isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            } ${isRotating ? 'animate-pulse' : ''}`}
          >
            <Image
              src={spriteUrl}
              alt={pokemonName}
              width={180}
              height={180}
              quality={75}
              style={{ imageRendering: 'pixelated' }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: bgColors[0]
                      ? `${bgColors[0]} transparent ${bgColors[0]} ${bgColors[0]}`
                      : 'var(--primary) transparent var(--primary) var(--primary)',
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
            <div className="text-muted-foreground">No Pokémon</div>
          </div>
        )}

        {/* Shiny toggle button as an overlay */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
            isShiny ? 'bg-yellow-500/10' : 'bg-foreground/5'
          }`}
          onClick={() => setIsShiny(!isShiny)}
          style={{
            backgroundColor: isShiny ? `${bgColors[0] || '#ffc107'}30` : 'var(--background)/10',
          }}
        >
          <Sparkles
            className={`h-4 w-4 ${isShiny ? 'text-yellow-400' : 'text-muted-foreground'}`}
            style={{ color: isShiny ? bgColors[0] || '#ffc107' : undefined }}
          />
        </Button>
      </div>

      {/* Pokemon Header with Name and Species */}
      <div className="px-2 sm:px-6 pb-1 sm:pb-2 text-center">
        <div className="text-sm md:text-md text-muted-foreground">{speciesTitle}</div>
      </div>

      {/* Search and Navigation Controls */}
      <div className="flex flex-col space-y-2 sm:space-y-3 px-2 sm:px-6 pb-2 sm:pb-4">
        {/* Name Search - Enhanced with icon and better styling */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={pokemonName}
            onChange={e => handleNameInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-12 h-10 sm:h-11 text-sm sm:text-base capitalize rounded-full"
            placeholder="Search Pokémon..."
            style={{
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              borderColor: bgColors[0] ? `${bgColors[0]}40` : undefined,
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={() => handleNameSubmit(pokemonName)}
            style={{
              backgroundColor: bgColors[0] ? `${bgColors[0]}20` : undefined,
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          {showSuggestions && (
            <div
              className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg relative overflow-hidden"
              style={{ borderColor: bgColors[0] ? `${bgColors[0]}30` : undefined }}
            >
              {/* Up scroll arrow */}
              {canScrollUp && (
                <div
                  className="absolute top-0 left-0 right-0 z-10 flex justify-center py-1 cursor-pointer bg-gradient-to-b from-background to-transparent"
                  onClick={() => scrollSuggestions('up')}
                >
                  <ChevronUp className="h-4 w-4 opacity-70" />
                </div>
              )}

              <ScrollArea
                className="max-h-[150px] sm:max-h-[200px]"
                onScrollCapture={checkScrollControls}
                ref={suggestionScrollRef}
              >
                {isLoading ? (
                  // Show skeleton loaders while searching
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="px-4 py-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded flex-1 animate-pulse" />
                    </div>
                  ))
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.name}
                      className={`w-full px-4 py-2 text-left capitalize hover:bg-accent cursor-pointer flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 transition-colors ${
                        index === selectedSuggestionIndex ? 'bg-accent' : ''
                      }`}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      style={{
                        borderColor: bgColors[0] ? `${bgColors[0]}20` : undefined,
                      }}
                    >
                      <Image
                        src={suggestion.sprite}
                        alt={suggestion.name}
                        width={32}
                        height={32}
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        quality={50}
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <span className="text-sm">{suggestion.name.replace(/-/g, ' ')}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No Pokémon found
                  </div>
                )}
              </ScrollArea>

              {/* Down scroll arrow */}
              {canScrollDown && (
                <div
                  className="absolute bottom-0 left-0 right-0 z-10 flex justify-center py-1 cursor-pointer bg-gradient-to-t from-background to-transparent"
                  onClick={() => scrollSuggestions('down')}
                >
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dex Controls and Random Button - Mobile optimized layout */}
        <div className="grid grid-cols-2 gap-2">
          {/* Dex input container */}
          <div
            className="flex items-center bg-background/80 border rounded-full py-1 px-2 h-10 shadow-sm"
            style={{ borderColor: bgColors[1] ? `${bgColors[1]}40` : undefined }}
          >
            <div className="font-medium text-xs whitespace-nowrap text-muted-foreground ml-1">
              Dex:
            </div>
            <div className="flex items-center h-8 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-full rounded-full w-6 p-0 sm:p-2"
                onClick={() => handleDexNumberChange(-1)}
                disabled={isLoading}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Input
                type="text"
                value={dexNumber}
                onChange={e => setDexNumber(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handlePokemonFetch(dexNumber);
                  }
                }}
                className="h-full flex-1 text-center border-0 bg-transparent text-sm px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-full rounded-full w-6 p-0 sm:p-2"
                onClick={() => handleDexNumberChange(1)}
                disabled={isLoading}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Randomize button */}
          <Button
            variant="default"
            className="h-10 text-xs sm:text-sm px-4 sm:px-5 rounded-full transition-transform active:scale-95"
            style={{ backgroundColor: bgColors[0] || undefined }}
            onClick={() => handlePokemonFetch(Math.floor(Math.random() * 1025) + 1)}
            disabled={isLoading}
          >
            <Shuffle className="mr-2 h-3.5 w-3.5" />
            Randomize
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b px-2 sm:px-6">
        <div className="flex justify-between sm:justify-start sm:space-x-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium relative whitespace-nowrap flex-1 sm:flex-initial ${
              activeTab === 'info' ? 'text-foreground' : 'text-muted-foreground'
            }`}
            style={activeTab === 'info' ? { color: bgColors[0] || undefined } : {}}
          >
            Information
            {activeTab === 'info' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: bgColors[0] || 'var(--primary)' }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium relative whitespace-nowrap flex-1 sm:flex-initial ${
              activeTab === 'forms' ? 'text-foreground' : 'text-muted-foreground'
            }`}
            style={activeTab === 'forms' ? { color: bgColors[1] || undefined } : {}}
          >
            Forms & Evolutions
            {activeTab === 'forms' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: bgColors[1] || 'var(--primary)' }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium relative whitespace-nowrap flex-1 sm:flex-initial ${
              activeTab === 'colors' ? 'text-foreground' : 'text-muted-foreground'
            }`}
            style={activeTab === 'colors' ? { color: bgColors[2] || undefined } : {}}
          >
            Colors
            {activeTab === 'colors' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: bgColors[2] || 'var(--primary)' }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 p-2 sm:p-4 md:p-6">
        {/* Information Tab - Update with real data */}
        {activeTab === 'info' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Stats Section */}
            {spriteUrl && (
              <>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {/* Type Display */}
                  <div className="bg-background/60 rounded-xl p-2 sm:p-4 flex flex-col items-center justify-center">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      Type
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {pokemonData.types?.map((type, index) => (
                        <div
                          key={index}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-white text-[10px] sm:text-xs font-medium capitalize"
                          style={{
                            backgroundColor:
                              index === 0
                                ? bgColors[0] || 'var(--primary)'
                                : bgColors[1] || 'var(--secondary)',
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Height Display */}
                  <div className="bg-background/60 rounded-xl p-2 sm:p-4 flex flex-col items-center justify-center">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      Height
                    </div>
                    <div className="font-medium text-xs sm:text-base">
                      {pokemonData.height?.toFixed(1) || '?'} m
                    </div>
                  </div>

                  {/* Weight Display */}
                  <div className="bg-background/60 rounded-xl p-2 sm:p-4 flex flex-col items-center justify-center">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      Weight
                    </div>
                    <div className="font-medium text-xs sm:text-base">
                      {pokemonData.weight?.toFixed(1) || '?'} kg
                    </div>
                  </div>
                </div>

                {/* Additional Stats - Base Stats, Abilities, etc. would go here in future versions */}
                <div className="flex items-center justify-center">
                  <div className="text-[10px] sm:text-xs text-muted-foreground text-center">
                    More Pokémon details coming in future updates
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Forms & Evolutions Tab with full evolution chain */}
        {activeTab === 'forms' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Combined Forms & Evolutions Section */}
            <div className="bg-background/60 rounded-xl p-3 sm:p-6 pt-2 sm:pt-3">
              {availableForms.length <= 1 &&
              evolutionChain.flat().filter(pokemon => !pokemon.isCurrent).length === 0 ? (
                <div className="text-center text-xs sm:text-sm text-muted-foreground">
                  This Pokémon has no alternative forms or evolutions.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 justify-items-center">
                  {/* Show forms first */}
                  {availableForms
                    .filter(form => !(form.name === 'Default' && availableForms.length > 1))
                    .map(form => (
                      <button
                        key={`form-${form.id}`}
                        className={`flex flex-col items-center group w-full max-w-[135px] ${
                          currentForm === form.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                        }`}
                        onClick={() => handleFormChange(form.id)}
                      >
                        <div
                          className="w-18 h-18 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-2 transition-colors"
                          style={{
                            backgroundColor:
                              currentForm === form.id
                                ? bgColors[0]
                                  ? `${bgColors[0]}30`
                                  : 'rgba(var(--primary), 0.2)'
                                : 'rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <Image
                            src={
                              form.sprite ||
                              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                                isShiny ? 'shiny/' : ''
                              }${form.id}.png`
                            }
                            alt={form.name}
                            width={72}
                            height={72}
                            quality={50}
                            className="w-16 h-16 sm:w-20 sm:h-20"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        </div>
                        <div
                          className="text-xs sm:text-sm font-medium text-center"
                          style={{
                            color:
                              currentForm === form.id ? bgColors[0] || 'var(--primary)' : undefined,
                          }}
                        >
                          {form.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground text-center">
                          {form.type === 'variety' ? 'Variant' : 'Form'}
                        </div>
                      </button>
                    ))}

                  {/* Evolutions with same styling as forms */}
                  {evolutionChain
                    .flat()
                    .filter(pokemon => !pokemon.isCurrent)
                    .map(pokemon => (
                      <button
                        key={`evo-${pokemon.name}`}
                        onClick={() => handlePokemonFetch(pokemon.id)}
                        className="flex flex-col items-center group w-full max-w-[135px] opacity-80 hover:opacity-100"
                      >
                        <div
                          className="w-18 h-18 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-2 transition-colors bg-black/10 group-hover:bg-black/15"
                          style={{
                            backgroundColor: bgColors[2]
                              ? `${bgColors[2]}20`
                              : 'rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                              isShiny ? 'shiny/' : ''
                            }${pokemon.id}.png`}
                            alt={pokemon.name}
                            width={72}
                            height={72}
                            quality={50}
                            className="w-16 h-16 sm:w-20 sm:h-20"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        </div>
                        <div className="text-xs sm:text-sm font-medium capitalize text-center">
                          {pokemon.name.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground text-center">
                          {pokemon.condition || 'Evolution'}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && bgColors.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {/* Color Editors - Row layout on mobile, column on larger screens */}
            <div className="flex flex-row sm:flex-col gap-2 sm:space-y-3">
              {bgColors.map((color, index) => {
                const colorLabel = index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Accent';
                const hexColor = color
                  .replace(
                    /rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
                    (_, r, g, b) =>
                      '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')
                  )
                  .toUpperCase();

                // Compact mobile card view, more detailed on larger screens
                return (
                  <div
                    key={index}
                    className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center sm:items-center p-2 sm:p-4 border rounded-lg ${
                      lockedColors[index] ? 'bg-muted/40' : ''
                    }`}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('text/plain', index.toString())}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      const toIndex = index;
                      if (fromIndex !== toIndex) {
                        const newColors = [...bgColors];
                        const [movedColor] = newColors.splice(fromIndex, 1);
                        newColors.splice(toIndex, 0, movedColor);
                        setBgColors(newColors);
                        setColors(newColors);
                      }
                    }}
                  >
                    {/* Hide grip on mobile, show on larger screens */}
                    <div className="hidden sm:flex items-center gap-1 mr-2 text-muted-foreground">
                      <LucideGripVertical className="h-4 w-4" />
                    </div>

                    <div
                      className="w-12 h-12 sm:w-10 sm:h-10 rounded-full flex-shrink-0 sm:mr-3 relative cursor-pointer"
                      style={{ backgroundColor: color }}
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20">
                            <Pencil className="h-4 w-4" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="space-y-3">
                            <h4 className="font-medium">{colorLabel} Color</h4>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={hexColor}
                                  onChange={e => {
                                    const hex = e.target.value;
                                    const r = parseInt(hex.slice(1, 3), 16);
                                    const g = parseInt(hex.slice(3, 5), 16);
                                    const b = parseInt(hex.slice(5, 7), 16);
                                    handleColorChange(index, `rgb(${r}, ${g}, ${b})`);
                                  }}
                                  className="w-full h-8 cursor-pointer"
                                />
                              </div>
                              <input
                                type="text"
                                value={hexColor}
                                onChange={e => {
                                  try {
                                    const hex = e.target.value;
                                    if (/^#[0-9A-F]{6}$/i.test(hex)) {
                                      const r = parseInt(hex.slice(1, 3), 16);
                                      const g = parseInt(hex.slice(3, 5), 16);
                                      const b = parseInt(hex.slice(5, 7), 16);
                                      handleColorChange(index, `rgb(${r}, ${g}, ${b})`);
                                    }
                                  } catch (err) {
                                    console.error(
                                      'Invalid color format provided:',
                                      err,
                                      e.target.value
                                    );
                                  }
                                }}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Simplified info for mobile, more detailed for larger screens */}
                    <div className="mt-1 sm:mt-0 sm:flex-1 sm:min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start">
                        <div
                          className="text-xs font-medium py-0.5 px-2 sm:py-1 sm:px-3 rounded-full"
                          style={{
                            backgroundColor: color,
                            color: getContrastColor(color).text.replace('text-', ''),
                          }}
                        >
                          {colorLabel}
                        </div>
                        {lockedColors[index] && (
                          <Lock className="h-3 w-3 mt-1 sm:mt-0 sm:ml-2 text-muted-foreground" />
                        )}
                      </div>
                      <div className="hidden sm:block text-xs font-mono text-muted-foreground mt-1 truncate">
                        {hexColor}
                      </div>
                    </div>

                    {/* Lock/unlock button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-8 sm:w-8 mt-1 sm:mt-0 sm:ml-2"
                      onClick={() => toggleLock(index)}
                    >
                      {lockedColors[index] ? (
                        <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Unlock className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Add a simple color palette preview for mobile */}
            <div className="block sm:hidden">
              <div className="h-12 w-full rounded-md overflow-hidden flex">
                {bgColors.map((color, index) => (
                  <div
                    key={`preview-${index}`}
                    className="flex-1 h-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
