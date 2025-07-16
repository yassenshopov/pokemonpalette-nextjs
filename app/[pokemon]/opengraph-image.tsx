import { ImageResponse } from 'next/og';
import speciesData from '@/data/species.json';
import { logger } from '@/lib/logger';

// Define the type for species data
interface SpeciesData {
  [key: string]: number;
}

// Use type assertion for speciesData
const typedSpeciesData = speciesData as SpeciesData;

// Helper function to capitalize first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const runtime = 'edge';
export const alt = 'Pokemon Color Palette';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { pokemon: string } }) {
  try {
    const pokemonName =
      params.pokemon.charAt(0).toUpperCase() + params.pokemon.slice(1).replace(/-/g, ' ');
    const pokemonId = speciesData[params.pokemon as keyof typeof speciesData];

    // Check if pokemonId exists
    if (!pokemonId) {
      logger.error('Pokemon not found in species data', null, {
        pokemonName: params.pokemon,
        endpoint: '/[pokemon]/opengraph-image',
      });

      // Return fallback image for invalid Pokemon
      return new ImageResponse(
        (
          <div
            style={{
              background: 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px',
                }}
              >
                ❓
              </div>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                Pokemon Not Found
              </h1>
              <p
                style={{
                  fontSize: '24px',
                  color: '#d1d5db',
                  margin: 0,
                }}
              >
                This Pokemon doesn't exist in our database
              </p>
            </div>

            {/* Site Info */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🎨
              </div>
              <p
                style={{
                  fontSize: '24px',
                  color: 'white',
                  margin: 0,
                }}
              >
                pokemonpalette.com
              </p>
            </div>
          </div>
        ),
        {
          ...size,
        }
      );
    }

    const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '40px',
              marginBottom: '40px',
            }}
          >
            {/* Pokemon Image */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '300px',
                height: '300px',
              }}
            >
              <img
                src={pokemonImage}
                alt={pokemonName}
                width={250}
                height={250}
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Text Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '600px',
              }}
            >
              <h1
                style={{
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: 'white',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {pokemonName}
                <br />
                <span
                  style={{
                    fontSize: '48px',
                    color: '#9ca3af',
                  }}
                >
                  Color Palettes
                </span>
              </h1>
              <p
                style={{
                  fontSize: '24px',
                  color: '#d1d5db',
                  margin: 0,
                }}
              >
                Get inspired by {pokemonName}'s unique colors and create stunning designs
              </p>
            </div>
          </div>

          {/* Site Info */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🎨
            </div>
            <p
              style={{
                fontSize: '24px',
                color: 'white',
                margin: 0,
              }}
            >
              pokemonpalette.com
            </p>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Failed to generate opengraph image', error, {
      pokemonName: params.pokemon,
      endpoint: '/[pokemon]/opengraph-image',
    });

    // Return a generic error fallback image
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
              }}
            >
              ⚠️
            </div>
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
              }}
            >
              Something Went Wrong
            </h1>
            <p
              style={{
                fontSize: '24px',
                color: '#d1d5db',
                margin: 0,
              }}
            >
              Unable to generate image at this time
            </p>
          </div>

          {/* Site Info */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🎨
            </div>
            <p
              style={{
                fontSize: '24px',
                color: 'white',
                margin: 0,
              }}
            >
              pokemonpalette.com
            </p>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
