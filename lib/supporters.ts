export interface Supporter {
  name: string;
  timeAgo: string;
}

export interface SupportersData {
  supporters: Supporter[];
  total: number;
  success: boolean;
  message?: string;
}

/**
 * Fetches supporter data from our API endpoint or returns mocks if needed
 */
export async function fetchSupporters(): Promise<SupportersData> {
  try {
    const response = await fetch('/api/supporters', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching supporters: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching supporters:', error);

    // Return mock data as fallback in case of client-side errors
    return {
      success: false,
      supporters: [
        { name: 'Isabel McKinley', timeAgo: '25d ago' },
        { name: 'Hal', timeAgo: '1mo ago' },
        { name: 'Kalidorix', timeAgo: '7mo ago' },
      ],
      total: 5,
      message: 'Using fallback data due to fetch error',
    };
  }
}
