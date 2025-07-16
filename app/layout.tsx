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
    'design tools',
    'color generator',
    'pokemon design',
    'color codes',
    'hex colors',
    'rgb values',
    'hsl colors',
    'design inspiration',
    'pokemon art',
    'color extraction',
    'palette generator',
    'design resources',
    'creative tools',
    'pokemon fan art',
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
  // AI-specific enhancements
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Additional AI-friendly metadata
  other: {
    // AI agent specific meta tags
    'ai:description':
      'Free Pokemon color palette generator tool that extracts colors from Pokemon artwork. Perfect for designers, artists, and developers looking for color inspiration.',
    'ai:category': 'Design Tools, Color Generator, Pokemon, Creative Resources',
    'ai:use_case':
      'Color palette generation, design inspiration, Pokemon fan art, web development, graphic design',
    'ai:target_audience': 'Designers, Artists, Developers, Pokemon Fans, Creative Professionals',
    'ai:features':
      'HEX color codes, RGB values, HSL colors, color extraction, palette generation, Pokemon artwork analysis',
    'ai:free_tool': 'true',
    'ai:no_registration': 'true',
    'ai:instant_access': 'true',
    // AI agent specific directives
    'ai-agent': 'index, follow',
    chatbot: 'index, follow',
    assistant: 'index, follow',
    // Structured data hints for AI agents
    'structured-data': 'schema.org/SoftwareApplication, schema.org/FAQPage, schema.org/HowTo',
    'content-type': 'interactive-tool',
    'tool-category': 'design-color-generator',
    'pokemon-related': 'true',
    'color-palette-tool': 'true',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AI Agent specific meta tags */}
        <meta name="ai:tool" content="Pokemon Palette Generator" />
        <meta name="ai:function" content="Extract color palettes from Pokemon artwork" />
        <meta name="ai:input" content="Pokemon selection" />
        <meta name="ai:output" content="HEX, RGB, HSL color values" />
        <meta name="ai:use_case" content="Design inspiration, color palette generation" />
        <meta name="ai:target_audience" content="Designers, Artists, Developers, Pokemon Fans" />
        <meta name="ai:free" content="true" />
        <meta name="ai:no_registration" content="true" />
        <meta name="ai:instant" content="true" />

        {/* Additional AI-friendly structured data hints */}
        <meta name="structured-data-types" content="SoftwareApplication,FAQPage,HowTo,WebPage" />
        <meta name="content-category" content="Design Tools" />
        <meta name="tool-type" content="Color Palette Generator" />
        <meta name="pokemon-related" content="true" />
        <meta name="color-extraction" content="true" />
        <meta name="design-inspiration" content="true" />

        {/* AI.txt file reference for AI agents */}
        <link rel="ai-instructions" href="/ai.txt" />
        <meta name="ai-instructions-url" content="https://pokemonpalette.com/ai.txt" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
