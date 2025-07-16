import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Blog - Pokemon Palette',
  description:
    'Learn about color theory, Pokemon design inspiration, and creative tips for using Pokemon color palettes in your projects.',
  keywords: [
    'pokemon design blog',
    'color theory',
    'design inspiration',
    'pokemon art',
    'color psychology',
    'design tips',
    'creative inspiration',
    'pokemon fan art',
    'design tutorials',
    'color palette guides',
  ],
  openGraph: {
    title: 'Design Blog - Pokemon Palette',
    description: 'Learn about color theory, Pokemon design inspiration, and creative tips.',
    images: [
      {
        url: 'https://pokemonpalette.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Pokemon Palette Design Blog',
      },
    ],
    type: 'website',
    siteName: 'Pokemon Palette',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Blog - Pokemon Palette',
    description: 'Learn about color theory, Pokemon design inspiration, and creative tips.',
    images: ['https://pokemonpalette.com/og-image.webp'],
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
