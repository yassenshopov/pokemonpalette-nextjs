import { Copy, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColorGridProps {
  colors: string[];
  colorFormat: 'hex' | 'rgb' | 'hsl';
  convertColor: (color: string, format: 'hex' | 'rgb' | 'hsl') => string;
  onFormatChange?: (format: 'hex' | 'rgb' | 'hsl') => void;
}

export function ColorGrid({ colors, colorFormat, convertColor, onFormatChange }: ColorGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
      console.error('Failed to copy color:', err);
    }
  };

  // Calculate contrasting text color for each color block
  const getContrastColor = (hexColor: string) => {
    const rgb = hexColor.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128 ? 'text-black' : 'text-white';
  };

  const formatLabels = {
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL'
  };

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 md:px-16 mx-auto max-w-7xl">
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
                "rounded-xl p-8 h-[160px] cursor-pointer",
                "transition-all duration-300",
                "border border-transparent hover:border-white/10",
                "shadow-sm hover:shadow-md",
                getContrastColor(color),
                "select-none"
              )}
              style={{ backgroundColor: color }}
              onClick={(e) => copyToClipboard(color, index, e)}
            >
              <div className="flex justify-between items-start">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "h-9 px-4 font-medium",
                        "bg-black/10 hover:bg-black/20",
                        "dark:bg-white/10 dark:hover:bg-white/20"
                      )}
                    >
                      {formatLabels[colorFormat]} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onFormatChange?.('hex')}>
                      HEX
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFormatChange?.('rgb')}>
                      RGB
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFormatChange?.('hsl')}>
                      HSL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div 
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2 rounded-lg",
                    "bg-black/10 dark:bg-white/10",
                    "transition-all duration-200",
                    copiedIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-sm font-medium">Click to copy</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-12">
                <p className="text-sm font-mono font-medium">
                  {convertColor(color, colorFormat)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 