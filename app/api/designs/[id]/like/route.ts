import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDesignById, updateDesign, type Design } from '@/lib/mock-db/designs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const resolvedParams = await params;
    const designId = parseInt(resolvedParams.id);
    const design = getDesignById(designId);

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // Initialize likedBy array if it doesn't exist
    const likedBy = design.likedBy || [];
    const isLiked = likedBy.includes(userId);

    let updatedLikedBy: string[];
    let updatedLikes: number;

    if (isLiked) {
      // Unlike
      updatedLikedBy = likedBy.filter((id: string) => id !== userId);
      updatedLikes = Math.max(0, design.likes - 1);
    } else {
      // Like
      updatedLikedBy = [...likedBy, userId];
      updatedLikes = design.likes + 1;
    }

    const updatedDesign = updateDesign(designId, {
      likedBy: updatedLikedBy,
      likes: updatedLikes,
    });

    if (!updatedDesign) {
      return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
    }

    return NextResponse.json({
      likes: updatedDesign.likes,
      isLiked: !isLiked,
    });
  } catch (_error) {
    // Error toggling like - operation failed
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const resolvedParams = await params;
    const designId = parseInt(resolvedParams.id);
    const design = getDesignById(designId);

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const isLiked = design.likedBy?.includes(userId) || false;

    return NextResponse.json({
      likes: design.likes,
      isLiked,
    });
  } catch (_error) {
    // Error getting like status - returning default
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
