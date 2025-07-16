'use client';

import { useState, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import speciesData from '@/data/species.json';
import Image from 'next/image';

interface PokemonSuggestion {
  name: string;
  id: number;
  sprite: string;
}

interface PokemonSearchProps {
  onSelect: (name: string) => void;
  isShiny?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledOptions?: string[];
}

export function PokemonSearch({
  onSelect,
  isShiny = false,
  placeholder = 'Enter Pokemon name...',
  className = '',
  disabled = false,
  disabledOptions = [],
}: PokemonSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    setIsLoading(true);

    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: PokemonSuggestion) => {
    setInputValue(suggestion.name);
    setShowSuggestions(false);
    onSelect(suggestion.name);
    inputRef.current?.focus();
  };

  const filteredPokemon = useMemo(() => {
    return Object.keys(speciesData)
      .filter(
        name =>
          name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !disabledOptions.map(x => x.toLowerCase()).includes(name.toLowerCase())
      )
      .slice(0, 5);
  }, [inputValue, disabledOptions]);

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={e => handleInputChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSelect(inputValue);
            setShowSuggestions(false);
          }
        }}
        placeholder={placeholder}
        className={`text-center capitalize ${disabled ? 'cursor-not-allowed' : ''}`}
        disabled={disabled}
      />

      {showSuggestions && (
        <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1">
          <ScrollArea className="max-h-[200px]">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : (
              suggestions.map(suggestion => {
                const isDisabled = disabledOptions
                  ?.map(x => x.toLowerCase())
                  .includes(suggestion.name.toLowerCase());
                return (
                  <button
                    key={suggestion.name}
                    className={`w-full px-4 py-2 text-left capitalize hover:bg-accent cursor-pointer flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 ${
                      isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-background' : ''
                    }`}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => !isDisabled && handleSuggestionSelect(suggestion)}
                    disabled={isDisabled}
                  >
                    <Image
                      src={suggestion.sprite}
                      alt={suggestion.name}
                      width={32}
                      height={32}
                      className={`w-8 h-8 ${isDisabled ? 'grayscale' : ''}`}
                      style={{ imageRendering: 'pixelated' }}
                      loading="lazy"
                      sizes="32px"
                    />
                    <span>{suggestion.name.replace(/-/g, ' ')}</span>
                  </button>
                );
              })
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
