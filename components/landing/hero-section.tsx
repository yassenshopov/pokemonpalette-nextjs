import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Paintbrush, Palette, Bookmark, ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useSaveContext } from "@/contexts/save-context";
import { useColors } from "@/contexts/color-context";
import { PalettePickerDialog } from "@/components/palettes/palette-picker-dialog";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
  pokemonName: string;
  officialArt: string;
  colors?: string[]; // Make colors optional since they might not be available immediately
  pokemonNumber?: number;
}

function hexToRgb(hex: string) {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

export function HeroSection({ pokemonName, officialArt, colors = [], pokemonNumber }: HeroSectionProps) {
  const { isSaved, isSaving, savePaletteAction } = useSaveContext();
  const { shiny } = useColors();
  const { user } = useUser();
  const router = useRouter();
  const [palettePickerOpen, setPalettePickerOpen] = useState(false);

  // Use the first two colors from the palette, or fallback to neutral colors
  const primaryColor = colors[0] || 'rgb(209 213 219)';
  const secondaryColor = colors[1] || 'rgb(243 244 246)';
  
  // Function to handle saving palette
  const handleSavePalette = () => {
    savePaletteAction(colors, pokemonNumber, pokemonName, shiny);
  };
  
  // Function to handle "check" button click after saving
  const handleSavedClick = () => {
    if (isSaved) {
      // Open palette picker dialog when checkmark is clicked
      setPalettePickerOpen(true);
    } else {
      // Regular save action if not already saved
      handleSavePalette();
    }
  };
  
  // Function to handle selecting a palette
  const handlePaletteSelect = (palette: any) => {
    if (palette.pokemonName) {
      router.push(`/${palette.pokemonName.toLowerCase()}`);
    }
  };
  
  // Convert the primary color to RGB if it's a hex color
  let rgbColor;
  if (primaryColor.startsWith('#')) {
    rgbColor = hexToRgb(primaryColor);
  } else if (primaryColor.startsWith('rgb')) {
    // Parse RGB format
    const matches = primaryColor.match(/\d+/g);
    if (matches) {
      rgbColor = {
        r: parseInt(matches[0]),
        g: parseInt(matches[1]),
        b: parseInt(matches[2])
      };
    }
  }
  return (
    <div 
      className="relative overflow-hidden w-full"
      style={{
        margin: '-1px',
        padding: '1px'
      }}
    >
      {/* Directly control the palette picker dialog */}
      <PalettePickerDialog
        onSelectPalette={handlePaletteSelect}
        open={palettePickerOpen}
        onOpenChange={setPalettePickerOpen}
        trigger={<div className="hidden">Hidden Trigger</div>}
      />
      
      {/* Content container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-16 px-4 sm:px-6 md:px-16 mx-auto max-w-7xl pt-6 md:pt-0">
        {/* Left content section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-center md:text-left space-y-4 md:space-y-8"
        >
          <div 
            className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full border bg-background/50 backdrop-blur-sm mb-2 md:mb-4"
            style={{ borderColor: `${primaryColor}40` }}
          >
            <Paintbrush className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" style={{ color: primaryColor }} />
            <span className="text-xs md:text-sm font-medium">Color Palette Generator</span>
          </div>

          <div className="space-y-3 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Your website - inspired by{' '}
              <span 
                className="capitalize bg-clip-text text-transparent block mt-1 md:mt-2"
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                }}
              >
                {pokemonName || 'your Pokemon'}
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-[700px] leading-relaxed">
              Create beautiful color palettes inspired by your favorite Pokemon. Just enter any Pokemon's name 
              or Pokedex number to discover its unique color scheme.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start pt-2 md:pt-4">
            <SignedIn>
              <Button 
                size="lg" 
                className="gap-2 h-10 md:h-12 px-6 md:px-8 text-sm md:text-base"
                style={{ 
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  color: '#fff'
                }}
                onClick={handleSavedClick}
                disabled={isSaving || colors.length === 0}
              >
                {isSaving || isSaved ? (
                  <>
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
                    Save Palette
                  </>
                )}
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="gap-2 h-10 md:h-12 px-6 md:px-8 text-sm md:text-base"
                  style={{ 
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    color: '#fff'
                  }}
                >
                  <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
                  Save Palette
                </Button>
              </SignInButton>
            </SignedOut>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 h-10 md:h-12 px-6 md:px-8 text-sm md:text-base"
              style={{ borderColor: `${primaryColor}40` }}
              onClick={() => {
                const element = document.getElementById('pokemon-info');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Learn more <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Right image section */}
        {officialArt && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center md:justify-end mt-4 md:mt-0"
          >
            <div 
              className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] overflow-hidden"
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom right, ${primaryColor}20, transparent)`
                }}
              />
              <Image
                src={officialArt}
                alt={pokemonName}
                fill
                className="object-contain p-6 sm:p-8 md:p-12 transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 