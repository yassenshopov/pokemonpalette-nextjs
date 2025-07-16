'use client';

import { useEffect, useState, memo } from 'react';
import ColorThief from 'colorthief';
import { logColorExtraction } from '@/lib/logger';

interface PokemonColorExtractorProps {
  spriteUrl: string;
  onColorsExtracted: (colors: string[]) => void;
}

export const PokemonColorExtractor = memo(function PokemonColorExtractor({
  spriteUrl,
  onColorsExtracted,
}: PokemonColorExtractorProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const extractColors = async () => {
      if (!spriteUrl) return;

      setIsLoading(true);
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 3);
          const rgbColors = palette.map((rgb: number[]) => {
            const [r, g, b] = rgb;
            return `rgb(${r}, ${g}, ${b})`;
          });
          onColorsExtracted(rgbColors);
          logColorExtraction(spriteUrl, true, rgbColors);
        } catch (error) {
          const fallbackColors = ['rgb(255, 255, 255)', 'rgb(200, 200, 200)', 'rgb(150, 150, 150)'];
          logColorExtraction(spriteUrl, false, undefined, error as Error);
          // Fallback colors if extraction fails
          onColorsExtracted(fallbackColors);
        } finally {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        const fallbackColors = ['rgb(255, 255, 255)', 'rgb(200, 200, 200)', 'rgb(150, 150, 150)'];
        logColorExtraction(spriteUrl, false, undefined, new Error('Failed to load image'));
        // Fallback colors if image fails to load
        onColorsExtracted(fallbackColors);
        setIsLoading(false);
      };

      img.src = spriteUrl;
    };

    extractColors();
  }, [spriteUrl, onColorsExtracted]);

  return null; // This is a utility component, no UI needed
});
