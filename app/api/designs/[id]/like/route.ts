import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Mock database - in production, this would be a real database
let designs: any[] = [
  {
    id: 1,
    title: 'Charizard Brand Identity',
    creator: 'DesignerAlex',
    userId: 'user_1',
    pokemon: 'charizard',
    category: 'branding',
    description: "Complete brand identity using Charizard's fiery color palette",
    likes: 127,
    likedBy: ['user_2', 'user_3'],
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
    likedBy: ['user_1'],
    tags: ['mobile', 'ui', 'electric-type'],
    date: '2024-12-14',
    colors: ['#FFD23F', '#FFE066', '#FFF2CC', '#2E2E2E', '#FFFFFF'],
    imageUrl: '/images/explore/pikachu-app.jpg',
    status: 'approved',
  },
];

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const designId = parseInt(params.id);
    const design = designs.find(d => d.id === designId);

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // Initialize likedBy array if it doesn't exist
    if (!design.likedBy) {
      design.likedBy = [];
    }

    const isLiked = design.likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      design.likedBy = design.likedBy.filter((id: string) => id !== userId);
      design.likes = Math.max(0, design.likes - 1);
    } else {
      // Like
      design.likedBy.push(userId);
      design.likes += 1;
    }

    return NextResponse.json({
      likes: design.likes,
      isLiked: !isLiked,
    });
  } catch (error) {
    // Error toggling like - operation failed
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const designId = parseInt(params.id);
    const design = designs.find(d => d.id === designId);

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const isLiked = design.likedBy?.includes(userId) || false;

    return NextResponse.json({
      likes: design.likes,
      isLiked,
    });
  } catch (error) {
    // Error getting like status - returning default
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
