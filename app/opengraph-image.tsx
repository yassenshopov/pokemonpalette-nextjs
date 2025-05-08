import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  try {
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            position: 'relative',
            fontFamily,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                'url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png) no-repeat',
              backgroundSize: '400px 400px',
              backgroundPosition: 'right -40px bottom -40px',
              opacity: 0.2,
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              color: '#000',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: '1rem' }}>
              Pokémon Palette
            </div>
            <div style={{ fontSize: 36, fontWeight: 'normal', marginBottom: '2rem' }}>
              Color Schemes Inspired by Pokémon
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              {['#FF5555', '#55AAFF', '#FFDD44', '#66CC77', '#AA66CC'].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: color,
                    borderRadius: 40,
                    border: '4px solid white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
