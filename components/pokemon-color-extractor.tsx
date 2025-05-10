'use client';

import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

interface PokemonColorExtractorProps {
  spriteUrl: string;
  onColorsExtracted: (colors: string[]) => void;
}

export function PokemonColorExtractor({
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
        } catch (error) {
          console.error('Error extracting colors:', error);
          // Fallback colors if extraction fails
          onColorsExtracted(['rgb(255, 255, 255)', 'rgb(200, 200, 200)', 'rgb(150, 150, 150)']);
        } finally {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error('Error loading image for color extraction');
        // Fallback colors if image fails to load
        onColorsExtracted(['rgb(255, 255, 255)', 'rgb(200, 200, 200)', 'rgb(150, 150, 150)']);
        setIsLoading(false);
      };

      img.src = spriteUrl;
    };

    extractColors();
  }, [spriteUrl, onColorsExtracted]);

  return null; // This is a utility component, no UI needed
}
