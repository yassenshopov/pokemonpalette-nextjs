import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';

// Input sanitization and validation functions
function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function validateString(input: string, fieldName: string, maxLength: number = 1000): string | null {
  if (!input || typeof input !== 'string') {
    return `${fieldName} is required and must be a string`;
  }

  const sanitized = sanitizeString(input);

  if (sanitized.length === 0) {
    return `${fieldName} cannot be empty after sanitization`;
  }

  if (sanitized.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or less`;
  }

  return null; // No error
}

function validateTags(tags: string[]): {
  isValid: boolean;
  error?: string;
  sanitizedTags?: string[];
} {
  if (!Array.isArray(tags)) {
    return { isValid: false, error: 'Tags must be an array' };
  }

  const sanitizedTags: string[] = [];
  const maxTagLength = 50;
  const maxTags = 10;

  if (tags.length > maxTags) {
    return { isValid: false, error: `Maximum ${maxTags} tags allowed` };
  }

  for (const tag of tags) {
    if (typeof tag !== 'string') {
      return { isValid: false, error: 'Each tag must be a string' };
    }

    const sanitizedTag = sanitizeString(tag);

    if (sanitizedTag.length === 0) {
      return { isValid: false, error: 'Tags cannot be empty after sanitization' };
    }

    if (sanitizedTag.length > maxTagLength) {
      return { isValid: false, error: `Each tag must be ${maxTagLength} characters or less` };
    }

    // Validate tag format (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9-_]+$/.test(sanitizedTag)) {
      return {
        isValid: false,
        error: 'Tags can only contain letters, numbers, hyphens, and underscores',
      };
    }

    sanitizedTags.push(sanitizedTag.toLowerCase());
  }

  return { isValid: true, sanitizedTags };
}

function validateColors(colors: string[]): {
  isValid: boolean;
  error?: string;
  sanitizedColors?: string[];
} {
  if (!Array.isArray(colors)) {
    return { isValid: false, error: 'Colors must be an array' };
  }

  if (colors.length === 0) {
    return { isValid: false, error: 'At least one color is required' };
  }

  if (colors.length > 20) {
    return { isValid: false, error: 'Maximum 20 colors allowed' };
  }

  const sanitizedColors: string[] = [];
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  for (const color of colors) {
    if (typeof color !== 'string') {
      return { isValid: false, error: 'Each color must be a string' };
    }

    const sanitizedColor = color.trim().toLowerCase();

    if (!hexColorRegex.test(sanitizedColor)) {
      return { isValid: false, error: 'Each color must be a valid hex color (e.g., #FF0000)' };
    }

    sanitizedColors.push(sanitizedColor);
  }

  return { isValid: true, sanitizedColors };
}

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
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, pokemon, colors, tags, imageUrl, creator } = body;

    // Sanitize and validate all string inputs
    const titleError = validateString(title, 'Title', 200);
    if (titleError) {
      return NextResponse.json({ error: titleError }, { status: 400 });
    }

    const descriptionError = validateString(description, 'Description', 2000);
    if (descriptionError) {
      return NextResponse.json({ error: descriptionError }, { status: 400 });
    }

    const categoryError = validateString(category, 'Category', 100);
    if (categoryError) {
      return NextResponse.json({ error: categoryError }, { status: 400 });
    }

    const pokemonError = validateString(pokemon, 'Pokemon', 100);
    if (pokemonError) {
      return NextResponse.json({ error: pokemonError }, { status: 400 });
    }

    const imageUrlError = validateString(imageUrl, 'Image URL', 500);
    if (imageUrlError) {
      return NextResponse.json({ error: imageUrlError }, { status: 400 });
    }

    const creatorError = creator ? validateString(creator, 'Creator', 100) : null;
    if (creatorError) {
      return NextResponse.json({ error: creatorError }, { status: 400 });
    }

    // Validate and sanitize colors
    const colorValidation = validateColors(colors);
    if (!colorValidation.isValid) {
      return NextResponse.json({ error: colorValidation.error }, { status: 400 });
    }

    // Validate and sanitize tags
    const tagsArray = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag: string) => tag.trim())
      : [];
    const tagValidation = validateTags(tagsArray);
    if (!tagValidation.isValid) {
      return NextResponse.json({ error: tagValidation.error }, { status: 400 });
    }

    // Create new design with sanitized inputs
    const newDesign = {
      id: designs.length + 1,
      title: sanitizeString(title),
      description: sanitizeString(description),
      category: sanitizeString(category),
      pokemon: sanitizeString(pokemon),
      colors: colorValidation.sanitizedColors!,
      tags: tagValidation.sanitizedTags!,
      imageUrl: sanitizeString(imageUrl),
      creator: creator ? sanitizeString(creator) : 'Anonymous',
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
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Failed to submit design', error, {
      endpoint: '/api/designs',
      method: 'POST',
      userId: userId || 'unknown',
    });

    // Enhanced error response with more context while maintaining security
    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? `Design submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        : 'Failed to submit design. Please try again later.';

    return NextResponse.json(
      {
        error: errorMessage,
        code: 'DESIGN_SUBMISSION_FAILED',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
