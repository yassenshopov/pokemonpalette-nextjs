'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import speciesData from '@/data/species.json';

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
}

export function PokemonSearch({ 
  onSelect, 
  isShiny = false,
  placeholder = "Enter Pokemon name...",
  className = "",
  disabled = false
}: PokemonSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (value: string) => {
    setInputValue(value);

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
  };

  const handleSuggestionSelect = (suggestion: PokemonSuggestion) => {
    setInputValue(suggestion.name);
    setShowSuggestions(false);
    onSelect(suggestion.name);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelect(inputValue);
            setShowSuggestions(false);
          }
        }}
        placeholder={placeholder}
        className="text-center capitalize"
      />
      
      {showSuggestions && (
        <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1">
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
                  className="w-6 h-6"
                  style={{ imageRendering: 'pixelated' }}
                />
                <span>{suggestion.name.replace(/-/g, ' ')}</span>
              </button>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
} 