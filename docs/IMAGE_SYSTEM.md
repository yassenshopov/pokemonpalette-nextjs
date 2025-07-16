# Pokemon Image System

This document describes the robust image loading system implemented for Pokemon images in the Pokemon Palette application.

## Overview

The application uses a custom `ImageWithFallback` component that extends Next.js Image with error handling and fallback functionality to ensure reliable image loading.

## Components

### ImageWithFallback

Located at `components/ui/ImageWithFallback.tsx`, this component provides:

- **Automatic retry logic**: Attempts to reload failed images up to 2 times
- **Fallback handling**: Falls back to local cached images or placeholder
- **Error logging**: Logs warnings and errors for debugging
- **Pokemon ID support**: Automatically handles Pokemon-specific fallbacks

#### Usage

```tsx
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

// Basic usage with Pokemon ID
<ImageWithFallback
  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  alt="Pikachu"
  width={60}
  height={60}
  pokemonId={25}
/>

// With custom fallback
<ImageWithFallback
  src="https://external-url.com/image.png"
  alt="Custom image"
  width={100}
  height={100}
  fallbackSrc="/images/custom-fallback.png"
  retryCount={3}
  onLoadError={(error, pokemonId) => {
    console.error('Image load failed:', error);
  }}
/>
```

#### Props

- `src`: Primary image source URL
- `alt`: Alt text for accessibility
- `pokemonId`: Pokemon ID for automatic fallback to local cache
- `fallbackSrc`: Custom fallback image path
- `retryCount`: Number of retry attempts (default: 2)
- `onLoadError`: Callback function for error handling
- All standard Next.js Image props

## Local Image Cache

### Directory Structure

```
public/
  images/
    pokemon/
      3.png    # Venusaur
      4.png    # Charmander
      5.png    # Charmeleon
      6.png    # Charizard
      9.png    # Blastoise
      25.png   # Pikachu
      94.png   # Gengar
      197.png  # Umbreon
      658.png  # Greninja
      1007.png # Koraidon
      1008.png # Miraidon
    misc/
      missingno.webp  # Default placeholder
```

### Download Script

Use the provided script to download and cache Pokemon images:

```bash
npm run download-pokemon
```

This script:

- Downloads official artwork from PokeAPI
- Caches images locally in `public/images/pokemon/`
- Skips existing files
- Provides detailed progress and error reporting

## Fallback Strategy

1. **Primary**: External URL (e.g., PokeAPI)
2. **Retry**: Same URL up to 2 times
3. **Local Cache**: `/images/pokemon/{id}.png`
4. **Default**: `/images/misc/missingno.webp`

## Error Handling

The system provides comprehensive error handling:

- **Console warnings** for retry attempts
- **Console errors** for final failures
- **Custom error callbacks** for application-specific handling
- **Graceful degradation** with fallback images

## Performance Benefits

- **Reduced external dependencies**: Local cache reduces reliance on external services
- **Faster loading**: Local images load faster than external URLs
- **Better reliability**: Fallback system ensures images always display
- **Improved caching**: Local images benefit from browser and CDN caching

## Migration Guide

### From Direct Image Usage

**Before:**

```tsx
import Image from 'next/image';

<Image
  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  alt="Pikachu"
  width={60}
  height={60}
/>;
```

**After:**

```tsx
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

<ImageWithFallback
  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  alt="Pikachu"
  width={60}
  height={60}
  pokemonId={25}
/>;
```

## Best Practices

1. **Always provide `pokemonId`** for Pokemon images to enable automatic fallback
2. **Use descriptive alt text** for accessibility
3. **Monitor console logs** for image loading issues
4. **Run download script regularly** to keep local cache updated
5. **Consider CDN integration** for production environments

## Future Enhancements

- [ ] CDN integration for better global performance
- [ ] Image optimization and compression
- [ ] Progressive loading with blur placeholders
- [ ] WebP format support for better compression
- [ ] Automated image updates via GitHub Actions
