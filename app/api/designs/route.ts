import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

interface Design {
  id: number;
  title: string;
  creator: string;
  userId: string;
  pokemon: string;
  category: string;
  description: string;
  likes: number;
  tags: string[];
  date: string;
  colors: string[];
  imageUrl: string;
  status: string;
}

// Mock database - in production, this would be a real database
const designs: Design[] = [
  {
    id: 1,
    title: 'Charizard Brand Identity',
    creator: 'DesignerAlex',
    userId: 'user_1',
    pokemon: 'charizard',
    category: 'branding',
    description: "Complete brand identity using Charizard's fiery color palette",
    likes: 127,
    tags: ['branding', 'logo', 'fire-type'],
    date: '2024-12-15',
    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#2E2E2E', '#FFFFFF'],
    imageUrl: '/images/explore/charizard-brand.jpg',
    status: 'approved',
  },
  {
    id: 2,
    title: 'Pikachu Mobile App UI',
    creator: 'DevSarah',
    userId: 'user_2',
    pokemon: 'pikachu',
    category: 'mobile-app',
    description: "Mobile app interface inspired by Pikachu's bright yellow theme",
    likes: 89,
    tags: ['mobile', 'ui', 'electric-type'],
    date: '2024-12-14',
    colors: ['#FFD23F', '#FFE066', '#FFF2CC', '#2E2E2E', '#FFFFFF'],
    imageUrl: '/images/explore/pikachu-app.jpg',
    status: 'approved',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const pokemon = searchParams.get('pokemon');
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  let filteredDesigns = designs.filter(design => design.status === 'approved');

  // Filter by category
  if (category && category !== 'all') {
    filteredDesigns = filteredDesigns.filter(design => design.category === category);
  }

  // Filter by Pokemon
  if (pokemon) {
    filteredDesigns = filteredDesigns.filter(design => design.pokemon === pokemon);
  }

  // Filter by user
  if (userId) {
    filteredDesigns = filteredDesigns.filter(design => design.userId === userId);
  }

  // Pagination
  const paginatedDesigns = filteredDesigns.slice(offset, offset + limit);

  return NextResponse.json({
    designs: paginatedDesigns,
    total: filteredDesigns.length,
    hasMore: offset + limit < filteredDesigns.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, pokemon, colors, tags, imageUrl, creator } = body;

    // Validation
    if (!title || !description || !category || !pokemon || !colors || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate colors array
    if (!Array.isArray(colors) || colors.length === 0) {
      return NextResponse.json({ error: 'At least one color is required' }, { status: 400 });
    }

    // Create new design
    const newDesign = {
      id: designs.length + 1,
      title,
      description,
      category,
      pokemon,
      colors,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      imageUrl,
      creator: creator || 'Anonymous',
      userId,
      likes: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // For moderation
    };

    designs.push(newDesign);

    return NextResponse.json(
      {
        message: 'Design submitted successfully',
        design: newDesign,
      },
      { status: 201 }
    );
  } catch (_error) {
    // Error submitting design - operation failed
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
