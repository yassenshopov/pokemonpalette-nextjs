import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Volume2, VolumeX, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stat {
  name: string;
  base_stat: number;
}

interface PokemonInfoProps {
  pokemonName: string;
  pokemonNumber: number;
  pokemonDescription: string;
  pokemonTypes: string[];
  selectedVersion: string;
  availableVersions: string[];
  onVersionChange: (version: string) => void;
  getContrastColor: (color: string) => { text: string; overlay: string };
  colors: string[];
  officialArt: string;
  pokemonCry?: string;
  stats: Stat[];
  descriptions: Array<{ flavor_text: string; version: { name: string } }>;
  currentDescriptionIndex: number;
  onDescriptionChange: (index: number) => void;
}

export function PokemonInfo({
  pokemonName,
  pokemonNumber,
  pokemonDescription,
  pokemonTypes,
  selectedVersion,
  availableVersions,
  onVersionChange,
  getContrastColor,
  colors,
  officialArt,
  pokemonCry,
  stats,
  descriptions,
  currentDescriptionIndex,
  onDescriptionChange,
}: PokemonInfoProps) {
  const mainColor = colors[0] || '#000000';
  const secondaryColor = colors[1] || mainColor;
  const tertiaryColor = colors[2] || secondaryColor;
  const { text: textColor } = getContrastColor(mainColor);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentDescription, setCurrentDescription] = useState('');

  // Get filtered descriptions for current version
  const filteredDescriptions = descriptions
    .filter(desc => desc.version.name === selectedVersion)
    .reduce((acc, current) => {
      const isDuplicate = acc.some(
        item => item.flavor_text.replace(/\f/g, ' ') === current.flavor_text.replace(/\f/g, ' ')
      );
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof descriptions);

  // Update description when version changes
  useEffect(() => {
    onDescriptionChange(0);
  }, [selectedVersion, onDescriptionChange]);

  // Update description when index or filtered descriptions change
  useEffect(() => {
    if (filteredDescriptions.length > 0) {
      // Ensure index is within bounds
      const safeIndex = Math.min(currentDescriptionIndex, filteredDescriptions.length - 1);
      if (safeIndex !== currentDescriptionIndex) {
        onDescriptionChange(safeIndex);
      }
      setCurrentDescription(filteredDescriptions[safeIndex].flavor_text.replace(/\f/g, ' '));
    }
  }, [currentDescriptionIndex, filteredDescriptions, onDescriptionChange]);

  const handlePrevDescription = () => {
    if (filteredDescriptions.length <= 1) return;
    onDescriptionChange(
      currentDescriptionIndex > 0 ? currentDescriptionIndex - 1 : filteredDescriptions.length - 1
    );
  };

  const handleNextDescription = () => {
    if (filteredDescriptions.length <= 1) return;
    onDescriptionChange(
      currentDescriptionIndex < filteredDescriptions.length - 1 ? currentDescriptionIndex + 1 : 0
    );
  };

  const handlePrevVersion = () => {
    const currentIndex = availableVersions.indexOf(selectedVersion);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableVersions.length - 1;
    onVersionChange(availableVersions[prevIndex]);
  };

  const handleNextVersion = () => {
    const currentIndex = availableVersions.indexOf(selectedVersion);
    const nextIndex = currentIndex < availableVersions.length - 1 ? currentIndex + 1 : 0;
    onVersionChange(availableVersions[nextIndex]);
  };

  const playPokemonCry = () => {
    if (!pokemonCry) return;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(pokemonCry);
    setAudio(newAudio);

    newAudio
      .play()
      .then(() => {
        setIsPlaying(true);
        newAudio.addEventListener('ended', () => {
          setIsPlaying(false);
        });
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
  };

  const maxStat = Math.max(...stats.map(stat => stat.base_stat));

  // Format stat name to be more readable
  const formatStatName = (name: string) => {
    switch (name) {
      case 'hp':
        return 'HP';
      case 'special-attack':
        return 'Sp. Atk';
      case 'special-defense':
        return 'Sp. Def';
      default:
        return name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  return (
    <div
      id="pokemon-info"
      className="w-full px-8 md:px-16 mx-auto max-w-7xl rounded-2xl relative overflow-hidden bg-gradient-to-br from-transparent to-black/5"
      style={{ backgroundColor: mainColor }}
    >
      {/* Pokemon Silhouette */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 opacity-10 pointer-events-none">
        <div className="relative w-[400px] h-[400px]">
          <Image
            src={officialArt}
            alt={pokemonName}
            fill
            className="object-contain"
            style={{ filter: 'brightness(0)' }}
            unoptimized={true}
            quality={100}
          />
        </div>
      </div>

      <div className="relative z-10 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className={cn('text-3xl font-bold capitalize', textColor)}>
                {pokemonName} #{String(pokemonNumber).padStart(3, '0')}
              </h2>

              {pokemonCry && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPokemonCry}
                  className={cn(
                    'rounded-full',
                    'bg-black/10 hover:bg-black/20',
                    'dark:bg-white/10 dark:hover:bg-white/20',
                    textColor
                  )}
                >
                  {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {pokemonTypes.map(type => (
                <span
                  key={type}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium capitalize',
                    'bg-black/10 dark:bg-white/10',
                    textColor
                  )}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'capitalize min-w-[150px] justify-between',
                  'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20',
                  textColor
                )}
              >
                {selectedVersion}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {availableVersions.map(version => (
                <DropdownMenuItem
                  key={version}
                  onClick={() => onVersionChange(version)}
                  className="capitalize"
                >
                  {version}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Description */}
          <div className="space-y-6">
            <div>
              <h3 className={cn('text-lg font-semibold mb-2', textColor)}>Pokédex Entry</h3>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentDescription}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn('text-lg leading-relaxed mb-4', textColor)}
                >
                  {currentDescription}
                </motion.p>
              </AnimatePresence>

              <div className="flex items-center justify-start gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevVersion}
                        className={cn(
                          'rounded-full',
                          'bg-black/10 hover:bg-black/20',
                          'dark:bg-white/10 dark:hover:bg-white/20',
                          textColor
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Previous Version</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextVersion}
                        className={cn(
                          'rounded-full',
                          'bg-black/10 hover:bg-black/20',
                          'dark:bg-white/10 dark:hover:bg-white/20',
                          textColor
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Next Version</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                className={cn(
                  'group',
                  'bg-black/10 hover:bg-black/20',
                  'dark:bg-white/10 dark:hover:bg-white/20',
                  textColor
                )}
                onClick={() =>
                  window.open(
                    `https://bulbapedia.bulbagarden.net/wiki/${pokemonName}_(Pokémon)`,
                    '_blank'
                  )
                }
              >
                Learn More
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className={cn('text-lg font-semibold mb-4', textColor)}>Base Stats</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={cn('font-medium', textColor)}>
                      {formatStatName(stat.name)}
                    </span>
                    <span className={cn('font-medium', textColor)}>{stat.base_stat}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${(stat.base_stat / maxStat) * 100}%`,
                        backgroundColor:
                          index % 2 === 0
                            ? `color-mix(in srgb, ${secondaryColor}, transparent 15%)`
                            : `color-mix(in srgb, ${tertiaryColor}, transparent 15%)`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Total Stats */}
              <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10">
                <div className="flex justify-between text-sm">
                  <span className={cn('font-semibold', textColor)}>Total</span>
                  <span className={cn('font-semibold', textColor)}>
                    {stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
