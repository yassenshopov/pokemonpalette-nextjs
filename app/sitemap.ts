import { MetadataRoute } from 'next';
import speciesData from '@/data/species.json';

export default function sitemap(): MetadataRoute.Sitemap {
  // Get all Pokemon names from species data
  const pokemonUrls = Object.keys(speciesData).map(pokemon => ({
    url: `https://pokemonpalette.com/${pokemon}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add the home page
  const homePage = {
    url: 'https://pokemonpalette.com',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  };

  return [homePage, ...pokemonUrls];
}
