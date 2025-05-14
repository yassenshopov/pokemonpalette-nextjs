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
  const formattedName = capitalizeWords(pokemon);
  const pokemonId = typedSpeciesData[pokemon.toLowerCase()] || 1;
  const baseUrl = 'https://www.pokemonpalette.com';
  const pokemonUrl = `${baseUrl}/${pokemon}`;

  // Enhanced description with more context
  const description = `Explore ${formattedName}'s color palette and create stunning designs. Get exact HEX, RGB, and HSL values for ${formattedName}'s colors. Perfect for designers, artists, and Pokemon fans looking for color inspiration.`;

  return {
    title: `${formattedName} Color Palette | Pokemon Palette Generator`,
    description,
    keywords: [
      pokemon,
      `${pokemon} colors`,
      `${pokemon} palette`,
      `${pokemon} color scheme`,
      `${pokemon} design`,
      `${pokemon} inspiration`,
      'pokemon color generator',
      'pokemon palette maker',
      'color inspiration',
      'design palette',
      'pokemon design tools',
      'pokemon art colors',
      'pokemon color codes',
      'pokemon hex colors',
      'pokemon rgb values',
      'pokemon hsl values',
    ],
    authors: [{ name: 'Pokemon Palette' }],
    creator: 'Pokemon Palette',
    publisher: 'Pokemon Palette',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: pokemonUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pokemonUrl,
      title: `${formattedName} Color Palette | Pokemon Palette Generator`,
      description,
      siteName: 'Pokemon Palette',
      images: [
        {
          url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          width: 600,
          height: 600,
          alt: `${formattedName} official artwork`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedName} Color Palette | Pokemon Palette Generator`,
      description,
      creator: '@pokemonpalette',
      images: [
        {
          url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          alt: `${formattedName} official artwork`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'REPLACE_WITH_YOUR_GOOGLE_SITE_VERIFICATION_CODE',
    },
  };
}
