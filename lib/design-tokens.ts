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

export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - you can enhance this with proper color contrast algorithms
  const rgb = backgroundColor.match(/\d+/g);
  if (!rgb) return 'text-foreground';

  const [r, g, b] = rgb.map(Number);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? 'text-black' : 'text-white';
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
