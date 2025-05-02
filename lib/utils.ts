import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define Palette interface
export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  pokemonId?: number;
  pokemonName?: string;
  userId?: string | null;
  isShiny?: boolean;
  createdAt: string;
}

// Function to save a palette to localStorage
export function savePalette(palette: Omit<SavedPalette, 'id' | 'createdAt'>) {
  // Get existing palettes
  const existingPalettes = getPalettes();
  
  // Check if this palette already exists (same colors and Pokemon)
  const isDuplicate = existingPalettes.some(existing => 
    // Check if same Pokemon
    existing.pokemonId === palette.pokemonId &&
    // Check if same colors (all colors match in same order)
    existing.colors.length === palette.colors.length &&
    existing.colors.every((color, index) => color === palette.colors[index]) &&
    // Check if same user
    existing.userId === palette.userId
  );
  
  // If duplicate, return the existing palette without adding a new one
  if (isDuplicate) {
    return existingPalettes.find(existing => 
      existing.pokemonId === palette.pokemonId &&
      existing.colors.length === palette.colors.length &&
      existing.colors.every((color, index) => color === palette.colors[index]) &&
      existing.userId === palette.userId
    );
  }
  
  // Create new palette with ID and timestamp
  const newPalette: SavedPalette = {
    ...palette,
    id: crypto.randomUUID(), // Generate unique ID
    createdAt: new Date().toISOString(),
  };
  
  // Add to existing palettes
  existingPalettes.push(newPalette);
  
  // Save to localStorage
  localStorage.setItem('savedPalettes', JSON.stringify(existingPalettes));
  
  return newPalette;
}

// Function to check if a palette already exists
export function isPaletteSaved(colors: string[], pokemonId?: number, userId?: string | null, isShiny?: boolean): boolean {
  const existingPalettes = getPalettes();
  
  return existingPalettes.some(existing => 
    // Check if same Pokemon (if pokemonId is provided)
    (pokemonId ? existing.pokemonId === pokemonId : true) &&
    // Check if same colors (all colors match in same order)
    existing.colors.length === colors.length &&
    existing.colors.every((color, index) => color === colors[index]) &&
    // Check if same user (if userId is provided)
    existing.userId === userId &&
    // Check if same shiny state
    existing.isShiny === isShiny
  );
}

// Function to get all palettes from localStorage
export function getPalettes(): SavedPalette[] {
  if (typeof window === 'undefined') return [];
  
  const palettesJson = localStorage.getItem('savedPalettes');
  if (!palettesJson) return [];
  
  try {
    return JSON.parse(palettesJson);
  } catch (e) {
    return [];
  }
}

// Function to get user-specific palettes
export function getUserPalettes(userId: string | null): SavedPalette[] {
  const allPalettes = getPalettes();
  
  if (!userId) return allPalettes.filter(p => !p.userId);
  
  return allPalettes.filter(p => p.userId === userId);
}

// Function to delete a palette
export function deletePalette(paletteId: string): boolean {
  const palettes = getPalettes();
  const filteredPalettes = palettes.filter(p => p.id !== paletteId);
  
  if (filteredPalettes.length < palettes.length) {
    localStorage.setItem('savedPalettes', JSON.stringify(filteredPalettes));
    return true;
  }
  
  return false;
}
