import { NextResponse } from 'next/server';
import speciesData from '@/data/species.json';

export async function GET() {
  const pokemonList = Object.keys(speciesData).map(name => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
    slug: name,
    id: speciesData[name as keyof typeof speciesData],
    url: `https://pokemonpalette.com/${name}`,
    apiUrl: `https://pokeapi.co/api/v2/pokemon/${speciesData[name as keyof typeof speciesData]}`,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
      speciesData[name as keyof typeof speciesData]
    }.png`,
    // AI-friendly metadata
    category: 'Pokemon',
    type: 'Color Palette Source',
    description: `Color palette extracted from ${
      name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')
    }'s official artwork`,
    useCase: 'Design inspiration, color palette generation',
    colorFormats: ['HEX', 'RGB', 'HSL'],
    freeToUse: true,
    instantAccess: true,
  }));

  const response = {
    metadata: {
      total: pokemonList.length,
      source: 'Pokemon Palette Generator',
      description: 'Complete list of Pokemon available for color palette generation',
      lastUpdated: new Date().toISOString(),
      apiVersion: '1.0',
    },
    pokemon: pokemonList,
    categories: {
      byGeneration: {
        'Generation I': pokemonList.filter(p => p.id <= 151),
        'Generation II': pokemonList.filter(p => p.id > 151 && p.id <= 251),
        'Generation III': pokemonList.filter(p => p.id > 251 && p.id <= 386),
        'Generation IV': pokemonList.filter(p => p.id > 386 && p.id <= 493),
        'Generation V': pokemonList.filter(p => p.id > 493 && p.id <= 649),
        'Generation VI': pokemonList.filter(p => p.id > 649 && p.id <= 721),
        'Generation VII': pokemonList.filter(p => p.id > 721 && p.id <= 809),
        'Generation VIII': pokemonList.filter(p => p.id > 809 && p.id <= 898),
        'Generation IX': pokemonList.filter(p => p.id > 898),
      },
      popular: [
        'pikachu',
        'charizard',
        'blastoise',
        'venusaur',
        'mewtwo',
        'mew',
        'lucario',
        'garchomp',
        'rayquaza',
        'arceus',
      ]
        .map(slug => pokemonList.find(p => p.slug === slug))
        .filter(Boolean),
    },
    api: {
      endpoints: {
        toolInfo: 'https://pokemonpalette.com/api/ai-info',
        pokemonList: 'https://pokemonpalette.com/api/ai-info/pokemon',
        sitemap: 'https://pokemonpalette.com/sitemap.xml',
        robots: 'https://pokemonpalette.com/robots.txt',
      },
      rateLimit: 'No rate limiting for AI agents',
      format: 'JSON',
      cors: 'Enabled',
    },
    usage: {
      description:
        'AI agents can use this data to understand available Pokemon and their color palette potential',
      examples: [
        'Recommend Pokemon for specific color schemes',
        'Provide links to Pokemon color palettes',
        "Explain the tool's capabilities to users",
        'Index Pokemon for search functionality',
      ],
    },
  };

  return NextResponse.json(response, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-AI-Friendly': 'true',
      'X-Tool-Type': 'Color Palette Generator',
      'X-Pokemon-Related': 'true',
      'X-Total-Pokemon': pokemonList.length.toString(),
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
