import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isPaletteSaved, savePalette } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';

interface SaveContextProps {
  isSaved: boolean;
  isSaving: boolean;
  savePaletteAction: (colors: string[], pokemonId?: number, pokemonName?: string, isShiny?: boolean) => void;
}

const SaveContext = createContext<SaveContextProps>({
  isSaved: false,
  isSaving: false,
  savePaletteAction: () => {},
});

export function SaveProvider({ 
  children, 
  colors = [], 
  pokemonId, 
  pokemonName,
  isShiny = false
}: { 
  children: ReactNode;
  colors: string[];
  pokemonId?: number;
  pokemonName?: string;
  isShiny?: boolean;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  // Check if palette is already saved when colors or user changes
  useEffect(() => {
    if (colors.length > 0) {
      const saved = isPaletteSaved(colors, pokemonId, user?.id || null, isShiny);
      setIsSaved(saved);
    } else {
      setIsSaved(false);
    }
  }, [colors, pokemonId, user?.id, isShiny]);

  // Function to handle saving palette
  const savePaletteAction = (colors: string[], pokemonId?: number, pokemonName?: string, isShiny?: boolean) => {
    if (colors.length === 0 || isSaving) return;
    
    setIsSaving(true);
    
    try {
      // Save the palette with user ID if available
      savePalette({
        name: pokemonName ? `${pokemonName}${isShiny ? ' ✨' : ''} Palette` : 'Custom Palette',
        colors,
        pokemonId,
        pokemonName,
        userId: user?.id || null,
        isShiny
      });
      
      // Update saved state
      setIsSaved(true);
      
      // Show success toast
      toast({
        title: "Palette saved",
        description: "Your palette has been saved to your device",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving palette:', error);
      toast({
        title: "Failed to save",
        description: "There was an error saving your palette",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  return (
    <SaveContext.Provider 
      value={{ 
        isSaved, 
        isSaving, 
        savePaletteAction: (colors, id, name, shiny) => 
          savePaletteAction(colors, id ?? pokemonId, name ?? pokemonName, shiny ?? isShiny) 
      }}
    >
      {children}
    </SaveContext.Provider>
  );
}

export const useSaveContext = () => useContext(SaveContext); 