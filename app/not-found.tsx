'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import { GameBackground } from '@/components/game-background';
import { useColors } from '@/contexts/color-context';
import Head from 'next/head';

// Component that will use searchParams inside Suspense boundary
function NotFoundContent() {
  const { colors } = useColors();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>
      <GameBackground colors={colors} />
      <div className="scanlines pointer-events-none absolute inset-0 z-30" />
      <header className="w-full bg-card/80 fixed top-0 left-0 z-50 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-4 group"
              tabIndex={0}
              aria-label="Go to homepage"
            >
              <Image
                src="/logo512.png"
                alt="Pokemon Palette Logo"
                width={32}
                height={32}
                className="w-8 h-8 pokemon-float group-hover:scale-110 transition-transform"
              />
              <h1 className="text-lg font-bold font-display leading-tight">
                Pokemon Palette
                <span className="block text-xs text-muted-foreground -mt-1">Not Found</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8">
              <Link href="/">Home</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
        <div className="gameboy-frame relative w-full max-w-md mx-auto overflow-hidden rounded-2xl border-4 border-[#bfcf9b] dark:border-[#3a352a] bg-[#e6f2c2] dark:bg-[#181a13] shadow-2xl z-10">
          <div className="absolute inset-0 border-4 border-[#7c8a5a] dark:border-[#3a352a] pointer-events-none rounded-2xl" />
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                <div className="glitch relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/images/misc/missingno.webp"
                    alt="MissingNo"
                    fill
                    className="object-contain"
                    priority
                  />
                  <span
                    className="glitch-text absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-[#3a352a] font-pixel uppercase tracking-widest bg-[#e6f2c2]/80 dark:bg-[#181a13]/80 px-2 py-1 rounded shadow-lg z-20"
                    style={{ fontFamily: 'Press Start 2P, monospace' }}
                  >
                    MISSINGNO.
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h1
                  className="text-2xl md:text-3xl font-bold font-pixel glitch-text text-[#23281c] dark:text-[#e0d8b0]"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  404 - PAGE NOT FOUND
                </h1>
                <p
                  className="text-[#4d5a2a] dark:text-[#b2b88a] font-pixel text-xs md:text-sm"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  A wild glitch appeared! This page is as broken as Cinnabar Island's coastline.
                </p>
              </div>
              <div
                className="bg-[#f6ffe0] dark:bg-[#23281c] border-2 border-[#bfcf9b] dark:border-[#3a352a] rounded-lg p-4 mt-4 text-left font-pixel text-xs md:text-sm text-[#23281c] dark:text-[#e0d8b0] shadow-inner"
                style={{ fontFamily: 'Press Start 2P, monospace' }}
              >
                <b>Pokédex Entry:</b>
                <br />
                <span>
                  No. 000 MISSINGNO.
                  <br />
                  Height: ???
                  <br />
                  Weight: ???
                  <br />
                  This Pokémon is the result of a page gone wrong. Encountering it may cause
                  unexpected results.
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto font-pixel text-base bg-[#a259a6] hover:bg-[#c77dff] text-white border-none shadow-md"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  <Link href="/">Return Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-pixel text-base border-[#a259a6] text-[#a259a6] hover:bg-[#a259a6]/10 shadow-md"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  <Link href="/game">Play Pokemon Guesser</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <style jsx>{`
        .font-pixel {
          font-family: 'Press Start 2P', monospace !important;
        }
        .glitch {
          animation: glitch 1.2s infinite linear alternate-reverse;
        }
        .glitch-text {
          text-shadow: 2px 0 #ff00c8, -2px 0 #00fff9, 0 2px #fffb00;
          animation: glitch-text 1.2s infinite linear alternate-reverse;
        }
        @keyframes glitch {
          0% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-2px, 2px) skew(-1deg, 1deg);
          }
          40% {
            transform: translate(-2px, -2px) skew(1deg, -1deg);
          }
          60% {
            transform: translate(2px, 2px) skew(-1deg, 1deg);
          }
          80% {
            transform: translate(2px, -2px) skew(1deg, -1deg);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        @keyframes glitch-text {
          0% {
            text-shadow: 2px 0 #ff00c8, -2px 0 #00fff9, 0 2px #fffb00;
          }
          20% {
            text-shadow: 2px 2px #ff00c8, -2px -2px #00fff9, 0 2px #fffb00;
          }
          40% {
            text-shadow: -2px 2px #ff00c8, 2px -2px #00fff9, 0 -2px #fffb00;
          }
          60% {
            text-shadow: -2px -2px #ff00c8, 2px 2px #00fff9, 0 2px #fffb00;
          }
          80% {
            text-shadow: 2px -2px #ff00c8, -2px 2px #00fff9, 0 -2px #fffb00;
          }
          100% {
            text-shadow: 2px 0 #ff00c8, -2px 0 #00fff9, 0 2px #fffb00;
          }
        }
        .gameboy-frame {
          box-shadow: 0 0 0 8px #b8b090, 0 0 0 12px #7c6f57, 0 8px 32px 0 #0008;
        }
        .scanlines {
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.08) 0px,
            rgba(0, 0, 0, 0.08) 1px,
            transparent 1px,
            transparent 4px
          );
          mix-blend-mode: multiply;
          z-index: 30;
        }
      `}</style>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-lg animate-pulse">Loading...</p>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
}
