// Accessibility utilities for Pokemon Palette app

import { PokemonTypeNames } from '@/types/pokemon';

// Keyboard event helpers
export const isEnterKey = (event: KeyboardEvent | React.KeyboardEvent): boolean => {
  return event.key === 'Enter' || event.keyCode === 13;
};

export const isSpaceKey = (event: KeyboardEvent | React.KeyboardEvent): boolean => {
  return event.key === ' ' || event.keyCode === 32;
};

export const isEscapeKey = (event: KeyboardEvent | React.KeyboardEvent): boolean => {
  return event.key === 'Escape' || event.keyCode === 27;
};

export const isArrowKey = (event: KeyboardEvent | React.KeyboardEvent): boolean => {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key);
};

export const isActivationKey = (event: KeyboardEvent | React.KeyboardEvent): boolean => {
  return isEnterKey(event) || isSpaceKey(event);
};

// Focus management utilities
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    'area[href]',
    'iframe',
    'object',
    'embed',
    '[tabindex]',
    '[contenteditable]',
  ].join(', ');

  const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];

  return elements.filter(element => {
    const isDisabled = 'disabled' in element ? (element as HTMLInputElement).disabled : false;
    return (
      !isDisabled && !element.hidden && element.tabIndex !== -1 && element.offsetParent !== null // Element is visible
    );
  });
};

export const trapFocus = (container: HTMLElement, event: KeyboardEvent): void => {
  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
};

export const restoreFocus = (element: HTMLElement | null): void => {
  if (element && typeof element.focus === 'function') {
    // Use setTimeout to ensure the element is ready to receive focus
    setTimeout(() => {
      element.focus();
    }, 0);
  }
};

// ARIA utilities
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getAriaLabelForPokemonType = (type: PokemonTypeNames): string => {
  const typeDescriptions: Record<PokemonTypeNames, string> = {
    normal: 'Normal type - balanced Pokemon with no particular strengths or weaknesses',
    fire: 'Fire type - Pokemon with flame-based attacks, strong against grass and ice',
    water: 'Water type - Pokemon with water-based attacks, strong against fire and ground',
    electric: 'Electric type - Pokemon with electrical attacks, strong against water and flying',
    grass: 'Grass type - Plant-based Pokemon, strong against water and ground',
    ice: 'Ice type - Pokemon with ice-based attacks, strong against grass and flying',
    fighting: 'Fighting type - Physical combat Pokemon, strong against normal and ice',
    poison: 'Poison type - Pokemon with toxic attacks, strong against grass',
    ground: 'Ground type - Earth-based Pokemon, strong against electric and fire',
    flying: 'Flying type - Airborne Pokemon, strong against grass and fighting',
    psychic: 'Psychic type - Pokemon with mental powers, strong against fighting and poison',
    bug: 'Bug type - Insect-like Pokemon, strong against grass and psychic',
    rock: 'Rock type - Stone-based Pokemon, strong against fire and flying',
    ghost: 'Ghost type - Spectral Pokemon, immune to normal and fighting attacks',
    dragon: 'Dragon type - Powerful legendary Pokemon, strong against other dragons',
    dark: 'Dark type - Pokemon using underhanded tactics, strong against psychic',
    steel: 'Steel type - Metal-bodied Pokemon, resistant to many attack types',
    fairy: 'Fairy type - Magical Pokemon, strong against dragon and fighting',
  };

  return typeDescriptions[type] || `${type} type Pokemon`;
};

export const getAriaLabelForColorPalette = (pokemonName: string, colors: string[]): string => {
  const colorCount = colors.length;
  return `Color palette for ${pokemonName} containing ${colorCount} color${
    colorCount === 1 ? '' : 's'
  }: ${colors.join(', ')}`;
};

export const getAriaLabelForLoadingState = (message?: string): string => {
  return message ? `Loading: ${message}` : 'Content is loading, please wait';
};

// Screen reader announcements
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the announcement after it's been read
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const parseColor = (color: string): number[] => {
    const rgb = color.match(/\d+/g);
    return rgb ? rgb.map(Number) : [0, 0, 0];
  };

  const lum1 = getLuminance(parseColor(color1));
  const lum2 = getLuminance(parseColor(color2));

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

export const isAccessibleContrast = (backgroundColor: string, textColor: string): boolean => {
  const contrastRatio = getContrastRatio(backgroundColor, textColor);
  return contrastRatio >= 4.5; // WCAG AA standard for normal text
};

export const getAccessibleTextColor = (backgroundColor: string): string => {
  const whiteContrast = getContrastRatio(backgroundColor, 'rgb(255, 255, 255)');
  const blackContrast = getContrastRatio(backgroundColor, 'rgb(0, 0, 0)');

  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
};

// Reduced motion utilities
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getAnimationDuration = (defaultDuration: number): number => {
  return prefersReducedMotion() ? 0 : defaultDuration;
};

// High contrast mode detection
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Skip link utilities
export const createSkipLink = (targetId: string, label: string): HTMLAnchorElement => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'skip-link';
  skipLink.setAttribute('data-skip-link', 'true');

  return skipLink;
};

// ARIA live region utilities
export interface LiveRegionOptions {
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

export const createLiveRegion = (id: string, options: LiveRegionOptions = {}): HTMLDivElement => {
  const { priority = 'polite', atomic = true, relevant = 'all' } = options;

  const liveRegion = document.createElement('div');
  liveRegion.id = id;
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', atomic.toString());
  liveRegion.setAttribute('aria-relevant', relevant);
  liveRegion.className = 'sr-only';

  return liveRegion;
};

// Alternative text generators
export const getAltTextForPokemonSprite = (
  pokemonName: string,
  isShiny: boolean = false
): string => {
  const shinyText = isShiny ? 'shiny ' : '';
  return `${shinyText}${pokemonName} sprite image`;
};

export const getAltTextForColorSwatch = (color: string, index?: number): string => {
  const position = index !== undefined ? ` ${index + 1}` : '';
  return `Color swatch${position} showing ${color}`;
};
