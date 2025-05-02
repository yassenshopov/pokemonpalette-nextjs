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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { TypeBadge } from '@/components/type-badge';
import { GameBackground } from '@/components/game-background';
import '../styles/game-animations.css';
import Link from "next/link";
import Image from "next/image";

type HintType = 'first-letter' | 'generation' | 'type' | 'size' | 'pokedex' | 'name-length' | 'common-substring';

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

    return new Promise((resolve) => {
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
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
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
        ? data.sprites.other['official-artwork'].front_shiny || data.sprites.other['official-artwork'].front_default
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
        isShiny
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

    console.log("Attempting guess:", {
      original: currentGuess,
      normalized: normalizedGuess,
      target: targetPokemon
    });

    // First validate if it's a valid Pokemon name
    const guessId = PokemonService.getSpeciesId(normalizedGuess);
    console.log("Pokemon ID lookup:", {
      name: normalizedGuess,
      id: guessId,
      speciesData: (speciesData as Record<string, number>)[normalizedGuess]
    });

    if (!guessId) {
      // Get a slice of Pokemon names around where this guess would be alphabetically
      const allNames = Object.keys(speciesData).sort();
      const guessIndex = allNames.findIndex(name => name > normalizedGuess);
      const start = Math.max(0, guessIndex - 2);
      const nearbyNames = allNames.slice(start, start + 5);

      console.log("Invalid Pokemon name detected:", {
        input: currentGuess,
        normalized: normalizedGuess,
        nearbyNames: nearbyNames,
        validExample: "Try Pokemon like: " + nearbyNames.join(", ")
      });

      setGameState(prev => ({
        ...prev,
        guessHistory: [...prev.guessHistory, { name: currentGuess, sprite: '', types: [], generation: 0 }],
        hints: [...prev.hints, "Invalid Pokemon name"],
        remainingGuesses: prev.remainingGuesses - 1
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
        generation: getGeneration(guessData.id)
      };

      const newGameState = { ...gameState };
      newGameState.guessHistory.push(guessInfo);

      // Only decrease remaining guesses if it's not correct
      if (normalizedGuess === normalizedTarget) {
        console.log("Correct guess!");
        newGameState.gameStatus = 'won';
        setShowWinDialog(true);
        // Add victory celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors // Use the Pokemon's color palette!
        });
        
        // Fire multiple bursts for more impact
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });
        }, 250);
      } else {
        newGameState.remainingGuesses--;
        if (newGameState.remainingGuesses === 0) {
          console.log("Game over - no more guesses");
          newGameState.gameStatus = 'lost';
          setShowLossDialog(true);
        } else {
          try {
            console.log("Generating hint for:", {
              guess: normalizedGuess,
              guessId: guessId,
              target: normalizedTarget,
              targetData: targetPokemonData
            });

            const hint = await generateHint(normalizedGuess, normalizedTarget);
            console.log("Generated hint:", hint);
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
    if (!targetPokemonData) return "Loading hint...";

    try {
      const guessData = await PokemonService.fetchPokemon(guess);
      
      // Validate the required data exists
      if (!guessData || !guessData.types || !guessData.id) {
        return "Error: Invalid Pokemon data";
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
          return `Pokedex difference: ${difference} (${targetPokemonData.id > guessData.id ? 'higher' : 'lower'})`;
      }
      
    } catch (error) {
      console.error('Error in generateHint:', error);
      return "Error generating hint";
    }
  };

  // Add toggle function
  const toggleGameMode = () => {
    setGameState(prev => ({
      ...prev,
      gameMode: prev.gameMode === 'unlimited' ? 'daily' : 'unlimited'
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
      isShiny: prev.isShiny
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
    <div className="min-h-screen flex flex-col">
      <GameBackground colors={colors} />
      
      <header className="w-full bg-card/80 fixed top-0 left-0 z-50 border-b game-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <div>
              <Image 
                src="/logo512.png" 
                alt="Pokemon Palette Logo" 
                width={32}
                height={32}
                className={`w-8 h-8 pokemon-float ${isRotating ? 'animate-rotate' : ''}`}
                style={{
                  filter: `hue-rotate(${
                    colors.length > 0 ? getHueFromColor(colors[0]) : 0
                  }deg)`,
                }}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display leading-tight">
                Pokemon Palette
                <span className="block text-xs text-muted-foreground -mt-1">
                  Guesser {gameState.isShiny ? '✨' : ''}
                </span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8">
              <Link href="/">Home</Link>
            </Button>
            <Tabs 
              value={gameState.gameMode} 
              onValueChange={toggleGameMode}
              className="h-8"
            >
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="daily" className="text-xs px-3">📅 Daily</TabsTrigger>
                <TabsTrigger value="unlimited" className="text-xs px-3">🎲 Unlimited</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="h-8">
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
        {/* Pokemon Sprite Display */}
        <div className="max-w-[460px] sm:max-w-[200px] relative p-4 mb-4">
          {gameState.gameStatus !== 'playing' && (
            <div className="pokemon-sprite-container">
              <Image
                src={pokemonSprite}
                alt="Pokemon"
                width={200}
                height={200}
                className={`w-full h-full object-contain animate-fade-in ${
                  gameState.isShiny ? 'shiny-effect' : ''
                }`}
              />
            </div>
          )}
        </div>

        {/* Color Display */}
        <div className="w-full max-w-[280px] sm:max-w-md mb-8">
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg shadow-lg pokemon-card"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Hearts and Guesses Display */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className={`text-2xl transition-transform hover:scale-110 ${
                i < gameState.remainingGuesses ? "animate-bounce" : ""
              }`}>
                {i < gameState.remainingGuesses ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
        </div>

        {/* Updated Guess Input */}
        {gameState.gameStatus === 'playing' && (
          <div className="w-full max-w-[280px] sm:max-w-md mb-6">
            <div className="flex gap-2">
              <PokemonSearch
                onSelect={(name) => {
                  setCurrentGuess(name);
                  handleGuess();
                }}
                className="flex-1 glass-effect"
                placeholder="Enter Pokemon name..."
                disabled={isGuessing}
                disabledOptions={gameState.guessHistory.map(g => g.name)}
                isShiny={gameState.isShiny}
              />
              <Button 
                onClick={handleGuess}
                className="px-4"
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

        {/* Hints and History */}
        <div className="w-full max-w-[280px] sm:max-w-md space-y-2 sm:space-y-4">
          {gameState.hints.map((hint, index) => {
            const guess = gameState.guessHistory[index];
            return (
              <Card key={index} className="pokemon-card overflow-hidden">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Image 
                      src={guess.sprite} 
                      alt={guess.name} 
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium capitalize text-foreground">
                        {guess.name}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guess.types.map((type) => {
                          const isMatch = targetPokemonData?.types.some(t => t.type.name === type);
                          return (
                            <TypeBadge 
                              key={type} 
                              type={type as any}
                              isMatch={isMatch}
                            />
                          );
                        })}
                        <TypeBadge 
                          type="normal"
                          className={`${
                            getGeneration(targetPokemonData?.id || 0) === guess.generation
                              ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          Gen {guess.generation}
                        </TypeBadge>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {hint}
                  </p>
                </CardContent>
              </Card>
            )}
          )}
        </div>

        {/* Game Over States */}
        {gameState.gameStatus !== 'playing' && (
          <>
            <Dialog open={showLossDialog} onOpenChange={(open: boolean) => setShowLossDialog(open)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center mb-2">
                    💔 Game Over! 💔
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    <div className="mb-4">
                      {gameState.gameMode === 'daily' ? (
                        <>Come back tomorrow to try again! The Pokemon was</>
                      ) : (
                        <>Better luck next time! The Pokemon was</>
                      )}{' '}
                      <span className="font-bold capitalize">
                        {targetPokemon.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className="w-full max-w-[200px] mx-auto mb-4">
                      <div className="pokemon-sprite-container">
                        <Image
                          src={pokemonSprite}
                          alt={targetPokemon}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain grayscale opacity-80"
                        />
                      </div>
                    </div>
                    <div className="text-sm opacity-75">
                      {gameState.gameMode === 'daily' ? (
                        <>A new Pokemon will be available in 24 hours!</>
                      ) : (
                        <>You ran out of guesses! Try again with a new Pokemon.</>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={handlePlayAgain}
                    className="px-8 py-2"
                  >
                    {gameState.gameMode === 'unlimited' ? 'Play Again' : 'Back to Home'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showWinDialog} onOpenChange={(open: boolean) => setShowWinDialog(open)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center mb-2">
                    🎉 Congratulations! 🎉
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    <div className="mb-4">
                      {gameState.gameMode === 'daily' ? (
                        <>You solved today's {gameState.isShiny ? 'Shiny ' : ''}Pokemon! It was</>
                      ) : (
                        <>You caught the {gameState.isShiny ? 'Shiny ' : ''}Pokemon! It was</>
                      )}{' '}
                      <span className="font-bold capitalize">
                        {targetPokemon.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className="w-full max-w-[200px] mx-auto mb-4">
                      <div className="pokemon-sprite-container">
                        <Image
                          src={pokemonSprite}
                          alt={targetPokemon}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain pokemon-float"
                        />
                      </div>
                    </div>
                    <div className="text-sm opacity-75">
                      You got it in {4 - gameState.remainingGuesses + 1} {4 - gameState.remainingGuesses + 1 === 1 ? 'try' : 'tries'}!
                      {gameState.gameMode === 'daily' && (
                        <><br />Come back tomorrow for a new Pokemon!</>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-2 mt-4">
                  <Button 
                    onClick={handlePlayAgain}
                    className="px-8 py-2"
                  >
                    {gameState.gameMode === 'unlimited' ? 'Play Again' : 'Back to Home'}
                  </Button>
                  {gameState.gameMode === 'daily' && (
                    <Button 
                      onClick={() => {
                        setShowWinDialog(false);
                        setGameState({
                          remainingGuesses: 4,
                          gameStatus: 'playing',
                          guessHistory: [],
                          hints: [],
                          usedHintTypes: [],
                          gameMode: 'unlimited',
                          isShiny: false
                        });
                        initGame('unlimited');
                      }}
                      variant="secondary"
                      className="px-8 py-2"
                    >
                      Try Unlimited
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>
    </div>
  );
} 