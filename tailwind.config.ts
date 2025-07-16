import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Pokemon-specific color system
        pokemon: {
          type: {
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
          },
          rarity: {
            common: '#9E9E9E',
            uncommon: '#4CAF50',
            rare: '#2196F3',
            epic: '#9C27B0',
            legendary: '#FF9800',
            mythical: '#F44336',
          },
          status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
            neutral: '#6B7280',
          },
        },
      },
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
        '4xl': '6rem', // 96px
        '5xl': '8rem', // 128px
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'slide-in-from-top-full': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom-full': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out-to-right-full': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'pokeball-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pokemon-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        rotate: 'rotate 0.5s linear',
        in: 'fade-in 0.2s ease-out',
        out: 'fade-out 0.2s ease-in',
        'slide-in-from-top-full': 'slide-in-from-top-full 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-from-bottom-full':
          'slide-in-from-bottom-full 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-out-to-right-full': 'slide-out-to-right-full 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-out-80': 'fade-out 0.2s ease-in-out forwards 80%',
        'pokeball-spin': 'pokeball-spin 2s linear infinite',
        'pokemon-float': 'pokemon-float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      fontFamily: {
        sans: ['var(--font-geist)'],
        display: ['var(--font-cal)'],
        default: ['var(--font-geist)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
  // Performance optimizations
  corePlugins: {
    // Disable unused core plugins for better performance
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    placeholderOpacity: false,
    divideOpacity: false,
  },
  // Only include what we use
  safelist: [
    // Dynamic Pokemon type colors
    'bg-pokemon-type-normal',
    'bg-pokemon-type-fire',
    'bg-pokemon-type-water',
    'bg-pokemon-type-electric',
    'bg-pokemon-type-grass',
    'bg-pokemon-type-ice',
    'bg-pokemon-type-fighting',
    'bg-pokemon-type-poison',
    'bg-pokemon-type-ground',
    'bg-pokemon-type-flying',
    'bg-pokemon-type-psychic',
    'bg-pokemon-type-bug',
    'bg-pokemon-type-rock',
    'bg-pokemon-type-ghost',
    'bg-pokemon-type-dragon',
    'bg-pokemon-type-dark',
    'bg-pokemon-type-steel',
    'bg-pokemon-type-fairy',
    // Animation classes that are dynamically added
    'animate-pulse',
    'animate-spin',
    'animate-bounce',
    // Touch targets for mobile
    'touch-target',
    'mobile-spacing',
    'mobile-text',
  ],
} satisfies Config;
