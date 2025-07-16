import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Resources - Pokemon Palette',
  description:
    'Free design resources, color theory guides, and tools for designers. Learn about color psychology, accessibility, and design best practices.',
  keywords: [
    'design resources',
    'color theory guides',
    'design tools',
    'color psychology',
    'design accessibility',
    'free design resources',
    'color palette tools',
    'design inspiration',
    'pokemon design resources',
    'web design tools',
    'ui design guides',
  ],
  openGraph: {
    title: 'Design Resources - Pokemon Palette',
    description: 'Free design resources, color theory guides, and tools for designers.',
    images: [
      {
        url: 'https://pokemonpalette.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Pokemon Palette Design Resources',
      },
    ],
    type: 'website',
    siteName: 'Pokemon Palette',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Resources - Pokemon Palette',
    description: 'Free design resources, color theory guides, and tools for designers.',
    images: ['https://pokemonpalette.com/og-image.webp'],
  },
  alternates: {
    canonical: '/resources',
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
