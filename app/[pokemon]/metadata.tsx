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
interface Props {
  params: { pokemon: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pokemonName =
    params.pokemon.charAt(0).toUpperCase() + params.pokemon.slice(1).replace(/-/g, ' ');
  const pokemonId = typedSpeciesData[params.pokemon.toLowerCase()] || 1;

  // Fetch Pokemon info for description
  let colorPsychology = '';
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ai-info/pokemon/${params.pokemon}`
    );
    const data = await response.json();
    colorPsychology = data.colorPsychology || '';
  } catch (error) {
    // Error fetching Pokemon metadata - using fallback
    console.error(`Failed to fetch color psychology metadata for ${params.pokemon}:`, error);
  }

  let description = `Explore ${pokemonName} color palettes and designs. Get inspired by ${pokemonName}'s unique colors and create your own designs.`;
  if (colorPsychology) {
    description += ` Learn about the color psychology and design principles behind ${pokemonName}'s appearance: ${colorPsychology}`;
  } else {
    description += ` Learn about the color psychology and design principles behind ${pokemonName}'s appearance.`;
  }

  return {
    title: `${pokemonName} Color Palettes & Design Inspiration | PokemonPalette`,
    description,
    keywords: [
      pokemonName,
      'Pokemon colors',
      'color palette',
      'design inspiration',
      'Pokemon design',
      'color psychology',
      'Pokemon art',
      'Pokemon inspiration',
    ],
    authors: [{ name: 'Pokemon Palette' }],
    creator: 'Pokemon Palette',
    publisher: 'Pokemon Palette',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://pokemonpalette.com'),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://pokemonpalette.com/${params.pokemon}`,
      title: `${pokemonName} Color Palettes & Design Inspiration`,
      description,
      siteName: 'Pokemon Palette',
      images: [
        {
          url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          width: 800,
          height: 800,
          alt: pokemonName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pokemonName} Color Palettes & Design Inspiration`,
      description,
      creator: '@pokemonpalette',
      images: [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    verification: {
      // Google site verification not needed; verified via domain provider
    },
    alternates: {
      canonical: `https://pokemonpalette.com/${params.pokemon}`,
    },
  };
}
