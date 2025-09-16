'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useCallback, useEffect } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  pokemonId?: number;
  retryCount?: number;
  onLoadError?: (error: Error, pokemonId?: number) => void;
  imageType?: 'sprite' | 'official-artwork';
  variant?: 'front' | 'back';
  isShiny?: boolean;
  isFemale?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  pokemonId,
  retryCount = 2,
  onLoadError,
  imageType = 'sprite',
  variant = 'front',
  isShiny = false,
  isFemale = false,
  ...props
}: ImageWithFallbackProps) {
  // Build local fallback path based on image type and variants
  const getLocalFallbackPath = () => {
    if (!pokemonId) return '/images/misc/missingno.webp';

    // Handle forms (IDs > 10000)
    if (pokemonId > 10000) {
      return `/images/pokemon/forms/${pokemonId}.png`;
    }

    // Handle official artwork
    if (imageType === 'official-artwork') {
      return isShiny
        ? `/images/pokemon/official-artwork/shiny/${pokemonId}.png`
        : `/images/pokemon/official-artwork/${pokemonId}.png`;
    }

    // Handle sprites with all variants
    const basePath = `/images/pokemon/${variant}`;
    const parts = [basePath];

    if (isShiny) parts.push('shiny');
    if (isFemale) parts.push('female');

    return `${parts.join('/')}/${pokemonId}.png`;
  };

  // Default fallback for Pokemon images
  const defaultFallback = getLocalFallbackPath();

  // For Pokemon images, ALWAYS use local cache when pokemonId is provided
  const shouldUseLocalFirst = pokemonId !== undefined;
  const localPath = pokemonId ? getLocalFallbackPath() : null;

  const [currentSrc, setCurrentSrc] = useState(shouldUseLocalFirst && localPath ? localPath : src);
  const [retries, setRetries] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [triedLocal, setTriedLocal] = useState(false);

  const handleError = useCallback(() => {
    // If we haven't tried the external URL yet and we're using a local path
    if (!triedLocal && shouldUseLocalFirst && localPath && currentSrc === localPath) {
      setTriedLocal(true);
      setCurrentSrc(src); // Try the external URL
      setRetries(0);
      return;
    }

    if (retries < retryCount) {
      // Retry with the same URL
      setRetries(prev => prev + 1);
      console.warn(`Image load failed for ${currentSrc}, retry ${retries + 1}/${retryCount}`);
    } else {
      // Use fallback
      const fallback = fallbackSrc || defaultFallback;
      setCurrentSrc(fallback);
      setHasError(true);

      const error = new Error(`Failed to load image: ${currentSrc}`);
      console.error('ImageWithFallback error:', error.message, {
        pokemonId,
        originalSrc: src,
        currentSrc,
        fallbackSrc: fallback,
        triedLocal,
      });

      if (onLoadError) {
        onLoadError(error, pokemonId);
      }
    }
  }, [
    currentSrc,
    retries,
    retryCount,
    fallbackSrc,
    defaultFallback,
    pokemonId,
    onLoadError,
    src,
    triedLocal,
    shouldUseLocalFirst,
    localPath,
  ]);

  // Reset state when src changes
  useEffect(() => {
    const newSrc = shouldUseLocalFirst && localPath ? localPath : src;
    if (newSrc !== currentSrc) {
      setCurrentSrc(newSrc);
      setRetries(0);
      setHasError(false);
      setTriedLocal(false);
    }
  }, [src, currentSrc, shouldUseLocalFirst, localPath]);

  // Use unoptimized for local Pokemon images to avoid Vercel transformations
  const isLocalImage = typeof currentSrc === 'string' && currentSrc.startsWith('/images/pokemon/');

  return (
    <Image {...props} src={currentSrc} alt={alt} onError={handleError} unoptimized={isLocalImage} />
  );
}

// Utility function to check if URL is external
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

// Utility function to convert external URL to local path
export function getLocalPokemonPath(
  pokemonId: number,
  imageType: 'sprite' | 'official-artwork' = 'sprite',
  variant: 'front' | 'back' = 'front',
  isShiny = false,
  isFemale = false
): string {
  // Handle forms (IDs > 10000)
  if (pokemonId > 10000) {
    return `/images/pokemon/forms/${pokemonId}.png`;
  }

  // Handle official artwork
  if (imageType === 'official-artwork') {
    return isShiny
      ? `/images/pokemon/official-artwork/shiny/${pokemonId}.png`
      : `/images/pokemon/official-artwork/${pokemonId}.png`;
  }

  // Handle sprites with all variants
  const basePath = `/images/pokemon/${variant}`;
  const parts = [basePath];

  if (isShiny) parts.push('shiny');
  if (isFemale) parts.push('female');

  return `${parts.join('/')}/${pokemonId}.png`;
}
