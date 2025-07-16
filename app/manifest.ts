import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pokemon Palette - Color Inspiration from Pokemon',
    short_name: 'PokePalette',
    description:
      'Generate beautiful color palettes from Pokemon. Find the perfect color scheme inspired by your favorite Pokemon for your next design project.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#ffcc00',
    categories: ['design', 'tools', 'entertainment', 'pokemon'],
    lang: 'en',
    scope: '/',
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
        purpose: 'maskable',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Random Pokemon',
        short_name: 'Random',
        description: 'Get a random Pokemon color palette',
        url: '/?random=true',
        icons: [{ src: '/logo192.png', sizes: '192x192' }],
      },
      {
        name: 'Game Mode',
        short_name: 'Game',
        description: 'Play the Pokemon color guessing game',
        url: '/game',
        icons: [{ src: '/logo192.png', sizes: '192x192' }],
      },
      {
        name: 'Saved Palettes',
        short_name: 'Saved',
        description: 'View your saved color palettes',
        url: '/saved',
        icons: [{ src: '/logo192.png', sizes: '192x192' }],
      },
    ],
    screenshots: [
      {
        src: '/og-image.webp',
        sizes: '1200x630',
        type: 'image/webp',
        form_factor: 'wide',
      },
    ],
  };
}
