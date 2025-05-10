'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import speciesData from '@/data/species.json';
import { useColors } from '@/contexts/color-context';
import ColorThief from 'colorthief';
import { PokemonSearch } from '@/components/pokemon-search';
import { LoadingPokeball } from '@/components/loading-pokeball';
import confetti from 'canvas-confetti';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { TypeBadge } from '@/components/type-badge';
import { GameBackground } from '@/components/game-background';
import '../styles/game-animations.css';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { ColorPalette } from '@/components/landing/color-palette';

type HintType =
  | 'first-letter'
  | 'generation'
  | 'type'
  | 'size'
  | 'pokedex'
  | 'name-length'
  | 'common-substring';

interface GuessData {
  name: string;
  sprite: string;
  types: string[];
  generation: number;
}

interface GameState {
  remainingGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
  guessHistory: GuessData[];
  hints: string[];
  usedHintTypes: HintType[];
  gameMode: 'daily' | 'unlimited';
  isShiny: boolean;
}

interface PokemonData {
  id: number;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
}

// Add these service functions
const PokemonService = {
  async fetchPokemon(identifier: string | number): Promise<any> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${identifier.toString().toLowerCase()}`
    );
    if (!response.ok) throw new Error('Pokemon not found');
    return response.json();
  },

  getSpeciesId(name: string): number | null {
    return (speciesData as Record<string, number>)[name.toLowerCase()] || null;
  },
};

export default function GamePage() {
  const [currentGuess, setCurrentGuess] = useState('');
  const [targetPokemon, setTargetPokemon] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>({
    remainingGuesses: 4,
    gameStatus: 'playing',
    guessHistory: [],
    hints: [],
    usedHintTypes: [],
    gameMode: 'unlimited',
    isShiny: false,
  });
  const { colors, setColors } = useColors();
  const [pokemonSprite, setPokemonSprite] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [targetPokemonData, setTargetPokemonData] = useState<PokemonData | null>(null);
  const [isGuessing, setIsGuessing] = useState(false);
  const [showLossDialog, setShowLossDialog] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Helper function to get a random Pokemon
  const getRandomPokemon = () => {
    const pokemonNames = Object.keys(speciesData);
    const randomIndex = Math.floor(Math.random() * pokemonNames.length);
    return pokemonNames[randomIndex];
  };

  // Add color extraction function
  const extractColors = async (imageUrl: string) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';

    return new Promise(resolve => {
      img.onload = () => {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 3);
        const hexColors = palette.map((rgb: number[]) => {
          const [r, g, b] = rgb;
          return `rgb(${r}, ${g}, ${b})`;
        });
        resolve(hexColors);
      };
      img.src = imageUrl;
    });
  };

  // Helper to determine generation from Pokedex number
  const getGeneration = (id: number): number => {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9;
  };

  // Add this function to get daily Pokemon
  const getDailyPokemon = () => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const pokemonNames = Object.keys(speciesData);

    // Use the date string to generate a consistent index for the day
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = (hash << 5) - hash + dateString.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }

    const index = Math.abs(hash) % pokemonNames.length;
    return pokemonNames[index];
  };

  // Move initGame here, before useEffect
  const initGame = async (mode: 'daily' | 'unlimited' = gameState.gameMode) => {
    setIsLoading(true);
    const randomPokemon = mode === 'daily' ? getDailyPokemon() : getRandomPokemon();
    setTargetPokemon(randomPokemon);

    // Determine if this Pokemon should be shiny (1/20 chance)
    const isShiny = Math.random() < 0.05;

    try {
      const data = await PokemonService.fetchPokemon(randomPokemon);
      setTargetPokemonData(data);

      // Use shiny sprite if available and Pokemon is shiny
      const spriteUrl = isShiny
        ? data.sprites.other['official-artwork'].front_shiny ||
          data.sprites.other['official-artwork'].front_default
        : data.sprites.other['official-artwork'].front_default;

      const pixelSpriteUrl = isShiny
        ? data.sprites.front_shiny || data.sprites.front_default
        : data.sprites.front_default;

      setPokemonSprite(spriteUrl);

      if (pixelSpriteUrl) {
        const colors = await extractColors(pixelSpriteUrl);
        setColors(colors as string[]);
      }

      // Update game state with shiny status
      setGameState(prev => ({
        ...prev,
        isShiny,
      }));
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect can now reference initGame
  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = async () => {
    if (gameState.gameStatus !== 'playing') return;
    if (!currentGuess.trim()) return;

    setIsGuessing(true);
    setIsLoading(true);
    const normalizedGuess = currentGuess.toLowerCase().trim().replace(/\s+/g, '-');
    const normalizedTarget = targetPokemon.toLowerCase();

    console.log('Attempting guess:', {
      original: currentGuess,
      normalized: normalizedGuess,
      target: targetPokemon,
    });

    // First validate if it's a valid Pokemon name
    const guessId = PokemonService.getSpeciesId(normalizedGuess);
    console.log('Pokemon ID lookup:', {
      name: normalizedGuess,
      id: guessId,
      speciesData: (speciesData as Record<string, number>)[normalizedGuess],
    });

    if (!guessId) {
      // Get a slice of Pokemon names around where this guess would be alphabetically
      const allNames = Object.keys(speciesData).sort();
      const guessIndex = allNames.findIndex(name => name > normalizedGuess);
      const start = Math.max(0, guessIndex - 2);
      const nearbyNames = allNames.slice(start, start + 5);

      console.log('Invalid Pokemon name detected:', {
        input: currentGuess,
        normalized: normalizedGuess,
        nearbyNames: nearbyNames,
        validExample: 'Try Pokemon like: ' + nearbyNames.join(', '),
      });

      setGameState(prev => ({
        ...prev,
        guessHistory: [
          ...prev.guessHistory,
          { name: currentGuess, sprite: '', types: [], generation: 0 },
        ],
        hints: [...prev.hints, 'Invalid Pokemon name'],
        remainingGuesses: prev.remainingGuesses - 1,
      }));
      setCurrentGuess('');
      setIsLoading(false);
      setIsGuessing(false);
      return;
    }

    try {
      const guessData = await PokemonService.fetchPokemon(normalizedGuess);
      const guessInfo: GuessData = {
        name: currentGuess,
        sprite: guessData.sprites.front_default,
        types: guessData.types.map((t: any) => t.type.name),
        generation: getGeneration(guessData.id),
      };

      const newGameState = { ...gameState };
      newGameState.guessHistory.push(guessInfo);

      // Only decrease remaining guesses if it's not correct
      if (normalizedGuess === normalizedTarget) {
        console.log('Correct guess!');
        newGameState.gameStatus = 'won';
        setShowWinDialog(true);
        // Add victory celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors, // Use the Pokemon's color palette!
        });

        // Fire multiple bursts for more impact
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
          });
        }, 250);
      } else {
        newGameState.remainingGuesses--;
        if (newGameState.remainingGuesses === 0) {
          console.log('Game over - no more guesses');
          newGameState.gameStatus = 'lost';
          setShowLossDialog(true);
        } else {
          try {
            console.log('Generating hint for:', {
              guess: normalizedGuess,
              guessId: guessId,
              target: normalizedTarget,
              targetData: targetPokemonData,
            });

            const hint = await generateHint(normalizedGuess, normalizedTarget);
            console.log('Generated hint:', hint);
            newGameState.hints.push(hint);
          } catch (error) {
            console.error('Error generating hint:', error);
            newGameState.hints.push('Error generating hint');
          }
        }
      }

      setGameState(newGameState);
      setCurrentGuess('');
      setIsLoading(false);
      setIsGuessing(false);
    } catch (error) {
      console.error('Error processing guess:', error);
    }
  };

  const generateHint = async (guess: string, target: string): Promise<string> => {
    if (!targetPokemonData) return 'Loading hint...';

    try {
      const guessData = await PokemonService.fetchPokemon(guess);

      // Validate the required data exists
      if (!guessData || !guessData.types || !guessData.id) {
        return 'Error: Invalid Pokemon data';
      }

      // Progressive hints based on guess number
      const hintNumber = gameState.hints.length + 1;
      const targetTypes = targetPokemonData.types.map(t => t.type.name);

      switch (hintNumber) {
        case 1:
          // First hint: Primary type
          return `This Pokemon is a ${targetTypes[0]} type`;

        case 2:
          // Second hint: Single/Dual typing
          return targetTypes.length > 1
            ? `This Pokemon has a secondary ${targetTypes[1]} type`
            : `This Pokemon is a pure ${targetTypes[0]} type`;

        case 3:
          // Third hint: Generation
          const generation = getGeneration(targetPokemonData.id);
          return `This Pokemon is from Generation ${generation}`;

        default:
          // Fallback hint: Pokedex proximity
          const difference = Math.abs(targetPokemonData.id - guessData.id);
          return `Pokedex difference: ${difference} (${
            targetPokemonData.id > guessData.id ? 'higher' : 'lower'
          })`;
      }
    } catch (error) {
      console.error('Error in generateHint:', error);
      return 'Error generating hint';
    }
  };

  // Add toggle function
  const toggleGameMode = () => {
    setGameState(prev => ({
      ...prev,
      gameMode: prev.gameMode === 'unlimited' ? 'daily' : 'unlimited',
    }));
    initGame(gameState.gameMode === 'unlimited' ? 'daily' : 'unlimited');
  };

  // Update the play again functionality in the dialogs
  const handlePlayAgain = () => {
    setGameState(prev => ({
      remainingGuesses: 4,
      gameStatus: 'playing',
      guessHistory: [],
      hints: [],
      usedHintTypes: [],
      gameMode: prev.gameMode,
      isShiny: prev.isShiny,
    }));

    if (gameState.gameMode === 'unlimited') {
      initGame('unlimited');
    } else {
      // In daily mode, only allow playing again if it's a new day
      window.location.reload();
    }

    setShowWinDialog(false);
    setShowLossDialog(false);
  };

  const getHueFromColor = (color: string) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map(Number);
    const hsl = rgbToHsl(r, g, b);
    return hsl[0] * 360;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
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

    return [h, s, l];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <GameBackground colors={[]} />
        <LoadingPokeball className="w-16 h-16" />
        <p className="mt-4 text-lg animate-pulse">Loading game...</p>
      </div>
    );
  }

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
            <h1
              className="text-lg font-bold font-display leading-tight font-pixel"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              Pokemon Palette
              <span className="block text-xs text-muted-foreground -mt-1">Guesser</span>
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 font-pixel"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              <Link href="/">Home</Link>
            </Button>
            <Tabs value={gameState.gameMode} onValueChange={toggleGameMode} className="h-8">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="daily" className="text-xs px-3 font-pixel">
                  📅 Daily
                </TabsTrigger>
                <TabsTrigger value="unlimited" className="text-xs px-3 font-pixel">
                  🎲 Unlimited
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="h-8 font-pixel">
                  Sign In
                </Button>
              </SignInButton>
              <UserButton afterSignOutUrl="/" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center pt-20 px-4">
        {/* Show the color palette as the main focus */}
        <div className="w-full max-w-lg mx-auto mb-8">
          <ColorPalette colors={colors} />
        </div>
        <div
          className="gameboy-frame relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl shadow-2xl z-10 mt-2"
          style={{
            backgroundColor: colors[2] || '#e6f2c2',
            borderColor: colors[1] || '#bfcf9b',
            borderWidth: 4,
            boxShadow: `0 0 0 8px ${colors[2] || '#b8b090'}, 0 0 0 12px ${
              colors[1] || '#7c6f57'
            }, 0 8px 32px 0 #0008`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ border: `4px solid ${colors[1] || '#7c8a5a'}` }}
          />
          <div
            className="p-6 md:p-10 flex flex-col items-center gap-8"
            style={{ backgroundColor: `${colors[2]}20` || '#f6ffe0' }}
          >
            {/* Guess Input */}
            {gameState.gameStatus === 'playing' && (
              <div className="w-full max-w-[320px] mb-6">
                <div className="flex gap-2">
                  <PokemonSearch
                    onSelect={name => {
                      setCurrentGuess(name);
                      handleGuess();
                    }}
                    className="flex-1 glass-effect font-pixel"
                    placeholder="Guess the Pokémon by its colors..."
                    disabled={isGuessing}
                    disabledOptions={gameState.guessHistory.map(g => g.name)}
                    isShiny={gameState.isShiny}
                  />
                  <Button
                    onClick={handleGuess}
                    className="px-4 font-pixel"
                    style={{ backgroundColor: colors[0], color: '#fff', borderColor: colors[1] }}
                    variant="secondary"
                    disabled={isGuessing}
                  >
                    {isGuessing ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Guess'
                    )}
                  </Button>
                </div>
              </div>
            )}
            {/* Hearts and Guesses Display */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl transition-transform font-pixel ${
                      i < gameState.remainingGuesses ? 'animate-bounce' : 'opacity-40'
                    }`}
                    style={{ color: colors[1] }}
                  >
                    {i < gameState.remainingGuesses ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>
            </div>
            {/* Hints and History */}
            <div className="w-full max-w-[320px] space-y-2">
              {gameState.hints.map((hint, index) => {
                const guess = gameState.guessHistory[index];
                return (
                  <Card
                    key={index}
                    className="pokemon-card overflow-hidden"
                    style={{ backgroundColor: colors[2], color: '#fff', borderColor: colors[1] }}
                  >
                    <CardContent className="p-3 flex items-center gap-3 font-pixel text-xs md:text-sm">
                      <div className="flex-1">
                        <p className="font-bold capitalize" style={{ color: colors[0] }}>
                          {guess.name}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {guess.types.map(type => (
                            <TypeBadge key={type} type={type as any} />
                          ))}
                        </div>
                        <p className="mt-1" style={{ color: colors[1] }}>
                          {hint}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {/* Game Over States: show the sprite and result only after game ends */}
            {gameState.gameStatus !== 'playing' && (
              <div className="w-full max-w-[320px] mt-6">
                <Card
                  className="overflow-hidden"
                  style={{ backgroundColor: colors[2], color: '#fff', borderColor: colors[1] }}
                >
                  <CardContent className="p-6 flex flex-col items-center gap-4 font-pixel">
                    <div className="w-24 h-24 relative">
                      <Image
                        src={pokemonSprite}
                        alt={targetPokemon}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h2 className="text-xl font-bold mt-2 mb-1" style={{ color: colors[0] }}>
                      {gameState.gameStatus === 'won' ? '🎉 You caught it! 🎉' : '💔 Game Over! 💔'}
                    </h2>
                    <p className="text-center">
                      {gameState.gameStatus === 'won'
                        ? `You caught ${targetPokemon.replace(/-/g, ' ')} in ${
                            4 - gameState.remainingGuesses + 1
                          } ${4 - gameState.remainingGuesses + 1 === 1 ? 'try' : 'tries'}!`
                        : `The Pokémon was ${targetPokemon.replace(
                            /-/g,
                            ' '
                          )}. Better luck next time!`}
                    </p>
                    <Button
                      onClick={handlePlayAgain}
                      className="w-full font-pixel"
                      style={{ backgroundColor: colors[0], color: '#fff', borderColor: colors[1] }}
                    >
                      {gameState.gameMode === 'unlimited' ? 'Play Again' : 'Back to Home'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <style jsx>{`
        .font-pixel {
          font-family: 'Press Start 2P', monospace !important;
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
        .glitch-sprite {
          animation: glitch 1.2s infinite linear alternate-reverse;
        }
        .shiny-glow {
          filter: drop-shadow(0 0 16px #ffe066) drop-shadow(0 0 32px #ffe066);
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
      `}</style>
    </div>
  );
}
