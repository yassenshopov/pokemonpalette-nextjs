'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Shuffle, Sparkles, ArrowRight } from 'lucide-react';
import ColorThief from 'colorthief';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useColors } from "@/contexts/color-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

const PokemonService = {
  async fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!response.ok) throw new Error('Species not found');
    return response.json();
  },
  
  async fetchPokemon(identifier: string | number): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier.toString().toLowerCase()}`);
    if (!response.ok) throw new Error('Pokemon not found');
    return response.json();
  },
  
  async fetchEvolutionChain(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Evolution chain not found');
    return response.json();
  }
};

export function PokemonMenu() {
  // Pokemon data state
  const [pokemonName, setPokemonName] = useState('');
  const [dexNumber, setDexNumber] = useState('197');
  const [spriteUrl, setSpriteUrl] = useState('');
  const [speciesTitle, setSpeciesTitle] = useState('Select a Pokémon');
  
  // UI state
  const [isShiny, setIsShiny] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bgColors, setBgColors] = useState<string[]>([]);
  const [currentForm, setCurrentForm] = useState<string>('');
  const [availableForms, setAvailableForms] = useState<Array<{name: string, id: string}>>([]);
  const [baseSpeciesId, setBaseSpeciesId] = useState<number>(0);
  const [nextEvolution, setNextEvolution] = useState<string | null>(null);
  const [evolutionOptions, setEvolutionOptions] = useState<EvolutionOption[]>([]);
  const { setColors, setPokemonName: setContextPokemonName } = useColors();

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
      setBgColors(hexColors);
      setColors(hexColors);
    };

    img.src = imageUrl;
  };

  // Event handlers
  const handlePokemonFetch = async (identifier: string | number, skipSpecies?: boolean) => {
    setIsLoading(true);
    try {
      const data = await PokemonService.fetchPokemon(identifier);
      
      if (!skipSpecies) {
        const speciesData = await PokemonService.fetchPokemonSpecies(data.id);
        setBaseSpeciesId(data.id);
        
        const forms = speciesData.varieties?.map(v => ({
          name: v.pokemon.name.replace(/-/g, ' ').replace(data.name, '').trim() || 'Default',
          id: v.pokemon.url.split('/').slice(-2, -1)[0]
        })) || [];
        
        setAvailableForms(forms);
        setCurrentForm(data.id.toString());
        setDexNumber(data.id.toString());
        
        const englishGenus = speciesData.genera.find(
          (g: { genus: string; language: { name: string } }) => g.language.name === 'en'
        )?.genus || 'Unknown Pokemon';
        
        setSpeciesTitle(englishGenus);
        
        // Updated evolution chain logic
        const evoChain = await PokemonService.fetchEvolutionChain(speciesData.evolution_chain.url);
        let currentEvo = evoChain.chain;
        
        // Find current Pokemon in evolution chain
        while (currentEvo) {
          if (currentEvo.species.name === data.name) {
            // Get all possible evolutions with their conditions
            const evolutions = currentEvo.evolves_to.map((evo: EvolutionChain['evolves_to'][0]) => ({
              name: evo.species.name,
              condition: getEvolutionCondition(evo)
            }));
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

  const handleDexNumberChange = (change: number) => {
    const newNumber = Math.max(1, Math.min(1020, parseInt(dexNumber) + change));
    setDexNumber(newNumber.toString());
  };

  // Add form change handler
  const handleFormChange = async (formId: string) => {
    setCurrentForm(formId);
    await handlePokemonFetch(formId, true); // Skip species fetch for forms
  };

  // Effects
  useEffect(() => {
    if (dexNumber) {
      handlePokemonFetch(dexNumber);
    }
  }, [dexNumber]);

  useEffect(() => {
    if (currentForm) {
      handlePokemonFetch(currentForm, true);
    }
  }, [isShiny]);

  // Add useEffect to fetch initial Pokemon on mount
  useEffect(() => {
    handlePokemonFetch(197);
  }, []); // Empty dependency array means this runs once on mount

  // Render helpers
  const gradientStyle = bgColors.length ? {
    background: `linear-gradient(180deg, 
      ${bgColors[0]} 0%, 
      ${bgColors[0]} 33.33%, 
      ${bgColors[1]} 33.33%, 
      ${bgColors[1]} 66.66%, 
      ${bgColors[2]} 66.66%, 
      ${bgColors[2]} 100%)`
  } : {};

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

  const getContrastColor = (bgColor: string) => {
    if (!bgColor) return 'text-foreground';
    
    const whiteContrast = getContrastRatio(bgColor, 'rgb(255, 255, 255)');
    const blackContrast = getContrastRatio(bgColor, 'rgb(0, 0, 0)');
    
    // Add a semi-transparent overlay if contrast is too low
    const needsOverlay = Math.max(whiteContrast, blackContrast) < 4.5;
    const textColor = whiteContrast > blackContrast ? 'text-white' : 'text-black';
    
    return {
      text: textColor,
      overlay: needsOverlay ? 'bg-black/10 dark:bg-white/10' : ''
    };
  };

  return (
    <Card className="w-[100%] h-[600px]" style={gradientStyle}>
      <CardHeader className="h-[60px]">
        <CardTitle className="text-center">
          {speciesTitle}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center h-[calc(100%-60px)] p-6">
        {/* Top Section: Sprite */}
        <div className="flex-none h-36 flex items-center justify-center mb-8">
          {spriteUrl && (
            <div className={`relative transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              <img
                src={spriteUrl}
                alt={pokemonName}
                className={`h-36 w-36 ${isLoading ? 'animate-pulse' : ''}`}
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

        {/* Middle Section: Forms (if available) */}
        {availableForms.length > 1 && (
          <div className="flex-none w-3/4 mb-8">
            <Select value={currentForm} onValueChange={handleFormChange}>
              <SelectTrigger className="w-full bg-background text-base">
                <SelectValue placeholder="Select form" />
              </SelectTrigger>
              <SelectContent>
                {availableForms.map((form) => (
                  <SelectItem key={form.id} value={form.id} className="text-base">
                    {form.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Main Section: Controls */}
        <div className="w-full space-y-8">
          {/* Name Input */}
          <div className="space-y-3">
            <div className="text-center text-lg font-medium">Name:</div>
            <Input
              type="text"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePokemonFetch(pokemonName)}
              className="text-center capitalize bg-background text-base w-3/4 mx-auto"
            />
          </div>

          {/* Dex Number Input */}
          <div className="space-y-3">
            <div className="text-center text-lg font-medium">National Dex No:</div>
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
            <Button 
              variant="outline" 
              className="w-3/4 text-base"
              onClick={() => setIsShiny(!isShiny)}
              disabled={isLoading}
            >
              <Sparkles className={`mr-2 h-4 w-4 ${isShiny ? 'text-yellow-500' : ''}`} />
              {isShiny ? 'Normal' : 'Shiny'}
            </Button>

            {evolutionOptions.length > 0 && (
              <div className="w-full flex flex-col items-center space-y-3">
                <div className="text-lg font-medium">Evolution:</div>
                {evolutionOptions.length === 1 ? (
                  <Button 
                    variant="outline" 
                    className="w-3/4 text-base"
                    onClick={() => handlePokemonFetch(evolutionOptions[0].name)}
                    disabled={isLoading}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {evolutionOptions[0].name.replace(/-/g, ' ')}
                    {evolutionOptions[0].condition && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({evolutionOptions[0].condition})
                      </span>
                    )}
                  </Button>
                ) : (
                  <Select onValueChange={(value) => handlePokemonFetch(value)}>
                    <SelectTrigger className="w-3/4 text-base">
                      <SelectValue placeholder="Choose evolution" />
                    </SelectTrigger>
                    <SelectContent>
                      {evolutionOptions.map((evo) => (
                        <SelectItem key={evo.name} value={evo.name} className="text-base">
                          <div className="flex items-center justify-between w-full">
                            <span>{evo.name.replace(/-/g, ' ')}</span>
                            {evo.condition && (
                              <span className="text-sm text-muted-foreground">
                                ({evo.condition})
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <Button 
              variant="secondary" 
              className="w-3/4 text-base"
              onClick={() => handlePokemonFetch(Math.floor(Math.random() * 1020) + 1)}
              disabled={isLoading}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Randomize
            </Button>
          </div>
        </div>

        {/* Add Color Editor Section */}
        {bgColors.length > 0 && (
          <div className="w-full space-y-2 mt-4">
            <div className="text-center text-sm text-muted-foreground">Colors:</div>
            <div className="grid grid-cols-3 gap-2">
              {bgColors.map((color, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div 
                      className="h-8 rounded cursor-pointer transition-transform hover:scale-105 relative group"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded">
                        <div className={`text-xs font-medium ${getContrastColor(color).text}`}>
                          Edit
                        </div>
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
                            value={color.replace('rgb(', '#').replace(')', '')}
                            onChange={(e) => {
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
                          value={color}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
