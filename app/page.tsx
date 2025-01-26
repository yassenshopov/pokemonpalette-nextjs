'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { PokemonMenu } from '@/components/pokemon-menu';
import { useColors } from '@/contexts/color-context';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info, Copy } from 'lucide-react';
import ColorSelector from '@/components/ui/ColorSelector'; // Import the new ColorSelector component
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'; // Import Tooltip and TooltipContent
import Footer from '@/components/ui/Footer'; // Import the new Footer component

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

// Add this version color mapping near the top of your file
const versionColors: { [key: string]: { primary: string; text: string } } = {
  red: { primary: '#FF1111', text: 'white' },
  blue: { primary: '#1111FF', text: 'white' },
  yellow: { primary: '#FFD733', text: 'black' },
  gold: { primary: '#DAA520', text: 'white' },
  silver: { primary: '#C0C0C0', text: 'black' },
  crystal: { primary: '#4FD9FF', text: 'black' },
  ruby: { primary: '#A00000', text: 'white' },
  sapphire: { primary: '#0000A0', text: 'white' },
  emerald: { primary: '#00A000', text: 'white' },
  diamond: { primary: '#8AB8D4', text: 'black' },
  pearl: { primary: '#FFAAAA', text: 'black' },
  platinum: { primary: '#999999', text: 'white' },
  black: { primary: '#444444', text: 'white' },
  white: { primary: '#E1E1E1', text: 'black' },
  'black-2': { primary: '#424B50', text: 'white' },
  'white-2': { primary: '#E3CED0', text: 'black' },
  x: { primary: '#025DA6', text: 'white' },
  y: { primary: '#EA1A3E', text: 'white' },
  'omega-ruby': { primary: '#CF3025', text: 'white' },
  'alpha-sapphire': { primary: '#26649C', text: 'white' },
  sun: { primary: '#F1912B', text: 'white' },
  moon: { primary: '#5599CA', text: 'white' },
  'ultra-sun': { primary: '#E95B2B', text: 'white' },
  'ultra-moon': { primary: '#226DB5', text: 'white' },
  'lets-go-pikachu': { primary: '#F7D02C', text: 'black' },
  'lets-go-eevee': { primary: '#C88B28', text: 'white' },
  sword: { primary: '#00A1E9', text: 'white' },
  shield: { primary: '#BF004F', text: 'white' },
  'brilliant-diamond': { primary: '#C7E5F5', text: 'black' },
  'shining-pearl': { primary: '#FFA3B1', text: 'black' },
  'legends-arceus': { primary: '#B01F1F', text: 'white' },
  scarlet: { primary: '#B91818', text: 'white' },
  violet: { primary: '#7B1FA2', text: 'white' },
};

const typeEmojis: { [key: string]: string } = {
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡️',
  ice: '❄️',
  fighting: '🥋',
  poison: '☠️',
  ground: '🌍',
  flying: '🕊️',
  psychic: '🧠',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌑',
  steel: '⚙️',
  fairy: '🧚',
  normal: '⚪️',
};

export default function Home() {
  const {
    colors,
    pokemonName = 'ninetales',
    shiny,
    form,
    setColors,
  } = useColors();
  const [officialArt, setOfficialArt] = useState<string>('');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('rgb');
  const [openPopover, setOpenPopover] = useState<number | null>(null);
  const [pokemonCry, setPokemonCry] = useState<string>('');
  const [pokemonDescription, setPokemonDescription] = useState<string>('');
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('red');
  const [pokemonNumber, setPokemonNumber] = useState<number>(0);
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] =
    useState<number>(0);
  const [descriptions, setDescriptions] = useState<
    Array<{
      flavor_text: string;
      version: { name: string };
    }>
  >([]);
  const [progress, setProgress] = useState(0);
  const [selectedColorProgress, setSelectedColorProgress] = useState<string>(
    colors[0] || ''
  );
  const [selectedColorNotification, setSelectedColorNotification] =
    useState<string>(colors[1] || '');
  const [selectedColorCard, setSelectedColorCard] = useState<string>(
    colors[0] || ''
  );

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

        // Set artwork, cry, and types
        const artwork = shiny
          ? data.sprites.other['official-artwork'].front_shiny
          : data.sprites.other['official-artwork'].front_default;
        setOfficialArt(artwork);
        setPokemonCry(data.cries.latest);
        setPokemonTypes(data.types.map((t) => t.type.name));

        // Fetch species data
        const speciesName = Object.keys(speciesData).find(
          (key) => speciesData[key] === data.id
        );
        if (speciesName) {
          const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${speciesName.toLowerCase()}`
          );
          const speciesData: PokemonSpecies = await speciesResponse.json();

          // Get all English entries and versions
          const englishEntries = speciesData.flavor_text_entries.filter(
            (entry) => entry.language.name === 'en'
          );
          const uniqueVersions = Array.from(
            new Set(englishEntries.map((entry) => entry.version.name))
          );
          setAvailableVersions(uniqueVersions);

          // Get descriptions for selected version (defaulting to 'red' or first available version)
          const versionToUse = uniqueVersions.includes('red')
            ? 'red'
            : uniqueVersions[0];
          setSelectedVersion(versionToUse);

          const versionDescriptions = englishEntries.filter(
            (entry) => entry.version.name === versionToUse
          );
          setDescriptions(versionDescriptions);

          if (versionDescriptions.length > 0) {
            setPokemonDescription(
              versionDescriptions[0].flavor_text.replace(/\f/g, ' ')
            );
            setCurrentDescriptionIndex(0);
          }

          setPokemonNumber(data.id);
        }
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        setDescriptions([]);
        setOfficialArt('');
        setPokemonCry('');
        setPokemonTypes([]);
        setPokemonDescription('');
        setPokemonNumber(0);
      }
    };

    fetchPokemonData();
  }, [pokemonName, shiny]);

  // Add this effect to handle version changes
  useEffect(() => {
    if (!pokemonName) return;

    // Get descriptions for the selected version
    const fetchVersionDescriptions = async () => {
      try {
        const speciesName = Object.keys(speciesData).find(
          (key) => speciesData[key] === pokemonNumber
        );
        if (speciesName) {
          const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${speciesName.toLowerCase()}`
          );
          const speciesData: PokemonSpecies = await speciesResponse.json();

          const englishEntries = speciesData.flavor_text_entries.filter(
            (entry) =>
              entry.language.name === 'en' &&
              entry.version.name === selectedVersion
          );

          setDescriptions(englishEntries);

          if (englishEntries.length > 0) {
            setPokemonDescription(
              englishEntries[0].flavor_text.replace(/\f/g, ' ')
            );
            setCurrentDescriptionIndex(0);
          }
        }
      } catch (error) {
        console.error('Error fetching version descriptions:', error);
      }
    };

    fetchVersionDescriptions();
  }, [selectedVersion, pokemonName]);

  // Only render color sections if we have colors
  const renderColorSections = colors.length > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Pokemon Palette',
    description: 'Generate beautiful color palettes inspired by Pokemon',
    url: 'https://pokemonpalette.com',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  // Add these helper functions
  const handlePreviousDescription = () => {
    if (descriptions.length === 0) return;
    const newIndex =
      (currentDescriptionIndex - 1 + descriptions.length) % descriptions.length;
    setCurrentDescriptionIndex(newIndex);
    setPokemonDescription(
      descriptions[newIndex].flavor_text.replace(/\f/g, ' ')
    );
  };

  const handleNextDescription = () => {
    if (descriptions.length === 0) return;
    const newIndex = (currentDescriptionIndex + 1) % descriptions.length;
    setCurrentDescriptionIndex(newIndex);
    setPokemonDescription(
      descriptions[newIndex].flavor_text.replace(/\f/g, ' ')
    );
  };

  // Update the version selection handler
  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersion(e.target.value);
    setCurrentDescriptionIndex(0); // Reset index when version changes
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar - Fixed for mobile and desktop */}
      <aside className="w-full h-auto md:h-screen md:w-[300px] lg:w-[350px] md:fixed md:left-0 md:top-0 border-b-2 md:border-r-2 md:border-b-0 border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
        <PokemonMenu />
      </aside>

      {/* Main Content - Adjusted margins and padding */}
      <main className="flex-1 w-full md:pl-[300px] lg:pl-[350px] min-h-screen">
        {/* Navigation - Fixed positioning */}
        <nav className={`fixed top-0 left-0 md:left-[300px] lg:left-[350px] right-0 z-30 flex justify-end items-center p-4 ${colors[0]} dark:${colors[1]} backdrop-blur-xl`}>
          <div className="hidden md:flex justify-start absolute left-6 font-bold text-xl md:text-2xl capitalize truncate max-w-[50%]">
            <p>{'[#' + pokemonNumber.toString().padStart(3, '0') + '] ' + pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hover:cursor-pointer hover:scale-105 transition-all duration-200">
              <a
                href="https://www.buymeacoffee.com/yassenshopov"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-2 md:px-4 py-2 font-semibold rounded-xl hover:bg-gray-100 transition duration-200 border-2 border-gray-200 ${getContrastColor(colors[0]).text}`}
                style={{ backgroundColor: colors[0] }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  width="24"
                  height="24"
                  viewBox="0 0 1279 1279"
                  className="hidden md:block mr-2"
                >
                  <path
                    d="M791.109 297.518L790.231 297.002L788.201 296.383C789.018 297.072 790.04 297.472 791.109 297.518V297.518Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M803.896 388.891L802.916 389.166L803.896 388.891Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M791.484 297.377C791.359 297.361 791.237 297.332 791.118 297.29C791.111 297.371 791.111 297.453 791.118 297.534C791.252 297.516 791.379 297.462 791.484 297.377V297.377Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M791.113 297.529H791.244V297.447L791.113 297.529Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M803.111 388.726L804.591 387.883L805.142 387.573L805.641 387.04C804.702 387.444 803.846 388.016 803.111 388.726V388.726Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M793.669 299.515L792.223 298.138L791.243 297.605C791.77 298.535 792.641 299.221 793.669 299.515V299.515Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M430.019 1186.18C428.864 1186.68 427.852 1187.46 427.076 1188.45L427.988 1187.87C428.608 1187.3 429.485 1186.63 430.019 1186.18Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M641.187 1144.63C641.187 1143.33 640.551 1143.57 640.705 1148.21C640.705 1147.84 640.86 1147.46 640.929 1147.1C641.015 1146.27 641.084 1145.46 641.187 1144.63Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M619.284 1186.18C618.129 1186.68 617.118 1187.46 616.342 1188.45L617.254 1187.87C617.873 1187.3 618.751 1186.63 619.284 1186.18Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M281.304 1196.06C280.427 1195.3 279.354 1194.8 278.207 1194.61C279.136 1195.06 280.065 1195.51 280.684 1195.85L281.304 1196.06Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M247.841 1164.01C247.704 1162.66 247.288 1161.35 246.619 1160.16C247.093 1161.39 247.489 1162.66 247.806 1163.94L247.841 1164.01Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M472.623 590.836C426.682 610.503 374.546 632.802 306.976 632.802C278.71 632.746 250.58 628.868 223.353 621.274L270.086 1101.08C271.74 1121.13 280.876 1139.83 295.679 1153.46C310.482 1167.09 329.87 1174.65 349.992 1174.65C349.992 1174.65 416.254 1178.09 438.365 1178.09C462.161 1178.09 533.516 1174.65 533.516 1174.65C553.636 1174.65 573.019 1167.08 587.819 1153.45C602.619 1139.82 611.752 1121.13 613.406 1101.08L663.459 570.876C641.091 563.237 618.516 558.161 593.068 558.161C549.054 558.144 513.591 573.303 472.623 590.836Z"
                    fill={colors[1]}
                  />
                  <path
                    d="M78.6885 386.132L79.4799 386.872L79.9962 387.182C79.5987 386.787 79.1603 386.435 78.6885 386.132V386.132Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                  <path
                    d="M879.567 341.849L872.53 306.352C866.215 274.503 851.882 244.409 819.19 232.898C808.711 229.215 796.821 227.633 788.786 220.01C780.751 212.388 778.376 200.55 776.518 189.572C773.076 169.423 769.842 149.257 766.314 129.143C763.269 111.85 760.86 92.4243 752.928 76.56C742.604 55.2584 721.182 42.8009 699.88 34.559C688.965 30.4844 677.826 27.0375 666.517 24.2352C613.297 10.1947 557.342 5.03277 502.591 2.09047C436.875 -1.53577 370.983 -0.443234 305.422 5.35968C256.625 9.79894 205.229 15.1674 158.858 32.0469C141.91 38.224 124.445 45.6399 111.558 58.7341C95.7448 74.8221 90.5829 99.7026 102.128 119.765C110.336 134.012 124.239 144.078 138.985 150.737C158.192 159.317 178.251 165.846 198.829 170.215C256.126 182.879 315.471 187.851 374.007 189.968C438.887 192.586 503.87 190.464 568.44 183.618C584.408 181.863 600.347 179.758 616.257 177.304C634.995 174.43 647.022 149.928 641.499 132.859C634.891 112.453 617.134 104.538 597.055 107.618C594.095 108.082 591.153 108.512 588.193 108.942L586.06 109.252C579.257 110.113 572.455 110.915 565.653 111.661C551.601 113.175 537.515 114.414 523.394 115.378C491.768 117.58 460.057 118.595 428.363 118.647C397.219 118.647 366.058 117.769 334.983 115.722C320.805 114.793 306.661 113.611 292.552 112.177C286.134 111.506 279.733 110.801 273.333 110.009L267.241 109.235L265.917 109.046L259.602 108.134C246.697 106.189 233.792 103.953 221.025 101.251C219.737 100.965 218.584 100.249 217.758 99.2193C216.932 98.1901 216.482 96.9099 216.482 95.5903C216.482 94.2706 216.932 92.9904 217.758 91.9612C218.584 90.9319 219.737 90.2152 221.025 89.9293H221.266C232.33 87.5721 243.479 85.5589 254.663 83.8038C258.392 83.2188 262.131 82.6453 265.882 82.0832H265.985C272.988 81.6186 280.026 80.3625 286.994 79.5366C347.624 73.2302 408.614 71.0801 469.538 73.1014C499.115 73.9618 528.676 75.6996 558.116 78.6935C564.448 79.3474 570.746 80.0357 577.043 80.8099C579.452 81.1025 581.878 81.4465 584.305 81.7391L589.191 82.4445C603.438 84.5667 617.61 87.1419 631.708 90.1703C652.597 94.7128 679.422 96.1925 688.713 119.077C691.673 126.338 693.015 134.408 694.649 142.03L696.731 151.752C696.786 151.926 696.826 152.105 696.852 152.285C701.773 175.227 706.7 198.169 711.632 221.111C711.994 222.806 712.002 224.557 711.657 226.255C711.312 227.954 710.621 229.562 709.626 230.982C708.632 232.401 707.355 233.6 705.877 234.504C704.398 235.408 702.75 235.997 701.033 236.236H700.895L697.884 236.649L694.908 237.044C685.478 238.272 676.038 239.419 666.586 240.486C647.968 242.608 629.322 244.443 610.648 245.992C573.539 249.077 536.356 251.102 499.098 252.066C480.114 252.57 461.135 252.806 442.162 252.771C366.643 252.712 291.189 248.322 216.173 239.625C208.051 238.662 199.93 237.629 191.808 236.58C198.106 237.389 187.231 235.96 185.029 235.651C179.867 234.928 174.705 234.177 169.543 233.397C152.216 230.798 134.993 227.598 117.7 224.793C96.7944 221.352 76.8005 223.073 57.8906 233.397C42.3685 241.891 29.8055 254.916 21.8776 270.735C13.7217 287.597 11.2956 305.956 7.64786 324.075C4.00009 342.193 -1.67805 361.688 0.472751 380.288C5.10128 420.431 33.165 453.054 73.5313 460.35C111.506 467.232 149.687 472.807 187.971 477.556C338.361 495.975 490.294 498.178 641.155 484.129C653.44 482.982 665.708 481.732 677.959 480.378C681.786 479.958 685.658 480.398 689.292 481.668C692.926 482.938 696.23 485.005 698.962 487.717C701.694 490.429 703.784 493.718 705.08 497.342C706.377 500.967 706.846 504.836 706.453 508.665L702.633 545.797C694.936 620.828 687.239 695.854 679.542 770.874C671.513 849.657 663.431 928.434 655.298 1007.2C653.004 1029.39 650.71 1051.57 648.416 1073.74C646.213 1095.58 645.904 1118.1 641.757 1139.68C635.218 1173.61 612.248 1194.45 578.73 1202.07C548.022 1209.06 516.652 1212.73 485.161 1213.01C450.249 1213.2 415.355 1211.65 380.443 1211.84C343.173 1212.05 297.525 1208.61 268.756 1180.87C243.479 1156.51 239.986 1118.36 236.545 1085.37C231.957 1041.7 227.409 998.039 222.9 954.381L197.607 711.615L181.244 554.538C180.968 551.94 180.693 549.376 180.435 546.76C178.473 528.023 165.207 509.681 144.301 510.627C126.407 511.418 106.069 526.629 108.168 546.76L120.298 663.214L145.385 904.104C152.532 972.528 159.661 1040.96 166.773 1109.41C168.15 1122.52 169.44 1135.67 170.885 1148.78C178.749 1220.43 233.465 1259.04 301.224 1269.91C340.799 1276.28 381.337 1277.59 421.497 1278.24C472.979 1279.07 524.977 1281.05 575.615 1271.72C650.653 1257.95 706.952 1207.85 714.987 1130.13C717.282 1107.69 719.576 1085.25 721.87 1062.8C729.498 988.559 737.115 914.313 744.72 840.061L769.601 597.451L781.009 486.263C781.577 480.749 783.905 475.565 787.649 471.478C791.392 467.391 796.352 464.617 801.794 463.567C823.25 459.386 843.761 452.245 859.023 435.916C883.318 409.918 888.153 376.021 879.567 341.849ZM72.4301 365.835C72.757 365.68 72.1548 368.484 71.8967 369.792C71.8451 367.813 71.9483 366.058 72.4301 365.835ZM74.5121 381.94C74.6842 381.819 75.2003 382.508 75.7337 383.334C74.925 382.576 74.4089 382.009 74.4949 381.94H74.5121ZM76.5597 384.641C77.2996 385.897 77.6953 386.689 76.5597 384.641V384.641ZM80.672 387.979H80.7752C80.7752 388.1 80.9645 388.22 81.0333 388.341C80.9192 388.208 80.7925 388.087 80.6548 387.979H80.672ZM800.796 382.989C793.088 390.319 781.473 393.726 769.996 395.43C641.292 414.529 510.713 424.199 380.597 419.932C287.476 416.749 195.336 406.407 103.144 393.382C94.1102 392.109 84.3197 390.457 78.1082 383.798C66.4078 371.237 72.1548 345.944 75.2003 330.768C77.9878 316.865 83.3218 298.334 99.8572 296.355C125.667 293.327 155.64 304.218 181.175 308.09C211.917 312.781 242.774 316.538 273.745 319.36C405.925 331.405 540.325 329.529 671.92 311.91C695.905 308.686 719.805 304.941 743.619 300.674C764.835 296.871 788.356 289.731 801.175 311.703C809.967 326.673 811.137 346.701 809.778 363.615C809.359 370.984 806.139 377.915 800.779 382.989H800.796Z"
                    fill={getContrastColor(colors[0]).text}
                  />
                </svg>
                <span className="text-sm md:text-base">Buy me a coffee!</span>
              </a>
            </div>
            <ThemeToggle />
          </div>
        </nav>

        {/* Content wrapper with proper padding */}
        <div className="max-w-6xl mx-auto p-4 pt-16 md:pt-24 space-y-8 md:space-y-12">
          {/* Hero section - Stack on mobile */}
          <div className="flex flex-col md:flex-row items-center gap-8 mt-4 md:mt-16">
            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold">
                Your website - inspired by{' '}
                <span className="capitalize">{pokemonName || 'your Pokemon'}</span>
              </h1>
              <p className="text-muted-foreground">
                This website allows you to enter a Pokemon's name (or simply its number in the Pokedex), and its top 3 colours will be extracted.
              </p>
            </div>

            {officialArt && (
              <div className="flex-1 flex justify-center">
                <div className="relative w-48 h-48 md:w-96 md:h-96">
                  <Image
                    src={officialArt}
                    alt={pokemonName}
                    fill
                    className="object-contain drop-shadow-lg transition-all duration-300 hover:scale-105"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Color grid - Stack on mobile */}
          {renderColorSections && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {colors.map((color, index) => (
                <Card
                  key={index}
                  style={{ backgroundColor: color }}
                  className="transition-all hover:scale-105"
                >
                  <CardContent
                    className={`p-6 ${getContrastColor(color).overlay}`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex-1">
                        <select
                          value={colorFormat}
                          onChange={(e) =>
                            setColorFormat(e.target.value as ColorFormat)
                          }
                          className={`bg-transparent border-none ${
                            getContrastColor(color).text
                          } text-sm mb-2 cursor-pointer focus:ring-0`}
                          style={{ outline: 'none' }}
                        >
                          <option
                            value="rgb"
                            className="text-foreground bg-background"
                          >
                            RGB
                          </option>
                          <option
                            value="hex"
                            className="text-foreground bg-background"
                          >
                            HEX
                          </option>
                          <option
                            value="hsl"
                            className="text-foreground bg-background"
                          >
                            HSL
                          </option>
                        </select>
                        <p className={getContrastColor(color).text}>
                          {convertColor(color, colorFormat)}
                        </p>
                      </div>
                      <Popover
                        open={openPopover === index}
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenPopover(index);
                            navigator.clipboard.writeText(
                              convertColor(color, colorFormat)
                            );
                            setTimeout(() => setOpenPopover(null), 1000);
                          } else {
                            setOpenPopover(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`hover:bg-white/10 ${
                              getContrastColor(color).text
                            }`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto px-4 py-2">
                          <p className="text-sm">Copied!</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pokemon info card - Stack content on mobile */}
          {officialArt && (
            <section className="space-y-8">
              <Card className="overflow-hidden">
                <CardContent className={`p-4 md:p-8 ${getContrastColor(colors[0]).overlay}`} style={{ backgroundColor: colors[0] }}>
                  <div className="flex flex-col md:flex-row-reverse gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                        <h2
                          className={`text-4xl font-bold capitalize ${
                            getContrastColor(colors[0]).text
                          }`}
                        >
                          {pokemonName} [#
                          {pokemonNumber.toString().padStart(3, '0')}]
                        </h2>

                        <div className="flex gap-2">
                          {pokemonTypes.map((type, index) => {
                            const bgColor =
                              index === 0 ? colors[1] : colors[2];
                            const { text: textColor, overlay } =
                              getContrastColor(bgColor);

                            return (
                              <span
                                key={type}
                                className={`px-3 py-1 rounded-md ${overlay} capitalize font-medium`}
                                style={{
                                  backgroundColor: bgColor,
                                  color:
                                    textColor === 'text-white'
                                      ? 'white'
                                      : 'black',
                                }}
                              >
                                {type}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p
                          className={`text-lg ${
                            getContrastColor(colors[0]).text
                          }`}
                        >
                          {pokemonDescription}
                        </p>

                        <select
                          value={selectedVersion}
                          onChange={handleVersionChange}
                          className={`
                        px-4 py-2 rounded-lg 
                        border-2 border-opacity-50 
                        bg-transparent 
                        ${getContrastColor(colors[0]).text}
                        hover:border-opacity-100 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-opacity-50
                        transition-all
                        cursor-pointer
                      `}
                          style={{
                            borderColor: colors[1],
                            backgroundColor: `${colors[1]}10`,
                          }}
                        >
                          {availableVersions.map((version) => (
                            <option
                              key={version}
                              value={version}
                              className="bg-background text-foreground capitalize"
                            >
                              Pokemon{' '}
                              {version.charAt(0).toUpperCase() +
                                version.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="relative w-96 h-60 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${colors[1]}20`,
                        }}
                      >
                        <div className="relative w-64 h-64">
                          <Image
                            src={officialArt}
                            alt={pokemonName}
                            fill
                            className="object-contain"
                            style={{
                              filter: 'contrast(0) brightness(0)',
                              transition: 'filter 0.3s ease',
                              transform: 'scaleX(-1)', // Horizontally invert the image
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.filter =
                                'contrast(1) brightness(1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.filter =
                                'contrast(0) brightness(0)';
                            }}
                          />
                        </div>
                      </div>

                      {pokemonCry && (
                        <div className="w-full">
                          <audio
                            controls
                            className="w-full"
                            src={pokemonCry}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card style={{ backgroundColor: colors[0], opacity: 0.9 }}>
              <CardContent
                className={`p-8 ${getContrastColor(colors[0]).overlay}`}
              >
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    getContrastColor(colors[0]).text
                  }`}
                >
                  Primary Color Usage
                </h2>
                <p className={getContrastColor(colors[0]).text}>
                  Perfect for headers, hero sections, and primary CTAs.
                </p>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: colors[1], opacity: 0.9 }}>
              <CardContent
                className={`p-8 ${getContrastColor(colors[1]).overlay}`}
              >
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    getContrastColor(colors[1]).text
                  }`}
                >
                  Secondary Color Usage
                </h2>
                <p className={getContrastColor(colors[1]).text}>
                  Great for supporting elements, cards, and backgrounds.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div
              className="h-48 w-full"
              style={{
                background: `linear-gradient(45deg, ${colors.join(', ')})`,
              }}
            />
          </Card>

          {/* Color Combinations */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">
              Color Combinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Complementary Colors */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">
                    Primary + Secondary
                  </h3>
                  <div className="flex gap-4">
                    <div
                      className="h-24 w-1/2 rounded-lg"
                      style={{ backgroundColor: colors[0] }}
                    />
                    <div
                      className="h-24 w-1/2 rounded-lg"
                      style={{ backgroundColor: colors[1] }}
                    />
                  </div>
                  <p className="text-muted-foreground">
                    Classic combination for main UI elements
                  </p>
                </CardContent>
              </Card>

              {/* Gradient Blend */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Gradient Blend</h3>
                  <div
                    className="h-24 rounded-lg"
                    style={{
                      background: `linear-gradient(to right, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                    }}
                  />
                  <p className="text-muted-foreground">
                    Smooth transition between all colors
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* UI Examples */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">UI Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Button Examples */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Buttons</h3>
                  <div className="space-y-4">
                    <button
                      className={`w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 
                        ${getContrastColor(colors[0]).overlay}`}
                      style={{
                        backgroundColor: colors[0],
                      }}
                    >
                      <span className={getContrastColor(colors[0]).text}>
                        Primary Button
                      </span>
                    </button>
                    <button
                      className={`w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 
                        ${getContrastColor(colors[1]).overlay}`}
                      style={{
                        backgroundColor: colors[1],
                      }}
                    >
                      <span className={getContrastColor(colors[1]).text}>
                        Secondary Button
                      </span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Card Examples */}
              <Card>
                <CardContent className="p-6 space-y-4 relative">
                  <h3 className="text-xl font-semibold">Cards</h3>
                  <ColorSelector
                    colors={colors}
                    selectedColor={selectedColorCard}
                    onColorSelect={setSelectedColorCard}
                  />
                  <div
                    className={`p-4 rounded-lg ${
                      getContrastColor(selectedColorCard).overlay
                    }`}
                    style={{
                      backgroundColor: selectedColorCard,
                    }}
                  >
                    <h4
                      className={`font-medium ${
                        getContrastColor(selectedColorCard).text
                      }`}
                    >
                      Card Title
                    </h4>
                    <p
                      className={`text-sm opacity-90 ${
                        getContrastColor(selectedColorCard).text
                      }`}
                    >
                      Sample card content with themed background.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Text Examples */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Typography</h3>
                  <div className="space-y-2">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          getContrastColor(color).overlay
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        <p className={getContrastColor(color).text}>
                          {index === 0
                            ? 'Primary'
                            : index === 1
                            ? 'Secondary'
                            : 'Accent'}{' '}
                          Text Color
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Accordion Example */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Accordion</h3>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full gap-4"
                  >
                    <AccordionItem value="item-1" className="w-full mb-4">
                      <AccordionTrigger
                        className={`${
                          getContrastColor(colors[0]).text
                        } p-4 rounded-lg`}
                        style={{ backgroundColor: colors[0] }}
                      >
                        Primary Section
                      </AccordionTrigger>
                      <AccordionContent
                        style={{ borderColor: colors[0] }}
                        className="border-l-2 pl-4"
                      >
                        Content styled with your primary color.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger
                        className={`${
                          getContrastColor(colors[1]).text
                        } p-4 rounded-lg`}
                        style={{ backgroundColor: colors[1] }}
                      >
                        Secondary Section
                      </AccordionTrigger>
                      <AccordionContent
                        style={{ borderColor: colors[1] }}
                        className="border-l-2 pl-4"
                      >
                        Content styled with your secondary color.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Tabs Example */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Tabs</h3>
                  <Tabs defaultValue="tab1">
                    <TabsList
                      className="w-full gap-2"
                      style={{ backgroundColor: `${colors[0]}20` }}
                    >
                      <TabsTrigger
                        value="tab1"
                        className="flex-1"
                        style={
                          {
                            backgroundColor: colors[0],
                            color: getContrastColor(colors[0]).text,
                          } as React.CSSProperties
                        }
                      >
                        Tab 1
                      </TabsTrigger>
                      <TabsTrigger
                        value="tab2"
                        className="flex-1"
                        style={
                          {
                            backgroundColor: colors[1],
                            color: getContrastColor(colors[1]).text,
                          } as React.CSSProperties
                        }
                      >
                        Tab 2
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="mt-4">
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: `${colors[1]}20` }}
                      >
                        First tab content
                      </div>
                    </TabsContent>
                    <TabsContent value="tab2" className="mt-4">
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: `${colors[2]}20` }}
                      >
                        Second tab content
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Alert Dialog Example */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Alert Dialog</h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className={`w-full ${
                          getContrastColor(colors[0]).overlay
                        }`}
                        style={{
                          backgroundColor: colors[0],
                        }}
                      >
                        <span className={getContrastColor(colors[0]).text}>
                          Open Dialog
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle style={{ color: colors[0] }}>
                          Themed Dialog
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This is an example of how the color palette can be
                          applied to interactive components.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          style={{
                            backgroundColor: colors[1],
                          }}
                          className={getContrastColor(colors[1]).text}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              {/* Pokémon Type Cards Example */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">
                    Pokémon Type Cards
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pokemonTypes.map((type, index) => {
                      const { text: textColor, overlay } = getContrastColor(
                        colors[index % colors.length]
                      );

                      return (
                        <div
                          key={type}
                          className={`flex flex-col items-center overflow-hidden rounded-lg ${overlay}`}
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        >
                          <div
                            className={`flex items-center justify-center w-full h-24  opacity-90 ${
                              getContrastColor(
                                colors[index % colors.length]
                              ).overlay
                            }`}
                            style={{
                              backgroundColor:
                                getContrastColor(
                                  colors[index % colors.length]
                                ).text === 'text-white'
                                  ? '#ffffff'
                                  : '#000000',
                            }}
                          >
                            <span
                              className="text-5xl"
                              role="img"
                              aria-label={type}
                            >
                              {typeEmojis[type] || '⚪️'}
                            </span>
                          </div>
                          <span
                            className={`text-lg ${textColor} font-medium p-4`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Bar Example */}
              <Card>
                <CardContent className="p-6 space-y-4 relative">
                  <h3 className="text-xl font-semibold">Progress Bar</h3>
                  <ColorSelector
                    colors={colors} // Pass the colors array
                    selectedColor={selectedColorProgress} // Pass the selected color for progress
                    onColorSelect={setSelectedColorProgress} // Pass the function to handle progress color selection
                  />
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor:
                          selectedColorProgress || 'transparent',
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-center">
                    {progress}% Complete
                  </p>
                </CardContent>
              </Card>

              {/* Notification Banner Example */}
              <Card>
                <CardContent className="p-6 space-y-4 relative">
                  <h3 className="text-xl font-semibold">
                    Notification Banner
                  </h3>
                  <ColorSelector
                    colors={colors} // Pass the colors array
                    selectedColor={selectedColorNotification} // Pass the selected color for notification
                    onColorSelect={setSelectedColorNotification} // Pass the function to handle notification color selection
                  />
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      getContrastColor(selectedColorNotification).overlay
                    } border-gray-600 dark:border-gray-200`}
                    style={{
                      backgroundColor: selectedColorNotification,
                      borderRadius: '12px', // Increased border radius
                    }}
                  >
                    <div className="flex items-center">
                      <span
                        className="mr-2 text-lg"
                        style={{
                          color: getContrastColor(selectedColorNotification)
                            .text,
                        }}
                      >
                        <Info
                          className={`h-5 w-5 ${
                            getContrastColor(selectedColorNotification).text
                          }`}
                        />
                      </span>
                      <p
                        className={
                          getContrastColor(selectedColorNotification).text
                        }
                      >
                        This is a notification message!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}
