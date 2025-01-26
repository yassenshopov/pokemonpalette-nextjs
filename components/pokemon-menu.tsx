'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import ColorThief from 'colorthief';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useColors } from '@/contexts/color-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import speciesData from '@/data/species.json';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

const PokemonService = {
  async fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );
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

  async fetchEvolutionChain(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Evolution chain not found');
    return response.json();
  },

  getSpeciesId(name: string): number | null {
    return (speciesData as Record<string, number>)[name.toLowerCase()] || null;
  },

  async fetchPokemonForm(id: string): Promise<PokemonForm> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-form/${id}`
    );
    if (!response.ok) throw new Error('Pokemon form not found');
    return response.json();
  },
};

export function PokemonMenu() {
  // Pokemon data state
  const [pokemonName, setPokemonName] = useState('ninetales');
  const [dexNumber, setDexNumber] = useState('38');
  const [spriteUrl, setSpriteUrl] = useState('');
  const [speciesTitle, setSpeciesTitle] = useState('Select a Pokémon');

  // UI state
  const [isShiny, setIsShiny] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bgColors, setBgColors] = useState<string[]>([]);
  const [currentForm, setCurrentForm] = useState<string>('');
  const [availableForms, setAvailableForms] = useState<PokemonFormOption[]>([]);
  const [baseSpeciesId, setBaseSpeciesId] = useState<number>(0);
  const [nextEvolution, setNextEvolution] = useState<string | null>(null);
  const [evolutionOptions, setEvolutionOptions] = useState<EvolutionOption[]>(
    []
  );
  const {
    setColors,
    setPokemonName: setContextPokemonName,
    setShiny,
    setForm,
  } = useColors();
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Color extraction
  const extractColors = async (imageUrl: string) => {
    const img = new Image();
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
        const formData = await PokemonService.fetchPokemonForm(
          identifier.toString()
        );
        // Convert form data to match Pokemon interface structure
        data = {
          id: formData.id,
          name: formData.pokemon.name,
          sprites: {
            front_default: formData.sprites.front_default,
            front_shiny: formData.sprites.front_shiny,
          },
          forms: [], // Forms data isn't needed for form display
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
            (g: { genus: string; language: { name: string } }) =>
              g.language.name === 'en'
          )?.genus || 'Unknown Pokemon';

        setSpeciesTitle(englishGenus);

        // Updated evolution chain logic
        const evoChain = await PokemonService.fetchEvolutionChain(
          speciesData.evolution_chain.url
        );
        let currentEvo = evoChain.chain;

        // Find current Pokemon in evolution chain
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
              evo.evolves_to.some((e) => e.species.name === data.name) ||
              evo.species.name === data.name
          );

          if (!nextEvo) break;
          currentEvo = nextEvo;
        }
      }

      const newSpriteUrl = isShiny
        ? data.sprites.front_shiny
        : data.sprites.front_default;

      setPokemonName(data.name);
      setContextPokemonName(data.name.replace(/-/g, ' '));
      setSpriteUrl(newSpriteUrl || '');

      if (newSpriteUrl) {
        extractColors(newSpriteUrl);
      }
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
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
      console.warn('Invalid Pokemon name');
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
    const selectedForm = availableForms.find((f) => f.id === form);
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
      const selectedForm = availableForms.find((f) => f.id === currentForm);
      handlePokemonFetch(currentForm, true, selectedForm?.type === 'form');
    }
  }, [isShiny]);

  // Add useEffect to fetch initial Pokemon on mount
  useEffect(() => {
    handlePokemonFetch(38);
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
  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...bgColors];
    newColors[index] = newColor;
    setBgColors(newColors);
    setColors(newColors);
  };

  // Add these helper functions at the top of your component
  const getRGBFromString = (color: string) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return [0, 0, 0];
    return rgb.map(Number);
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
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

  const getContrastColor = (
    bgColor: string
  ): { text: string; overlay: string } => {
    if (!bgColor) return { text: 'text-foreground', overlay: '' };

    const whiteContrast = getContrastRatio(bgColor, 'rgb(255, 255, 255)');
    const blackContrast = getContrastRatio(bgColor, 'rgb(0, 0, 0)');

    const needsOverlay = Math.max(whiteContrast, blackContrast) < 4.5;
    const textColor =
      whiteContrast > blackContrast ? 'text-white' : 'text-black';

    return {
      text: textColor,
      overlay: needsOverlay ? 'bg-black/10 dark:bg-white/10' : '',
    };
  };

  // Add a state to track the previous input value
  const [previousInputValue, setPreviousInputValue] = useState('');

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
    }

    // Focus the input field to prevent losing focus
    inputRef.current?.focus(); // Ensure the input retains focus

    // Update the previous input value
    setPreviousInputValue(value);
  };

  // Add this to the suggestion button onClick
  const handleSuggestionSelect = (suggestion: PokemonSuggestion) => {
    setPokemonName(suggestion.name);
    setShowSuggestions(false);
    handleNameSubmit(suggestion.name);
    inputRef.current?.focus(); // Ensure the input retains focus after selection
  };

  // Utility function to capitalize the first letter of each word
  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Add this near your other useEffect hooks
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const buttons = document.querySelectorAll('.shiny-active');
      buttons.forEach((button) => {
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

  const [lockedColors, setLockedColors] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

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
      speciesData.varieties.forEach((v) => {
        // Skip totem varieties and Own Tempo Rockruff
        if (
          !v.pokemon.name.toLowerCase().includes('totem') &&
          !v.pokemon.name.toLowerCase().includes('own-tempo')
        ) {
          options.push({
            name: v.pokemon.name.replace(/-/g, ' '),
            id: v.pokemon.url.split('/').slice(-2, -1)[0],
            type: 'variety',
            isDefault: v.is_default,
          });
        }
      });
    }

    // Process forms from pokemon data
    if (pokemonData.forms) {
      const baseName = pokemonData.name.toLowerCase();
      pokemonData.forms.forEach((form) => {
        // Skip if this form matches an existing variety or is a totem/own-tempo form
        const isExcluded =
          form.name.toLowerCase().includes('totem') ||
          form.url.toLowerCase().includes('totem') ||
          form.name.toLowerCase().includes('own-tempo');

        if (
          !options.some(
            (opt) => opt.id === form.url.split('/').slice(-2, -1)[0]
          ) &&
          !isExcluded
        ) {
          let displayName = form.name.toLowerCase();
          displayName =
            displayName === baseName
              ? 'Default'
              : displayName.replace(`${baseName}-`, '').replace(/-/g, ' ');

          options.push({
            name: displayName,
            id: form.url.split('/').slice(-2, -1)[0],
            type: 'form',
          });
        }
      });
    }

    // Capitalize all names
    return options.map((option) => ({
      ...option,
      name: option.name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }));
  };

  return (
    <Card
      className="w-[100%] h-[600px] pt-12"
      style={{
        border: 'none',
        boxShadow: 'none',
      }}
      // style={gradientStyle}
    >
      <div className="absolute top-8 left-8 flex items-center justify-start">
        <img
          src="/logo512.png"
          alt="App Logo"
          className={`h-[15%] w-[15%] ${isRotating ? 'animate-rotate' : ''}`}
          style={{
            filter: `hue-rotate(${
              bgColors.length > 0 ? getHueFromColor(bgColors[0]) : 0
            }deg)`,
          }}
        />
      </div>
      <CardContent className="flex flex-col items-center h-[calc(100%-60px)] p-6">
        {/* Top Section: Sprite */}
        <div className="flex-none h-36 flex items-center justify-center">
          {spriteUrl && (
            <div
              className={`relative transition-opacity duration-200 ${
                isLoading ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <img
                src={spriteUrl}
                alt={pokemonName}
                className={`h-40 w-40 ${isLoading ? 'animate-pulse' : ''}`}
                style={{ imageRendering: 'pixelated' }}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
        <CardHeader className="h-[60px]">
          <CardTitle className="text-center text-xl">
            The {speciesTitle}
          </CardTitle>
        </CardHeader>

        {/* Main Section: Controls */}
        <div className="w-full space-y-8">
          {/* Name Input */}
          <div className="space-y-3 relative">
            <div className="text-center text-md font-thin italic">Name:</div>
            <div className="flex items-center justify-center w-full mx-auto gap-2">
              <Button
                variant="outline"
                className={`h-8 w-8 relative invisible ${
                  isShiny ? 'shiny-active' : ''
                }`}
                onClick={() => setIsShiny(!isShiny)}
                disabled={isLoading}
              >
                <Sparkles
                  className={`h-4 w-4 transition-colors duration-300 sparkle-icon ${
                    isShiny ? 'text-yellow-500' : ''
                  }`}
                />
                <div className="absolute inset-0 h-4 w-4 pointer-events-none shiny-overlay" />
              </Button>
              <div className="flex items-center justify-center w-full mx-auto gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={pokemonName}
                  onChange={(e) => handleNameInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNameSubmit(pokemonName);
                      setShowSuggestions(false);
                    }
                  }}
                  className="text-center capitalize bg-background w-3/4 mx-auto m-0"
                />
                {showSuggestions && (
                  <div className="absolute z-10 w-[50%] p-0 bg-background border rounded-md shadow-lg top-20 h-fit">
                    <ScrollArea className="max-h-[200px]">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.name}
                          className="w-full px-4 py-2 text-left capitalize hover:bg-accent cursor-pointer flex items-center gap-2 border-b border-gray-200 dark:border-gray-800"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          <img
                            src={suggestion.sprite}
                            alt={suggestion.name}
                            className="w-8 h-8"
                            style={{ imageRendering: 'pixelated' }}
                          />
                          <span>{suggestion.name.replace(/-/g, ' ')}</span>
                        </button>
                      ))}
                    </ScrollArea>
                  </div>
                )}
                <Button
                  variant="outline"
                  className={`h-8 w-8 relative ${
                    isShiny ? 'shiny-active' : ''
                  }`}
                  onClick={() => setIsShiny(!isShiny)}
                  disabled={isLoading}
                >
                  <Sparkles
                    className={`h-4 w-4 transition-colors duration-300 sparkle-icon ${
                      isShiny ? 'text-yellow-500' : ''
                    }`}
                  />
                  <div className="absolute inset-0 h-4 w-4 pointer-events-none shiny-overlay" />
                </Button>
              </div>
            </div>
          </div>

          {/* Dex Number Input */}
          <div className="space-y-3 !mt-2">
            <div className="text-center text-md font-thin italic">
              National Dex No:
            </div>
            <div className="flex items-center justify-center gap-2 w-3/4 mx-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDexNumberChange(-1)}
                disabled={isLoading}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                value={dexNumber}
                onChange={(e) => setDexNumber(e.target.value)}
                className="text-center bg-background text-base"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDexNumberChange(1)}
                disabled={isLoading}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4">
            {/* First row of buttons in a horizontal layout */}
            <div className="flex w-3/4 gap-2">
              <Button
                variant="secondary"
                className="flex-1 text-base cursor-pointer"
                onClick={() =>
                  handlePokemonFetch(Math.floor(Math.random() * 1025) + 1)
                }
                disabled={isLoading}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Random
              </Button>

              {availableForms.length > 1 && (
                <Select value={currentForm} onValueChange={handleFormChange}>
                  <SelectTrigger className="flex-1 bg-background text-base">
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableForms.map((form) => (
                      <SelectItem
                        key={form.id}
                        value={form.id}
                        className="text-base"
                      >
                        <div className="flex items-center gap-2">
                          <span>{form.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {form.type === 'variety' ? '(Variant)' : '(Form)'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Evolution section with fixed height */}
            <div className="w-full h-[52px] flex flex-col items-center">
              {evolutionOptions.length > 0 ? (
                // Evolution content
                <div className="w-full flex flex-col items-center">
                  {evolutionOptions.length === 1 ? (
                    // Single evolution - direct button
                    <Button
                      variant="outline"
                      className="w-3/4 text-base"
                      disabled={isLoading}
                      onClick={() =>
                        handlePokemonFetch(evolutionOptions[0].name)
                      }
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          isShiny ? 'shiny/' : ''
                        }${PokemonService.getSpeciesId(
                          evolutionOptions[0].name
                        )}.png`}
                        alt={evolutionOptions[0].name}
                        className="w-6 h-6 mr-2"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      Evolve to{' '}
                      {capitalize(evolutionOptions[0].name.replace(/-/g, ' '))}
                    </Button>
                  ) : (
                    // Multiple evolutions - popover
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-3/4 text-base"
                          disabled={isLoading}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Choose Evolution
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-4">
                          <h4 className="font-medium">Evolution Options</h4>
                          <div className="space-y-2">
                            {evolutionOptions.map((evo) => (
                              <Button
                                key={evo.name}
                                variant="ghost"
                                className="w-full justify-start text-left"
                                onClick={() => {
                                  handlePokemonFetch(evo.name);
                                }}
                              >
                                <div className="flex items-center w-full">
                                  <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                                      isShiny ? 'shiny/' : ''
                                    }${PokemonService.getSpeciesId(
                                      evo.name
                                    )}.png`}
                                    alt={evo.name}
                                    className="w-8 h-8 mr-2"
                                    style={{ imageRendering: 'pixelated' }}
                                  />
                                  <div className="flex flex-col">
                                    <span className="capitalize">
                                      {capitalize(evo.name.replace(/-/g, ' '))}
                                    </span>
                                    {evo.condition && (
                                      <span className="text-sm text-muted-foreground">
                                        {evo.condition}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ) : (
                // Empty placeholder to maintain height
                <div className="h-10" />
              )}
            </div>
          </div>
        </div>

        {/* Color Editor Section */}
        {bgColors.length > 0 && (
          <div className="w-full space-y-2 mt-4">
            <div className="text-center text-sm text-muted-foreground pb-4">
              Colors:
            </div>
            <div className="flex flex-col space-y-4 px-4 items-center">
              {bgColors.map((color, index) => {
                // Add color labels
                const colorLabel =
                  index === 0
                    ? 'Primary'
                    : index === 1
                    ? 'Secondary'
                    : 'Accent';

                return (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <div
                        className={`flex items-center space-x-4 group cursor-pointer opacity-100 hover:opacity-80 rounded-lg p-2 transition-colors ${
                          lockedColors[index] ? 'bg-muted' : ''
                        }`}
                        draggable
                        style={{ cursor: 'grab' }}
                        onDragStart={(e) =>
                          e.dataTransfer.setData('text/plain', index.toString())
                        }
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const fromIndex = parseInt(
                            e.dataTransfer.getData('text/plain')
                          );
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
                        <div className="flex flex-col items-center mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <LucideGripVertical className="h-4 w-4 text-gray-500 mb-1" />
                        </div>
                        <span
                          className={`text-sm font-medium min-w-[80px] text-center border border-gray-300 rounded-full px-3 py-1 w-24 ${
                            getContrastColor(color).text
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {colorLabel}
                        </span>
                        <div className="text-base font-mono">
                          {color
                            .replace(
                              /rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
                              (_, r, g, b) =>
                                '#' +
                                [r, g, b]
                                  .map((x) =>
                                    parseInt(x).toString(16).padStart(2, '0')
                                  )
                                  .join('')
                            )
                            .toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-12 w-12 rounded-full cursor-pointer transition-transform hover:scale-105 relative"
                            style={{ backgroundColor: color }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-full">
                              <div
                                className={`text-sm font-medium ${
                                  getContrastColor(color).text
                                }`}
                              >
                                <Pencil className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLock(index);
                            }}
                          >
                            {lockedColors[index] ? (
                              <Lock className="h-4 w-4" strokeWidth={3} />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-4">
                        <h4 className="font-medium">Edit Color {index + 1}</h4>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={color.replace(
                                /rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
                                (_, r, g, b) =>
                                  '#' +
                                  [r, g, b]
                                    .map((x) =>
                                      parseInt(x).toString(16).padStart(2, '0')
                                    )
                                    .join('')
                              )}
                              onChange={(e) => {
                                const hex = e.target.value;
                                const r = parseInt(hex.slice(1, 3), 16);
                                const g = parseInt(hex.slice(3, 5), 16);
                                const b = parseInt(hex.slice(5, 7), 16);
                                handleColorChange(
                                  index,
                                  `rgb(${r}, ${g}, ${b})`
                                );
                              }}
                              className="w-full h-8 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={color}
                            onChange={(e) =>
                              handleColorChange(index, e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
