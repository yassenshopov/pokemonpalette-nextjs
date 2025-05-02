import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPalettes, deletePalette, SavedPalette } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, ExternalLink, Check, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SavedPalettesProps {
  onSelectPalette?: (palette: SavedPalette) => void;
  isDialog?: boolean;
}

export function SavedPalettes({ onSelectPalette, isDialog = false }: SavedPalettesProps) {
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [hoveredPalette, setHoveredPalette] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  // Fetch palettes when component mounts or user changes
  useEffect(() => {
    loadPalettes();
  }, [user]);

  const loadPalettes = () => {
    try {
      const savedPalettes = getPalettes().filter(palette => 
        // Show user's palettes or anonymous palettes if no user
        user ? palette.userId === user.id : !palette.userId
      );
      
      // Sort by creation date (newest first)
      savedPalettes.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPalettes(savedPalettes);
    } catch (error) {
      console.error('Error loading palettes:', error);
    }
  };

  const handleDeletePalette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      deletePalette(id);
      setPalettes(palettes.filter(p => p.id !== id));
      toast({
        title: "Palette deleted",
        description: "The palette has been removed",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting palette:', error);
      toast({
        title: "Error",
        description: "Could not delete the palette",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handlePaletteSelect = (palette: SavedPalette) => {
    setSelectedPalette(palette.id);
    
    if (onSelectPalette) {
      onSelectPalette(palette);
    } else if (palette.pokemonName) {
      // Navigate to the Pokémon page if no custom handler provided
      router.push(`/${palette.pokemonName.toLowerCase()}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Helper function to determine if text should be white or black based on background color
  const getContrastTextColor = (backgroundColor: string) => {
    // Simple algorithm to determine if text should be white or black
    const rgb = backgroundColor.match(/\d+/g);
    if (!rgb) return 'text-foreground';
    
    const [r, g, b] = rgb.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? 'text-black' : 'text-white';
  };

  return (
    <div className={`space-y-4 ${isDialog ? 'p-2' : ''}`}>
      {!isDialog && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Saved Palettes</h2>
        </div>
      )}
      
      {palettes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No saved palettes found.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first palette by selecting a Pokémon and clicking "Save Palette"
          </p>
        </div>
      ) : (
        <ScrollArea className={isDialog ? 'h-[400px]' : 'h-full max-h-[70vh]'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {palettes.map((palette) => {
              const isHovered = hoveredPalette === palette.id;
              const isSelected = selectedPalette === palette.id;
              const mainColor = palette.colors[0] || '#000000';
              const textColorClass = getContrastTextColor(mainColor);
              
              return (
                <motion.div
                  key={palette.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 overflow-hidden h-[220px] relative ${
                      isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                    }`}
                    onClick={() => handlePaletteSelect(palette)}
                    onMouseEnter={() => setHoveredPalette(palette.id)}
                    onMouseLeave={() => setHoveredPalette(null)}
                    style={{ backgroundColor: mainColor }}
                  >
                    {/* Pokemon Silhouette Background */}
                    {palette.pokemonId && (
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none h-full w-full overflow-hidden">
                        <div className="absolute bottom-[-10%] right-[-10%] w-[110%] h-[110%]">
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${palette.pokemonId}.png`}
                            alt={palette.pokemonName || 'Pokemon'}
                            fill
                            className="object-contain"
                            style={{ filter: 'brightness(0)' }}
                            unoptimized={true}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 h-full flex flex-col relative z-10">
                      {/* Card Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-semibold text-lg line-clamp-1 ${textColorClass}`}>
                            {palette.name}
                          </h3>
                          <p className={`text-xs opacity-75 ${textColorClass}`}>
                            {formatDate(palette.createdAt)}
                          </p>
                        </div>
                        
                        {palette.pokemonId && (
                          <div className="flex items-center bg-white/20 backdrop-blur-sm p-1 rounded-full">
                            <Image
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${palette.isShiny ? 'shiny/' : ''}${palette.pokemonId}.png`}
                              alt={palette.pokemonName || 'Pokemon'}
                              width={32}
                              height={32}
                              className="h-8 w-8 object-contain"
                              unoptimized={true}
                              quality={1}
                              style={{ imageRendering: 'pixelated' }}
                            />
                            {palette.isShiny && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 shadow-md">
                                <Sparkles className="h-3 w-3 text-yellow-900" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Color Chips */}
                      <div className="flex gap-2 mt-4">
                        {palette.colors.map((color, i) => (
                          <motion.div 
                            key={i}
                            initial={{ scale: 0.9, opacity: 0.7 }}
                            animate={{ 
                              scale: isHovered ? 1 : 0.9,
                              opacity: isHovered ? 1 : 0.7
                            }}
                            transition={{ delay: i * 0.1 }}
                            className="h-10 w-10 rounded-full border-2 border-white/30 shadow-sm flex items-center justify-center"
                            style={{ backgroundColor: color }}
                          >
                            {isHovered && (
                              <span className="text-[10px] font-mono font-bold" style={{ 
                                color: getContrastTextColor(color) === 'text-white' ? 'white' : 'black' 
                              }}>
                                {i+1}
                              </span>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Action bar at bottom */}
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-8 px-2 hover:bg-black/10 ${textColorClass}`}
                          onClick={(e) => handleDeletePalette(palette.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        
                        <div className="flex gap-2">
                          {isSelected && onSelectPalette && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className={`h-8 px-3 hover:bg-white/20 ${textColorClass}`}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Selected
                            </Button>
                          )}
                          
                          {!onSelectPalette && palette.pokemonName && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-8 px-3 border border-white/30 ${textColorClass} hover:bg-white/20`}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/${palette.pokemonName?.toLowerCase()}`);
                              }}
                            >
                              <span className="mr-1">View</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
} 