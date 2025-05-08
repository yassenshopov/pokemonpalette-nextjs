import './globals.css';
import { Providers } from './providers';
import GoogleAnalytics from './components/GoogleAnalytics';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  title: {
    template: '%s | Pokemon Palette',
    default: 'Pokemon Palette - Color Palettes Inspired by Pokemon',
  },
  description:
    'Generate beautiful color palettes from Pokemon. Find the perfect color scheme inspired by your favorite Pokemon for your next design project.',
  keywords: [
    'pokemon',
    'color palette',
    'design',
    'color scheme',
    'pokemon colors',
    'color inspiration',
  ],
  authors: [{ name: 'Yassen Shopov' }],
  creator: 'Yassen Shopov',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pokemonpalette.com',
    title: 'Pokemon Palette - Color Palettes Inspired by Pokemon',
    description:
      'Generate beautiful color palettes from Pokemon. Find the perfect color scheme inspired by your favorite Pokemon for your next design project.',
    siteName: 'Pokemon Palette',
    images: [
      {
        url: 'https://pokemonpalette.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pokemon Palette - Find color inspiration from your favorite Pokemon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Palette - Color Palettes Inspired by Pokemon',
    description:
      'Generate beautiful color palettes from Pokemon. Find the perfect color scheme inspired by your favorite Pokemon for your next design project.',
    images: ['https://pokemonpalette.com/og-image.jpg'],
    creator: '@yassenshopov',
  },
  metadataBase: new URL('https://pokemonpalette.com'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </body>
    </html>
  );
}
