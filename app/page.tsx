'use client';

import { PokemonMenu } from '@/components/pokemon-menu';
import { useColors } from '@/contexts/color-context';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { ColorExampleSection } from '@/components/landing/color-example-section';

// Define the type for species data
interface SpeciesData {
  [key: string]: number; // Allow indexing with a string
}

// Import species data normally
import jsonSpeciesData from '@/data/species.json';

// Use the type assertion when accessing the data
const speciesData = jsonSpeciesData as SpeciesData;

// Add this interface at the top
interface Pokemon {
  sprites: {
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
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
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

// Replace your existing getContrastColor function with this:
const getContrastColor = (
  bgColor: string
): { text: string; overlay: string } => {
  if (!bgColor) return { text: 'text-foreground', overlay: '' };

  const whiteContrast = getContrastRatio(bgColor, 'rgb(255, 255, 255)');
  const blackContrast = getContrastRatio(bgColor, 'rgb(0, 0, 0)');

  // Add a semi-transparent overlay if contrast is too low
  const needsOverlay = Math.max(whiteContrast, blackContrast) < 4.5;

  return {
    text: whiteContrast > blackContrast ? 'text-white' : 'text-black',
    overlay: needsOverlay ? 'bg-black/10 dark:bg-white/10' : '',
  };
};

// Add these helper functions
const convertColor = (color: string, format: ColorFormat) => {
  // Convert RGB string to array of numbers
  const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];

  switch (format) {
    case 'hex':
      return `#${rgb.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
    case 'rgb':
      return `rgb(${rgb.join(', ')})`;
    case 'hsl':
      const [r, g, b] = rgb.map((x) => x / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;

      if (max === min) return `hsl(0, 0%, ${Math.round(l * 100)}%)`;

      const d = max - min;
      const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      let h = 0;

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

      return `hsl(${Math.round(h * 60)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
      )}%)`;
    default:
      return color;
  }
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

export default function Home() {
  const {
    colors,
    pokemonName = 'umbreon',
    shiny,
    form,
    setColors,
  } = useColors();
  const [officialArt, setOfficialArt] = useState<string>('');
  const [pokemonCry, setPokemonCry] = useState<string>('');
  const [pokemonDescription, setPokemonDescription] = useState<string>('');
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('red');
  const [pokemonNumber, setPokemonNumber] = useState<number>(0);
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState<number>(0);
  const [descriptions, setDescriptions] = useState<Array<{ flavor_text: string; version: { name: string } }>>([]);
  const [progress, setProgress] = useState(0);
  const [selectedColorProgress, setSelectedColorProgress] = useState<string>(
    colors[0] || ''
  );
  const [selectedColorNotification, setSelectedColorNotification] =
    useState<string>(colors[1] || '');
  const [selectedColorCard, setSelectedColorCard] = useState<string>(
    colors[0] || ''
  );
  const [stats, setStats] = useState<Array<{ name: string; base_stat: number }>>([]);

  useEffect(() => {
    setSelectedColorProgress(colors[0] || '');
    setSelectedColorNotification(colors[1] || '');
    setSelectedColorCard(colors[0] || '');
  }, [colors]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0; // Reset to 0 when reaching 100%
        return prev + 10; // Increment progress by 10%
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Update effect to handle description changes
  useEffect(() => {
    if (descriptions.length > 0) {
      const versionDescriptions = descriptions.filter(
        entry => entry.version.name === selectedVersion
      );
      if (versionDescriptions.length > 0) {
        // Reset index when changing versions
        setCurrentDescriptionIndex(0);
        setPokemonDescription(versionDescriptions[0].flavor_text.replace(/\f/g, ' '));
      }
    }
  }, [selectedVersion, descriptions]);

  // Update description when index changes
  useEffect(() => {
    const versionDescriptions = descriptions.filter(
      entry => entry.version.name === selectedVersion
    );
    if (versionDescriptions.length > 0 && currentDescriptionIndex < versionDescriptions.length) {
      setPokemonDescription(versionDescriptions[currentDescriptionIndex].flavor_text.replace(/\f/g, ' '));
    }
  }, [currentDescriptionIndex, selectedVersion, descriptions]);

  // Update effect to fetch the official artwork based on shiny and form
  useEffect(() => {
    const fetchPokemonData = async () => {
      if (!pokemonName) return;
      try {
        // Fetch basic Pokemon data
        const normPokemonName = pokemonName
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-');
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${normPokemonName}`
        );
        const data: Pokemon = await response.json();

        // Set artwork, cry, types, and stats
        const artwork = shiny
          ? data.sprites.other['official-artwork'].front_shiny
          : data.sprites.other['official-artwork'].front_default;
        setOfficialArt(artwork);
        setPokemonCry(data.cries.latest);
        setPokemonTypes(data.types.map((t) => t.type.name));

        // Format stats data
        const formattedStats = data.stats.map(stat => ({
          name: stat.stat.name,
          base_stat: stat.base_stat
        }));

        // Fetch species data
        const speciesName = Object.keys(speciesData).find(
          (key) => speciesData[key] === data.id
        );
        if (speciesName) {
          const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${speciesName.toLowerCase()}`
          );
          const speciesData: PokemonSpecies = await speciesResponse.json();

          // Get all English entries
          const englishEntries = speciesData.flavor_text_entries.filter(
            (entry) => entry.language.name === 'en'
          );
          
          // Remove duplicate entries within the same version
          const uniqueEntries = englishEntries.reduce((acc, current) => {
            const isDuplicate = acc.some(
              item => 
                item.version.name === current.version.name && 
                item.flavor_text.replace(/\f/g, ' ') === current.flavor_text.replace(/\f/g, ' ')
            );
            if (!isDuplicate) {
              acc.push(current);
            }
            return acc;
          }, [] as typeof englishEntries);
          
          // Store all descriptions
          setDescriptions(uniqueEntries);

          // Get unique versions
          const uniqueVersions = Array.from(
            new Set(uniqueEntries.map((entry) => entry.version.name))
          );
          setAvailableVersions(uniqueVersions);

          // Set initial version
          const versionToUse = uniqueVersions.includes('red')
            ? 'red'
            : uniqueVersions[0];
          setSelectedVersion(versionToUse);

          // Set initial description
          const versionDescriptions = uniqueEntries.filter(
            (entry) => entry.version.name === versionToUse
          );
          if (versionDescriptions.length > 0) {
            setPokemonDescription(versionDescriptions[0].flavor_text.replace(/\f/g, ' '));
            setCurrentDescriptionIndex(0);
          }

          setPokemonNumber(data.id);
          setStats(formattedStats);
        }
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        setDescriptions([]);
        setOfficialArt('');
        setPokemonCry('');
        setPokemonTypes([]);
        setPokemonDescription('');
        setPokemonNumber(0);
        setStats([]);
      }
    };

    fetchPokemonData();
  }, [pokemonName, shiny]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar - Fixed for mobile and desktop */}
      <aside className="w-full h-auto md:h-screen md:w-[350px] lg:w-[450px] md:fixed md:left-0 md:top-0 border-b-2 md:border-r-2 md:border-b-0 border-gray-500/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
        <PokemonMenu />
      </aside>

      {/* Main Content - Adjusted margins and padding */}
      <main className="flex-1 w-full md:pl-[350px] lg:pl-[450px] min-h-screen">
        {/* Navigation - Fixed positioning */}
        <Navbar 
          colors={colors}
          pokemonName={pokemonName}
          pokemonNumber={pokemonNumber}
          getContrastColor={getContrastColor}
        />

        <ColorExampleSection
          colors={colors}
          pokemonName={pokemonName}
          officialArt={officialArt}
          getContrastColor={getContrastColor}
          pokemonNumber={pokemonNumber}
          pokemonDescription={pokemonDescription}
          pokemonTypes={pokemonTypes}
          selectedVersion={selectedVersion}
          availableVersions={availableVersions}
          onVersionChange={setSelectedVersion}
          pokemonCry={pokemonCry}
          stats={stats}
          descriptions={descriptions}
          currentDescriptionIndex={currentDescriptionIndex}
          onDescriptionChange={setCurrentDescriptionIndex}
        />
      </main>
    </div>
  );
}
