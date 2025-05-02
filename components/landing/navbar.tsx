import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NavbarProps {
  colors: string[];
  pokemonName?: string;
  pokemonNumber?: number;
  getContrastColor: (color: string) => { text: string; overlay: string };
}

export function Navbar({ colors, pokemonName, pokemonNumber, getContrastColor }: NavbarProps) {
  const [isRotating, setIsRotating] = useState(false);

  // Function to get hue from color
  const getHueFromColor = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map(Number);

    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return Math.round(h * 360);
  };

  // Trigger rotation animation when colors change
  useEffect(() => {
    setIsRotating(true);
    const timer = setTimeout(() => setIsRotating(false), 1000);
    return () => clearTimeout(timer);
  }, [colors]);

  return (
    <nav
      className="box-border fixed top-0 left-0 md:left-[350px] lg:left-[450px] right-0 z-30 h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        background: `linear-gradient(to right, ${colors[0]}20, ${colors[1]}10)`,
      }}
    >
      <div className="container h-full px-4 mx-auto flex items-center justify-between gap-4">
        {/* Logo/Title Section */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative h-8 w-8">
            <Image
              src="/logo512.png"
              alt="Pokemon Palette Logo"
              width={32}
              height={32}
              className={`h-full w-full object-contain transition-all ${isRotating ? 'animate-rotate' : ''}`}
              style={{
                filter: `hue-rotate(${colors.length > 0 ? getHueFromColor(colors[0]) : 0}deg)`,
              }}
            />
          </div>
          <div className="font-display">
            {pokemonNumber && pokemonName ? (
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">
                  #{pokemonNumber.toString().padStart(3, '0')}
                </p>
                <h1 className="text-lg font-semibold capitalize -mt-1">
                  {pokemonName.replace(/-/g, ' ')}
                </h1>
              </div>
            ) : (
              <h1 className="text-lg font-semibold">
                Pokemon Palette
              </h1>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-sm font-medium transition-colors hover:bg-primary/10 gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Sign in to save palettes
              </Button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-sm font-medium transition-colors hover:bg-primary/10 gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Save Palette
              </Button>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-2 ring-border hover:ring-primary transition-all",
                    userButtonPopover: "shadow-lg rounded-lg border border-border"
                  }
                }}
              />
            </div>
          </SignedIn>

          <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block" />
          
          <div className="hidden sm:block">
            <a
              href="https://www.buymeacoffee.com/yassenshopov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 h-8 text-sm font-medium rounded-lg transition-all hover:opacity-90 active:scale-95"
              style={{ 
                backgroundColor: colors[0],
                color: getContrastColor(colors[0]).text === 'text-white' ? 'white' : 'black'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                width="16"
                height="16"
                viewBox="0 0 1279 1279"
                className="mr-2"
              >
                <path
                  d="M472.623 590.836C426.682 610.503 374.546 632.802 306.976 632.802C278.71 632.746 250.58 628.868 223.353 621.274L270.086 1101.08C271.74 1121.13 280.876 1139.83 295.679 1153.46C310.482 1167.09 329.87 1174.65 349.992 1174.65C349.992 1174.65 416.254 1178.09 438.365 1178.09C462.161 1178.09 533.516 1174.65 533.516 1174.65C553.636 1174.65 573.019 1167.08 587.819 1153.45C602.619 1139.82 611.752 1121.13 613.406 1101.08L663.459 570.876C641.091 563.237 618.516 558.161 593.068 558.161C549.054 558.144 513.591 573.303 472.623 590.836Z"
                  fill={colors[1]}
                />
                <path
                  d="M800.796 382.989C793.088 390.319 781.473 393.726 769.996 395.43C641.292 414.529 510.713 424.199 380.597 419.932C287.476 416.749 195.336 406.407 103.144 393.382C94.1102 392.109 84.3197 390.457 78.1082 383.798C66.4078 371.237 72.1548 345.944 75.2003 330.768C77.9878 316.865 83.3218 298.334 99.8572 296.355C125.667 293.327 155.64 304.218 181.175 308.09C211.917 312.781 242.774 316.538 273.745 319.36C405.925 331.405 540.325 329.529 671.92 311.91C695.905 308.686 719.805 304.941 743.619 300.674C764.835 296.871 788.356 289.731 801.175 311.703C809.967 326.673 811.137 346.701 809.778 363.615C809.359 370.984 806.139 377.915 800.779 382.989H800.796Z"
                  fill="currentColor"
                />
              </svg>
              <span>Support</span>
            </a>
          </div>

          <div className="h-4 w-px bg-border/50 mx-1" />
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
} 