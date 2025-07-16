import { NextResponse } from 'next/server';

// This would be stored in an environment variable
const BUYMEACOFFEE_TOKEN = process.env.BUYMEACOFFEE_TOKEN;
const BUYMEACOFFEE_USERNAME = process.env.BUYMEACOFFEE_USERNAME || 'yassenshopov';

interface Supporter {
  supporter_name: string;
  support_created_on: string;
  support_coffee_num: number;
  support_visibility: number;
  payer_email: string;
  support_note: string;
  transaction_id: string;
  support_id: string;
  support_amount: number;
  support_currency: string;
  referer: string;
}

export async function GET() {
  try {
    // Check if token is available
    if (!BUYMEACOFFEE_TOKEN) {
      // Return mock data if no token is available (for development)
      return NextResponse.json({
        success: true,
        supporters: getMockSupporters(),
        total: 5,
        message: 'Using mock data (no API token provided)',
      });
    }

    // Fetch real data from Buy Me a Coffee API
    const response = await fetch(`https://developers.buymeacoffee.com/api/v1/supporters`, {
      headers: {
        Authorization: `Bearer ${BUYMEACOFFEE_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Process and return the data, focusing on names and timestamps only
    return NextResponse.json({
      success: true,
      supporters: data.data.map((supporter: Supporter) => ({
        name: supporter.supporter_name || 'Anonymous',
        timeAgo: getTimeAgo(new Date(supporter.support_created_on)),
        // We're not passing the amount/currency data as we'll use fixed values in the UI
      })),
      total: Math.min(data.total || 5, 5), // Ensure we never show more than 5 supporters in the UI
    });
  } catch (error) {
    // Error fetching supporters - returning fallback data

    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      supporters: getMockSupporters(),
      total: 5,
      message: 'Using mock data (API error)',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return `${Math.floor(diffInDays / 30)}mo ago`;
}

// Helper function to get mock data
function getMockSupporters() {
  const recentSupporters = [
    { name: 'Isabel McKinley', timeOffset: 25 * 24 },
    { name: 'Hal', timeOffset: 30 * 24 },
    { name: 'Kalidorix', timeOffset: 7 * 30 * 24 },
  ];

  return recentSupporters.map(supporter => {
    const date = new Date();
    date.setHours(date.getHours() - supporter.timeOffset);

    return {
      name: supporter.name,
      timeAgo: getTimeAgo(date),
      // We're not including amount/currency here as we'll use fixed values in the UI
    };
  });
}
