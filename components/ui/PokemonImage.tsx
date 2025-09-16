'use client';

import { useState, useEffect } from 'react';

interface PokemonImageProps {
  pokemonId: number;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
  isShiny?: boolean;
  imageType?: 'sprite' | 'official-artwork';
  variant?: 'front' | 'back';
  isFemale?: boolean;
}

export function PokemonImage({
  pokemonId,
  alt,
  width = 180,
  height = 180,
  className = '',
  style = {},
  fallbackSrc = '/images/misc/missingno.webp',
  isShiny = false,
  imageType = 'sprite',
  variant = 'front',
  isFemale = false,
}: PokemonImageProps) {
  const [hasError, setHasError] = useState(false);

  const getImagePath = () => {
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

  const [currentSrc, setCurrentSrc] = useState(getImagePath());

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  useEffect(() => {
    const newPath = getImagePath();
    if (newPath !== currentSrc) {
      setCurrentSrc(newPath);
      setHasError(false);
    }
  }, [pokemonId, isShiny, imageType, variant, isFemale]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ ...style, imageRendering: 'pixelated' }}
      onError={handleError}
      loading="lazy"
    />
  );
}
