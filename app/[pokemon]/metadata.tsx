import { Metadata } from 'next';
import speciesData from '@/data/species.json';

// Define the type for species data
interface SpeciesData {
  [key: string]: number;
}

// Use type assertion for speciesData
const typedSpeciesData = speciesData as SpeciesData;

// Helper function to capitalize first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Define TypeScript interface for params
type Props = {
  params: { pokemon: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pokemon = params.pokemon;

  // Format the Pokemon name for display
  const formattedName = capitalizeWords(pokemon);

  // Get the Pokemon ID safely with a fallback
  const pokemonId = typedSpeciesData[pokemon.toLowerCase()] || 1;

  return {
    title: `${formattedName} Colors & Palette`,
    description: `Generate beautiful color palettes inspired by ${formattedName}. Get matching colors, HEX, RGB, and HSL values for your next design project.`,
    keywords: [
      pokemon,
      `${pokemon} colors`,
      `${pokemon} palette`,
      `pokemon color scheme`,
      'color inspiration',
      'design palette',
    ],
    openGraph: {
      title: `${formattedName} Color Palette | Pokemon Palette`,
      description: `Generate beautiful color palettes inspired by ${formattedName}. Get matching colors, HEX, RGB, and HSL values for your next design project.`,
      images: [
        {
          url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          width: 600,
          height: 600,
          alt: formattedName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedName} Color Palette | Pokemon Palette`,
      description: `Generate beautiful color palettes inspired by ${formattedName}. Get matching colors, HEX, RGB, and HSL values for your next design project.`,
      images: [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
      ],
    },
  };
}
