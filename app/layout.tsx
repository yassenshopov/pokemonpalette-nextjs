import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ColorProvider } from "@/contexts/color-context";
import { Inter, Outfit } from 'next/font/google';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: {
    default: 'Pokemon Palette - Create Color Palettes from Pokemon',
    template: '%s | Pokemon Palette'
  },
  description: 'Generate beautiful color palettes inspired by Pokemon. Create, save, and share color combinations based on your favorite Pokemon.',
  keywords: ['pokemon', 'color palette', 'color scheme', 'design tools', 'pokemon colors'],
  
  // Open Graph
  openGraph: {
    title: 'Pokemon Palette - Create Color Palettes from Pokemon',
    description: 'Generate beautiful color palettes inspired by Pokemon. Create, save, and share color combinations based on your favorite Pokemon.',
    url: 'https://pokemonpalette.com',
    siteName: 'Pokemon Palette',
    images: [
      {
        url: '/og-image.webp', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'Pokemon Palette - Create beautiful color schemes'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Palette - Create Color Palettes from Pokemon',
    description: 'Generate beautiful color palettes inspired by Pokemon',
    images: ['/og-image.webp'], // You'll need to create this image
    creator: '@yassenshopov'
  },

  // Robots
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

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo512.png',
    apple: '/logo512.png',
  },

  // Manifest
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans`}>
        <NextThemeProvider attribute="class">
          <ColorProvider>
            {children}
          </ColorProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
