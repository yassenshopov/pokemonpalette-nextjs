'use client';

import { useColors } from '@/contexts/color-context';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ColorExampleSection } from '@/components/landing/color-example-section';
import { PokemonColorExtractor } from '@/components/pokemon-color-extractor';
import StructuredData from '@/app/components/StructuredData';
import { Navbar } from '@/components/landing/navbar';
import { LoadingSpinner } from '@/components/landing/loading-spinner';
import { ShinyToggleFab } from '@/components/landing/shiny-toggle-fab';
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for species data
interface SpeciesData {
  [key: string]: number;
}

// Import species data normally
import jsonSpeciesData from '@/data/species.json';

// Use the type assertion when accessing the data
const speciesData = jsonSpeciesData as SpeciesData;

// Add this interface at the top
interface Pokemon {
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
      home?: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  cries: {
    latest: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  id: number;
  stats: Array<{ name: string; base_stat: number }>;
}

// Add this type above the component
type ColorFormat = 'hex' | 'rgb' | 'hsl';

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

  return {
    text: whiteContrast > blackContrast ? 'text-white' : 'text-black',
    overlay: needsOverlay ? 'bg-black/10 dark:bg-white/10' : '',
  };
};

// Add new interface for Pokemon species data
interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
}

export default function Page() {
  const params = useParams();
  const pokemonName = decodeURIComponent(params.pokemon as string);

  const { colors, shiny, setColors } = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState<{
    officialArt: string;
    spriteUrl: string;
    pokemonCry: string;
    pokemonTypes: string[];
    pokemonNumber: number;
    stats: Array<{ name: string; base_stat: number }>;
  }>({
    officialArt: '',
    spriteUrl: '',
    pokemonCry: '',
    pokemonTypes: [],
    pokemonNumber: 0,
    stats: [],
  });
  const [descriptionData, setDescriptionData] = useState<{
    pokemonDescription: string;
    selectedVersion: string;
    availableVersions: string[];
    descriptions: Array<{ flavor_text: string; version: { name: string } }>;
    currentDescriptionIndex: number;
  }>({
    pokemonDescription: '',
    selectedVersion: 'red',
    availableVersions: [],
    descriptions: [],
    currentDescriptionIndex: 0,
  });

  const handleVersionChange = useCallback((version: string) => {
    setDescriptionData(prev => ({
      ...prev,
      selectedVersion: version,
      currentDescriptionIndex: 0,
    }));
  }, []);

  const handleDescriptionChange = useCallback((index: number) => {
    setDescriptionData(prev => ({
      ...prev,
      currentDescriptionIndex: index,
      pokemonDescription: prev.descriptions[index]?.flavor_text.replace(/\f/g, ' ') || '',
    }));
  }, []);

  const getContrastColorMemo = useMemo(() => getContrastColor, []);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setIsLoading(true);
      try {
        if (!pokemonName) return;

        const normPokemonName = pokemonName.toLowerCase().trim().replace(/\s+/g, '-');
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normPokemonName}`);
        const data: Pokemon = await response.json();

        // Update Pokemon data
        setPokemonData({
          officialArt: shiny
            ? data.sprites.other['official-artwork'].front_shiny
            : data.sprites.other['official-artwork'].front_default,
          spriteUrl: shiny ? data.sprites.front_shiny : data.sprites.front_default,
          pokemonCry: data.cries.latest,
          pokemonTypes: data.types.map(t => t.type.name),
          pokemonNumber: data.id,
          stats: data.stats,
        });

        // Fetch species data
        const speciesName = Object.keys(speciesData).find(key => speciesData[key] === data.id);
        if (speciesName) {
          const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${speciesName.toLowerCase()}`
          );
          const speciesData: PokemonSpecies = await speciesResponse.json();

          const englishEntries = speciesData.flavor_text_entries.filter(
            entry => entry.language.name === 'en'
          );
          const uniqueVersions = Array.from(
            new Set(englishEntries.map(entry => entry.version.name))
          );
          const versionToUse = uniqueVersions.includes('red') ? 'red' : uniqueVersions[0];
          const versionDescriptions = englishEntries.filter(
            entry => entry.version.name === versionToUse
          );

          setDescriptionData({
            pokemonDescription: versionDescriptions[0]?.flavor_text.replace(/\f/g, ' ') || '',
            selectedVersion: versionToUse,
            availableVersions: uniqueVersions,
            descriptions: versionDescriptions,
            currentDescriptionIndex: 0,
          });
        }
      } catch (error) {
        // Error fetching Pokemon data - using fallback
        setPokemonData({
          officialArt:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
          spriteUrl: '',
          pokemonCry: '',
          pokemonTypes: [],
          pokemonNumber: 0,
          stats: [],
        });
        setDescriptionData({
          pokemonDescription: '',
          selectedVersion: 'red',
          availableVersions: [],
          descriptions: [],
          currentDescriptionIndex: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemonName, shiny]);

  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData
        pokemonName={pokemonName}
        url={`https://pokemonpalette.com/${pokemonName}`}
        imageUrl={pokemonData.officialArt}
      />

      <Navbar
        colors={colors}
        pokemonName={pokemonName}
        pokemonNumber={pokemonData.pokemonNumber}
        getContrastColor={getContrastColorMemo}
      />

      <PokemonColorExtractor
        spriteUrl={pokemonData.spriteUrl}
        onColorsExtracted={newColors => {
          setColors(newColors);
          setIsLoading(false);
        }}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner colors={colors} />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${pokemonName}-${shiny}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ColorExampleSection
              colors={colors}
              pokemonName={pokemonName}
              officialArt={pokemonData.officialArt}
              getContrastColor={getContrastColorMemo}
              pokemonNumber={pokemonData.pokemonNumber}
              pokemonDescription={descriptionData.pokemonDescription}
              pokemonTypes={pokemonData.pokemonTypes}
              selectedVersion={descriptionData.selectedVersion}
              availableVersions={descriptionData.availableVersions}
              onVersionChange={handleVersionChange}
              pokemonCry={pokemonData.pokemonCry}
              stats={pokemonData.stats}
              descriptions={descriptionData.descriptions}
              currentDescriptionIndex={descriptionData.currentDescriptionIndex}
              onDescriptionChange={handleDescriptionChange}
            />
            {colors[0] && colors[0].length > 0 && <ShinyToggleFab primaryColor={colors[0]} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
