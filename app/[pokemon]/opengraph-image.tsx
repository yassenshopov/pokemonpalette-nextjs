import { ImageResponse } from 'next/og';
import speciesData from '@/data/species.json';

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

export async function GET(request: Request, { params }: { params: { pokemon: string } }) {
  try {
    const pokemon = params.pokemon;
    const formattedName = capitalizeWords(pokemon);
    const pokemonId = typedSpeciesData[pokemon.toLowerCase()] || 1;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    // Use a system font instead of fetching from Google Fonts
    const fontFamily =
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(to bottom, #ffcc00, #ffaa33)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '4rem',
            fontFamily,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              width: '60%',
              height: '100%',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 'bold', color: '#000' }}>Pokémon Palette</div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#000',
                marginTop: '1rem',
                marginBottom: '2rem',
                lineHeight: 1.1,
              }}
            >
              {formattedName} Color Palette
            </div>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {['#FF5555', '#55AAFF', '#FFDD44', '#66CC77', '#AA66CC'].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: color,
                    borderRadius: 30,
                    border: '3px solid white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: 28, color: '#000', maxWidth: '90%' }}>
              Beautiful color schemes inspired by {formattedName}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 80,
              bottom: 0,
              width: 400,
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={imageUrl}
              width={400}
              height={400}
              style={{
                objectFit: 'contain',
              }}
              alt={formattedName}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
