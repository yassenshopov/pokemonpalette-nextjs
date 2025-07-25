import { MetadataRoute } from 'next';
import speciesData from '@/data/species.json';

export default function sitemap(): MetadataRoute.Sitemap {
  // Get all Pokemon names from species data
  const pokemonUrls = Object.keys(speciesData).map(pokemon => ({
    url: `https://pokemonpalette.com/${pokemon}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    // AI-specific metadata
    alternates: {
      languages: {
        en: `https://pokemonpalette.com/${pokemon}`,
      },
    },
  }));

  // Add the home page
  const homePage = {
    url: 'https://pokemonpalette.com',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
    // AI-specific metadata
    alternates: {
      languages: {
        en: 'https://pokemonpalette.com',
      },
    },
  };

  // Add other important pages
  const additionalPages = [
    {
      url: 'https://pokemonpalette.com/game',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://pokemonpalette.com/game',
        },
      },
    },
    {
      url: 'https://pokemonpalette.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://pokemonpalette.com/blog',
        },
      },
    },
    {
      url: 'https://pokemonpalette.com/blog/pokemon-color-psychology',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://pokemonpalette.com/blog/pokemon-color-psychology',
        },
      },
    },
    {
      url: 'https://pokemonpalette.com/resources',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://pokemonpalette.com/resources',
        },
      },
    },
    {
      url: 'https://pokemonpalette.com/explore',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://pokemonpalette.com/explore',
        },
      },
    },
    {
      url: 'https://pokemonpalette.com/submit-design',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          en: 'https://pokemonpalette.com/submit-design',
        },
      },
    },
    {
      url: 'https://pokemonpalette.com/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://pokemonpalette.com/faq',
        },
      },
    },
  ];

  return [homePage, ...pokemonUrls, ...additionalPages];
}
