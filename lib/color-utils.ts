type ColorFormat = 'hex' | 'rgb' | 'hsl';

export const getRGBFromString = (color: string) => {
  const rgb = color.match(/\d+/g);
  if (!rgb) return [0, 0, 0];
  return rgb.map(Number);
};

export const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const getContrastRatio = (color1: string, color2: string) => {
  const [r1, g1, b1] = getRGBFromString(color1);
  const [r2, g2, b2] = getRGBFromString(color2);

  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);

  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);

  return (brightest + 0.05) / (darkest + 0.05);
};

export const getContrastColor = (
  bgColor: string
): { text: string; overlay: string } => {
  if (!bgColor) return { text: 'text-foreground', overlay: '' };

  const whiteContrast = getContrastRatio(bgColor, 'rgb(255, 255, 255)');
  const blackContrast = getContrastRatio(bgColor, 'rgb(0, 0, 0)');

  // Add a semi-transparent overlay if contrast is too low
  const needsOverlay = Math.max(whiteContrast, blackContrast) < 4.5;

  return {
    text: whiteContrast > blackContrast ? 'text-white' : 'text-black',
    overlay: needsOverlay ? 'bg-black/10 dark:bg-white/10' : '',
  };
};

export const convertColor = (color: string, format: ColorFormat) => {
  // Convert RGB string to array of numbers
  const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];

  switch (format) {
    case 'hex':
      return `#${rgb.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
    case 'rgb':
      return `rgb(${rgb.join(', ')})`;
    case 'hsl':
      const [r, g, b] = rgb.map((x) => x / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;

      if (max === min) return `hsl(0, 0%, ${Math.round(l * 100)}%)`;

      const d = max - min;
      const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      let h = 0;

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      return `hsl(${Math.round(h * 60)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
      )}%)`;
    default:
      return color;
  }
}; 