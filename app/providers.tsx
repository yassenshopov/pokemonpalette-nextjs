'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { ColorProvider, useColors } from "@/contexts/color-context";
import { SaveProvider } from "@/contexts/save-context";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize with empty values, ColorProvider will update these
  const [colors, setColors] = useState<string[]>([]);
  const [pokemonName, setPokemonName] = useState<string>('');
  const [pokemonId, setPokemonId] = useState<number | undefined>(undefined);
  const [isShiny, setIsShiny] = useState<boolean>(false);

  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <ColorProvider>
          <ColorProviderListener 
            onColorsChange={setColors}
            onPokemonNameChange={setPokemonName}
            onPokemonIdChange={setPokemonId}
            onShinyChange={setIsShiny}
          />
          <SaveProvider 
            colors={colors} 
            pokemonName={pokemonName} 
            pokemonId={pokemonId}
            isShiny={isShiny}
          >
            {children}
            <Toaster />
          </SaveProvider>
        </ColorProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

// Helper component to listen for changes in the ColorProvider context
function ColorProviderListener({ 
  onColorsChange, 
  onPokemonNameChange,
  onPokemonIdChange,
  onShinyChange
}: { 
  onColorsChange: (colors: string[]) => void;
  onPokemonNameChange: (name: string) => void;
  onPokemonIdChange: (id: number | undefined) => void;
  onShinyChange: (isShiny: boolean) => void;
}) {
  const { colors, pokemonName, shiny } = useColors();
  
  useEffect(() => {
    onColorsChange(colors);
    onPokemonNameChange(pokemonName);
    onShinyChange(shiny);
    
    // We don't have direct access to pokemonNumber in the context
    // We'll extract it from the pokemonName if possible
    try {
      // For now, just provide undefined as pokemonId
      // In a real implementation, you might want to fetch this from another source
      onPokemonIdChange(undefined);
    } catch (error) {
      console.error("Error extracting Pokemon ID:", error);
      onPokemonIdChange(undefined);
    }
  }, [colors, pokemonName, shiny, onColorsChange, onPokemonNameChange, onPokemonIdChange, onShinyChange]);
  
  return null;
} 