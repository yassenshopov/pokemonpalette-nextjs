'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useCallback, useEffect } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  pokemonId?: number;
  retryCount?: number;
  onLoadError?: (error: Error, pokemonId?: number) => void;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  pokemonId,
  retryCount = 2,
  onLoadError,
  ...props
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retries, setRetries] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Default fallback for Pokemon images
  const defaultFallback = pokemonId
    ? `/images/pokemon/${pokemonId}.png`
    : '/images/misc/missingno.webp';

  const handleError = useCallback(() => {
    if (retries < retryCount) {
      // Retry with the same URL
      setRetries(prev => prev + 1);
      console.warn(`Image load failed for ${src}, retry ${retries + 1}/${retryCount}`);
    } else {
      // Use fallback
      const fallback = fallbackSrc || defaultFallback;
      setCurrentSrc(fallback);
      setHasError(true);

      const error = new Error(`Failed to load image: ${src}`);
      console.error('ImageWithFallback error:', error.message, {
        pokemonId,
        originalSrc: src,
        fallbackSrc: fallback,
      });

      if (onLoadError) {
        onLoadError(error, pokemonId);
      }
    }
  }, [src, retries, retryCount, fallbackSrc, defaultFallback, pokemonId, onLoadError]);

  // Reset state when src changes
  useEffect(() => {
    if (src !== currentSrc && !hasError) {
      setCurrentSrc(src);
      setRetries(0);
      setHasError(false);
    }
  }, [src, currentSrc, hasError]);

  return <Image {...props} src={currentSrc} alt={alt} onError={handleError} />;
}

// Utility function to extract Pokemon ID from URL
export function extractPokemonIdFromUrl(url: string): number | null {
  const match = url.match(/pokemon\/other\/official-artwork\/(\d+)\.png/);
  return match ? parseInt(match[1], 10) : null;
}

// Utility function to convert external URL to local path
export function getLocalPokemonPath(pokemonId: number): string {
  return `/images/pokemon/${pokemonId}.png`;
}

// Utility function to check if URL is external
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
