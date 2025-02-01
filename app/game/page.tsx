'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import speciesData from '@/data/species.json';
import { useColors } from '@/contexts/color-context';
import ColorThief from 'colorthief';
import { PokemonSearch } from '@/components/pokemon-search';
import { LoadingPokeball } from '@/components/loading-pokeball';
import { Heart, HeartCrack } from "lucide-react";
import confetti from 'canvas-confetti';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


type HintType = 'first-letter' | 'generation' | 'type' | 'size' | 'pokedex' | 'name-length' | 'common-substring';

interface GameState {
  remainingGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
  guessHistory: string[];
  hints: string[];
  usedHintTypes: HintType[];
  gameMode: 'daily' | 'unlimited';
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
  });
  const { colors, setColors } = useColors();
  const [pokemonSprite, setPokemonSprite] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [targetPokemonData, setTargetPokemonData] = useState<PokemonData | null>(null);
  const [isGuessing, setIsGuessing] = useState(false);
  const [showLossDialog, setShowLossDialog] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);

  // Helper function to get a random Pokemon
  const getRandomPokemon = () => {
    const pokemonNames = Object.keys(speciesData);
    const randomIndex = Math.floor(Math.random() * pokemonNames.length);
    return pokemonNames[randomIndex];
  };

  // Add color extraction function
  const extractColors = async (imageUrl: string) => {
    const img = new Image();
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
    
    try {
      const data = await PokemonService.fetchPokemon(randomPokemon);
      setTargetPokemonData(data);
      const spriteUrl = data.sprites.other['official-artwork'].front_default;
      setPokemonSprite(spriteUrl);
      
      if (spriteUrl) {
        const colors = await extractColors(spriteUrl);
        setColors(colors as string[]);
      }
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
        guessHistory: [...prev.guessHistory, currentGuess],
        hints: [...prev.hints, "Invalid Pokemon name"],
        remainingGuesses: prev.remainingGuesses - 1
      }));
      setCurrentGuess('');
      setIsLoading(false);
      setIsGuessing(false);
      return;
    }

    const newGameState = { ...gameState };
    newGameState.guessHistory.push(currentGuess);

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
      gameMode: prev.gameMode
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingPokeball />
        <p className="mt-4 text-lg animate-pulse">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="absolute top-4 right-4 flex gap-2">
        <Tabs 
          value={gameState.gameMode} 
          onValueChange={(value: 'daily' | 'unlimited') => {
            toggleGameMode();
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">📅 Daily</TabsTrigger>
            <TabsTrigger value="unlimited">🎲 Unlimited</TabsTrigger>
          </TabsList>
        </Tabs>
        <ThemeToggle />
      </div>

      <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-center font-display">
        Pokemon Palette Guesser
      </h1>
      
      {/* Pokemon Sprite Display */}
      <div className="max-w-[460px] sm:max-w-[200px] relative p-4 mb-4">
        {gameState.gameStatus !== 'playing' && (
          <div className="relative aspect-square">
            <img
              src={pokemonSprite}
              alt="Pokemon"
              className="w-full h-full object-contain animate-fade-in"
            />
          </div>
        )}
      </div>

      {/* Color Display - Made squares larger */}
      <div className="w-full max-w-[280px] sm:max-w-md mb-8">
        <div className="grid grid-cols-3 gap-3">
          {colors.map((color, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Hearts and Guesses Display */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-2xl">
              {i < gameState.remainingGuesses ? "❤️" : "🖤"}
            </span>
          ))}
        </div>
        {gameState.gameStatus === 'won' ? (
          <p className="text-green-500">You won!</p>
        ) : (
          <p>{gameState.remainingGuesses} guesses remaining</p>
        )}
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
              className="flex-1"
              placeholder="Enter Pokemon name..."
              disabled={isGuessing}
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
        {gameState.hints.map((hint, index) => (
          <Card key={index}>
            <CardContent className="p-3 sm:p-4">
              <p className="text-sm sm:text-base font-medium capitalize">
                Guess {index + 1}: {gameState.guessHistory[index]}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {hint}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game Over States */}
      {gameState.gameStatus !== 'playing' && (
        <>
          <Dialog open={showLossDialog} onOpenChange={setShowLossDialog}>
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
                    <img
                      src={pokemonSprite}
                      alt={targetPokemon}
                      className="w-full h-full object-contain grayscale opacity-80"
                    />
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

          <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center mb-2">
                  🎉 Congratulations! 🎉
                </DialogTitle>
                <DialogDescription className="text-center">
                  <div className="mb-4">
                    {gameState.gameMode === 'daily' ? (
                      <>You solved today's Pokemon! It was</>
                    ) : (
                      <>You caught the Pokemon! It was</>
                    )}{' '}
                    <span className="font-bold capitalize">
                      {targetPokemon.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <div className="w-full max-w-[200px] mx-auto mb-4">
                    <img
                      src={pokemonSprite}
                      alt={targetPokemon}
                      className="w-full h-full object-contain animate-bounce"
                    />
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
                        gameMode: 'unlimited'
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
    </div>
  );
} 