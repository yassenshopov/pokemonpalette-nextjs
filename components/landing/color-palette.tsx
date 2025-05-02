import { useState } from 'react';
import { ColorGrid } from './color-grid';

interface ColorPaletteProps {
  colors: string[];
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
  
  const [, r, g, b] = result;
  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16)
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

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

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('rgb');

  const convertColor = (color: string, format: 'hex' | 'rgb' | 'hsl'): string => {
    // First, ensure we have RGB values
    let rgbValues: RGB | null = null;

    if (color.startsWith('#')) {
      rgbValues = hexToRgb(color);
    } else {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        rgbValues = {
          r: parseInt(matches[0]),
          g: parseInt(matches[1]),
          b: parseInt(matches[2])
        };
      }
    }

    if (!rgbValues) return color;
    const { r, g, b } = rgbValues;

    switch (format) {
      case 'hex': {
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
      case 'rgb':
        return `rgb(${r}, ${g}, ${b})`;
      case 'hsl': {
        const { h, s, l } = rgbToHsl(r, g, b);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
      default:
        return color;
    }
  };

  return (
    <ColorGrid
      colors={colors}
      colorFormat={colorFormat}
      convertColor={convertColor}
      onFormatChange={setColorFormat}
    />
  );
} 