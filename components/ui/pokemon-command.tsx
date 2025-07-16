'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from 'next/image';
import speciesData from '@/data/species.json';
import { cn } from '@/lib/utils';

interface PokemonCommandProps {
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  disabledOptions?: string[];
}

interface PokemonOption {
  value: string;
  label: string;
  sprite: string;
  dexNumber: string;
}

export function PokemonCommand({
  value,
  onSelect,
  placeholder = 'Select a Pokemon...',
  className,
  buttonClassName,
  disabled = false,
  disabledOptions = [],
}: PokemonCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<PokemonOption[]>([]);

  // Initialize options
  useEffect(() => {
    const initialOptions = Object.entries(speciesData)
      .map(([name, id]) => ({
        value: name.toLowerCase(),
        label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        dexNumber: id.toString().padStart(3, '0'),
      }))
      .sort((a, b) => parseInt(a.dexNumber) - parseInt(b.dexNumber));
    setOptions(initialOptions);
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter(option => {
    if (!searchQuery.trim()) return !disabledOptions.includes(option.value);

    // Clean up the search query
    const query = searchQuery.toLowerCase().trim();

    // Remove '#' from the start if present for number matching
    const numberQuery = query.startsWith('#') ? query.slice(1) : query;

    // Check if the query is purely numeric
    const isNumericQuery = /^\d+$/.test(numberQuery);

    // Different ways to match Pokemon number
    let numberMatches = false;
    if (isNumericQuery && numberQuery) {
      const queryNum = parseInt(numberQuery);
      const pokemonNum = parseInt(option.dexNumber);

      numberMatches = pokemonNum === queryNum; // Simple direct number match
    }

    // Enhanced name matching
    const nameMatches =
      option.label.toLowerCase().includes(query) ||
      option.value.includes(query.replace(/\s+/g, '-')); // Handle hyphenated names

    // Check if option is enabled
    const isEnabled = !disabledOptions.includes(option.value);

    return (numberMatches || nameMatches) && isEnabled;
  });

  const selectedOption = options.find(option => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            buttonClassName
          )}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2">
              <Image
                src={selectedOption.sprite}
                alt={selectedOption.label}
                width={24}
                height={24}
                className="w-6 h-6"
                style={{ imageRendering: 'pixelated' }}
                quality={50}
              />
              <span>
                #{selectedOption.dexNumber} {selectedOption.label}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command className={className} shouldFilter={false}>
          <CommandInput
            placeholder="Search by name or number (e.g. Pikachu, 25, #025)"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No Pokemon found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onSelect(option.value);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={disabledOptions.includes(option.value)}
                >
                  <Image
                    src={option.sprite}
                    alt={option.label}
                    width={32}
                    height={32}
                    className={cn(
                      'w-8 h-8',
                      disabledOptions.includes(option.value) && 'grayscale opacity-50'
                    )}
                    style={{ imageRendering: 'pixelated' }}
                    quality={50}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">#{option.dexNumber}</span>
                  </div>
                  {value === option.value && <Check className="ml-auto h-4 w-4 opacity-50" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
