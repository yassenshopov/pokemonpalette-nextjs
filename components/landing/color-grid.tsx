import { Copy, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColorGridProps {
  colors: string[];
  colorFormat: 'hex' | 'rgb' | 'hsl';
  convertColor: (color: string, format: 'hex' | 'rgb' | 'hsl') => string;
  onFormatChange?: (format: 'hex' | 'rgb' | 'hsl') => void;
}

export function ColorGrid({ colors, colorFormat, convertColor, onFormatChange }: ColorGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prevFormat, setPrevFormat] = useState<string>(colorFormat);

  // Detect touch device on component mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Update the previous format when colorFormat changes
  useEffect(() => {
    setPrevFormat(colorFormat);
  }, [colorFormat]);

  const copyToClipboard = async (color: string, index: number, e?: React.MouseEvent) => {
    // If the event target is a button or its child elements, don't copy
    if (e?.target instanceof Element) {
      const isButton = e.target.closest('button');
      if (isButton) return;
    }

    try {
      await navigator.clipboard.writeText(convertColor(color, colorFormat));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // Clipboard copy failed - fallback method used
    }
  };

  // Calculate contrasting text color for each color block
  const getContrastColor = (hexColor: string) => {
    const rgb = hexColor
      .replace('#', '')
      .match(/.{2}/g)
      ?.map(x => parseInt(x, 16)) || [0, 0, 0];
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128 ? 'text-black' : 'text-white';
  };

  const formatLabels = {
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
  };

  // Calculate the animation direction for format change
  const getFormatChangeDirection = (current: string, previous: string) => {
    const formats = ['hex', 'rgb', 'hsl'];
    const currentIndex = formats.indexOf(current);
    const prevIndex = formats.indexOf(previous);

    if (currentIndex === prevIndex) return 0;
    return currentIndex > prevIndex ? 1 : -1;
  };

  const formatChangeDirection = getFormatChangeDirection(colorFormat, prevFormat);

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Improved responsive grid: 1 column on small mobiles, 2 on larger mobiles, 3 on tablets and up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-3 sm:px-6 md:px-8 lg:px-16 mx-auto max-w-7xl">
        {colors.map((color, index) => (
          <motion.div
            key={color}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative"
          >
            <div
              className={cn(
                'rounded-xl p-6 sm:p-8 md:p-10 min-w-[160px] h-[180px] sm:h-[200px] md:h-[220px] cursor-pointer',
                'transition-all duration-300',
                'border border-transparent hover:border-white/10',
                'shadow-sm hover:shadow-md',
                getContrastColor(color),
                'select-none overflow-hidden'
              )}
              style={{ backgroundColor: color }}
              onClick={e => copyToClipboard(color, index, e)}
              role="button"
              tabIndex={0}
              aria-label={`Color ${index + 1}: ${convertColor(
                color,
                colorFormat
              )}. Click to copy to clipboard.`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  copyToClipboard(color, index);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-xs sm:text-sm font-medium',
                        'bg-black/10 hover:bg-black/20',
                        'dark:bg-white/10 dark:hover:bg-white/20'
                      )}
                    >
                      <motion.span
                        key={colorFormat}
                        initial={{ y: formatChangeDirection * -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: formatChangeDirection * 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center"
                      >
                        {formatLabels[colorFormat]}{' '}
                        <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </motion.span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onFormatChange?.('hex')}>HEX</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFormatChange?.('rgb')}>RGB</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFormatChange?.('hsl')}>HSL</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div
                  className={cn(
                    'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg',
                    'bg-black/10 dark:bg-white/10',
                    'transition-all duration-200',
                    // Show when copied
                    copiedIndex === index
                      ? 'opacity-100'
                      : // Otherwise for non-touch devices, show on hover
                      !isTouchDevice
                      ? 'opacity-0 group-hover:opacity-100'
                      : // For touch devices, show at reduced opacity
                        'opacity-60'
                  )}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">Copy</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6 sm:pt-8 md:pt-12">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={colorFormat + color}
                    initial={{ y: formatChangeDirection * 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: formatChangeDirection * -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs sm:text-sm font-mono font-medium truncate"
                  >
                    {convertColor(color, colorFormat)}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
