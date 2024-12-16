import { MetadataRoute } from 'next'
import speciesData from '@/data/species.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const pokemonRoutes = Object.keys(speciesData).map((pokemon) => ({
    url: `https://pokemonpalette.com/${pokemon}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://pokemonpalette.com',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...pokemonRoutes,
  ]
} 