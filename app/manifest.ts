import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pokemon Palette',
    short_name: 'PokePalette',
    description: 'Color palettes inspired by Pokemon',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffcc00',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
