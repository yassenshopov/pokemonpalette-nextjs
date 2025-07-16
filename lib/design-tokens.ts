// Design tokens for consistent styling across the Pokemon Palette app

export const pokemonTypeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
} as const;

export const gradients = {
  // Pokemon type gradients
  fire: 'from-orange-500 to-red-600',
  water: 'from-blue-500 to-cyan-600',
  grass: 'from-green-500 to-emerald-600',
  electric: 'from-yellow-400 to-yellow-600',
  psychic: 'from-pink-500 to-purple-600',
  ice: 'from-cyan-300 to-blue-400',
  dragon: 'from-indigo-600 to-purple-700',
  dark: 'from-gray-700 to-gray-900',
  fighting: 'from-red-600 to-red-800',
  poison: 'from-purple-500 to-purple-700',
  ground: 'from-yellow-600 to-orange-500',
  flying: 'from-indigo-400 to-sky-500',
  bug: 'from-lime-500 to-green-600',
  rock: 'from-stone-500 to-stone-700',
  ghost: 'from-purple-600 to-indigo-700',
  steel: 'from-slate-400 to-slate-600',
  fairy: 'from-pink-400 to-rose-500',
  normal: 'from-stone-400 to-stone-600',

  // UI gradients
  primary: 'from-primary/10 via-primary/5 to-transparent',
  secondary: 'from-secondary/10 via-secondary/5 to-transparent',
  hero: 'from-primary/5 via-background to-secondary/5',
  card: 'from-card via-card to-card/80',
  danger: 'from-red-500 to-red-700',
  success: 'from-green-500 to-green-700',
  warning: 'from-yellow-500 to-orange-600',
  info: 'from-blue-500 to-blue-700',
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
  '5xl': '8rem', // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 20px rgb(var(--primary) / 0.3)',
  pokemon: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
} as const;

export const transitions = {
  fast: '0.15s ease-out',
  normal: '0.2s ease-out',
  slow: '0.3s ease-out',
  bounce: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: '0.3s cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Utility functions for consistent styling
export const getTypeColor = (type: string): string => {
  return pokemonTypeColors[type as keyof typeof pokemonTypeColors] || pokemonTypeColors.normal;
};

export const getTypeGradient = (type: string): string => {
  return gradients[type as keyof typeof gradients] || gradients.normal;
};

// Convert color to RGB values for contrast calculation
function parseColor(color: string): { r: number; g: number; b: number } | null {
  try {
    // Handle hex colors (#fff, #ffffff)
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return { r, g, b };
      } else if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b };
      }
    }

    // Handle rgb/rgba colors (rgb(255, 255, 255) or rgba(255, 255, 255, 0.5))
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return { r, g, b };
    }

    // Handle hsl/hsla colors (hsl(0, 100%, 50%) or hsla(0, 100%, 50%, 0.5))
    const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]) / 360;
      const s = parseInt(hslMatch[2]) / 100;
      const l = parseInt(hslMatch[3]) / 100;

      // Convert HSL to RGB
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
      const g = Math.round(hue2rgb(p, q, h) * 255);
      const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
      return { r, g, b };
    }

    return null;
  } catch {
    return null;
  }
}

// Calculate relative luminance using WCAG algorithm
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio using WCAG algorithm
function getContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const getContrastTextClass = (backgroundColor: string): string => {
  try {
    // Parse the background color
    const rgb = parseColor(backgroundColor);
    if (!rgb) {
      console.warn(`Invalid color format: ${backgroundColor}. Using fallback.`);
      return 'text-foreground';
    }

    // Calculate background luminance
    const bgLuminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);

    // Define white and black luminances
    const whiteLuminance = 1.0; // Pure white
    const blackLuminance = 0.0; // Pure black

    // Calculate contrast ratios
    const whiteContrast = getContrastRatio(bgLuminance, whiteLuminance);
    const blackContrast = getContrastRatio(bgLuminance, blackLuminance);

    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    // We'll use 3:1 as our threshold for better readability
    const threshold = 3.0;

    // Choose the color with better contrast
    if (whiteContrast >= threshold && whiteContrast > blackContrast) {
      return 'text-white';
    } else if (blackContrast >= threshold) {
      return 'text-black';
    } else {
      // If neither meets the threshold, choose the one with better contrast
      return whiteContrast > blackContrast ? 'text-white' : 'text-black';
    }
  } catch (error) {
    console.error('Error calculating contrast for color:', backgroundColor, error);
    return 'text-foreground';
  }
};

// Common component class combinations
export const componentClasses = {
  card: 'bg-card border border-border rounded-lg shadow-sm',
  cardHover: 'hover:shadow-md transition-shadow duration-200',
  button:
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  badge: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  spinner: 'animate-spin rounded-full border-2 border-current border-t-transparent',
  loadingCard: 'animate-pulse bg-muted rounded-lg',
  gradientText: 'bg-gradient-to-r bg-clip-text text-transparent',
  pokemonSprite: 'pixelated transition-transform hover:scale-110',
  glassmorphism: 'backdrop-blur-sm bg-white/10 border border-white/20',
} as const;

// Animation presets
export const animations = {
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
  slideDown: 'animate-in slide-in-from-top-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  pokemonFloat: 'animate-pokemon-float',
  pokeballSpin: 'animate-pokeball-spin',
  shimmer: 'animate-shimmer',
} as const;

export type PokemonType = keyof typeof pokemonTypeColors;
export type GradientType = keyof typeof gradients;
export type SpacingSize = keyof typeof spacing;
