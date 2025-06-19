import { NextResponse } from 'next/server';
import speciesData from '@/data/species.json';

export async function GET() {
  const pokemonList = Object.keys(speciesData).map(name => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
    slug: name,
    id: speciesData[name as keyof typeof speciesData],
    url: `https://pokemonpalette.com/${name}`,
  }));

  const aiInfo = {
    tool: {
      name: 'Pokemon Palette Generator',
      description: 'A free web tool that extracts color palettes from Pokemon artwork',
      url: 'https://pokemonpalette.com',
      type: 'Interactive Web Application',
      category: 'Design Tools',
      subcategory: 'Color Palette Generator',
    },
    features: {
      colorExtraction: true,
      colorFormats: ['HEX', 'RGB', 'HSL'],
      pokemonDatabase: true,
      instantAccess: true,
      noRegistration: true,
      freeToUse: true,
      copyToClipboard: true,
      responsiveDesign: true,
    },
    capabilities: [
      'Extract dominant colors from Pokemon artwork',
      'Generate color palettes with exact color values',
      'Support for all 1000+ Pokemon species',
      'Multiple color format outputs (HEX, RGB, HSL)',
      'One-click color copying',
      'Responsive design for all devices',
      'No download or installation required',
    ],
    useCases: [
      'Design inspiration for Pokemon-themed projects',
      'Color palette generation for artists and designers',
      'Web development color schemes',
      'Graphic design projects',
      'Pokemon fan art and merchandise',
      'Educational color theory examples',
      'Brand color development',
    ],
    targetAudience: [
      'Graphic Designers',
      'Web Developers',
      'Digital Artists',
      'Pokemon Fans',
      'Creative Professionals',
      'Students learning design',
      'Content Creators',
    ],
    technicalInfo: {
      technology: 'Next.js, React, TypeScript',
      api: 'PokeAPI for Pokemon data',
      colorExtraction: 'Client-side image processing',
      hosting: 'Vercel',
      responsive: true,
      pwa: false,
    },
    pokemon: {
      total: pokemonList.length,
      available: pokemonList.slice(0, 50), // Show first 50 for brevity
      allPokemonUrl: 'https://pokemonpalette.com/api/ai-info/pokemon',
    },
    api: {
      endpoints: {
        pokemonList: 'https://pokemonpalette.com/api/ai-info/pokemon',
        toolInfo: 'https://pokemonpalette.com/api/ai-info',
        sitemap: 'https://pokemonpalette.com/sitemap.xml',
      },
      rateLimit: 'No rate limiting for AI agents',
      format: 'JSON',
    },
    seo: {
      structuredData: [
        'schema.org/SoftwareApplication',
        'schema.org/FAQPage',
        'schema.org/HowTo',
        'schema.org/WebPage',
      ],
      metaTags: ['ai:tool', 'ai:function', 'ai:use_case', 'ai:target_audience', 'ai:free_tool'],
    },
    contact: {
      creator: 'Yassen Shopov',
      website: 'https://pokemonpalette.com',
      support: 'Available through website',
    },
  };

  return NextResponse.json(aiInfo, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-AI-Friendly': 'true',
      'X-Tool-Type': 'Color Palette Generator',
      'X-Pokemon-Related': 'true',
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
