import { Card } from '@/components/ui/card';
import {
  Sword,
  Shield,
  Target,
  Flame,
  Users,
  Calendar,
  Cookie,
  Bell,
  LineChart,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  Star,
  Zap as ZapIcon,
  Heart as HeartIcon,
  Shield as ShieldIcon,
  Award,
  TrendingUp,
  ChevronDown,
  Shuffle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Chat } from '@/components/example/chat';
import { TrainingTracker } from '@/components/example/training-tracker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import speciesData from '@/data/species.json';

// Add a custom shuffle function
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface ExampleComponentsProps {
  selectedColorProgress: string;
  selectedColorNotification: string;
  selectedColorCard: string;
  progress: number;
  getContrastColor: (color: string) => { text: string; overlay: string };
  colors: string[];
}

interface Notification {
  id?: number;
  title: string;
  desc: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  date: Date;
  type: 'elite' | 'gym' | 'special';
}

// Add a new interface for cookie preferences
interface CookiePreference {
  id: string;
  title: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

// Add a new interface for Pokemon team stats
interface PokemonTeamMember {
  id: number;
  name: string;
  dexId: number;
  level: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  sprite: string;
}

// Helper function to generate random values
const generateRandomValues = () => {
  return Array.from({ length: 7 }, () => ({
    value: Math.floor(Math.random() * 60) + 40,
    prev: Math.floor(Math.random() * 60) + 40,
  }));
};

// Sample notifications data
const notificationTemplates: Notification[] = [
  { title: 'New Challenge', desc: 'Team Rocket wants to battle!' },
  { title: 'Pokemon Center', desc: 'Your team has been healed' },
  { title: 'Level Up', desc: 'Charizard reached level 36' },
  { title: 'Evolution', desc: 'Your Pikachu is evolving!' },
  { title: 'Item Found', desc: 'You found a rare candy!' },
  { title: 'Gym Badge', desc: 'You earned the Boulder Badge!' },
  { title: 'New Record', desc: 'Fastest battle time achieved!' },
  { title: 'Achievement', desc: 'Caught 100 different Pokemon!' },
];

// Helper function to determine Pokemon types - properly randomized without unrealistic ID correlation
const getRandomPokemonTypes = (): string[] => {
  // List of primary Pokemon types
  const primaryTypes = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ];

  // Combinations that make sense thematically
  const secondaryTypeCombos: Record<string, string[]> = {
    normal: ['flying'],
    fire: ['flying', 'rock', 'ground', 'fighting'],
    water: ['flying', 'ground', 'ice', 'fighting', 'poison', 'psychic'],
    electric: ['flying', 'steel', 'fighting', 'psychic'],
    grass: ['poison', 'flying', 'psychic', 'ground', 'fairy'],
    ice: ['flying', 'ground', 'psychic'],
    fighting: ['steel', 'fire', 'psychic', 'dark'],
    poison: ['ground', 'dark', 'flying', 'bug'],
    ground: ['rock', 'steel', 'fighting', 'dark'],
    flying: ['normal', 'water', 'fire', 'electric', 'ice', 'bug', 'dragon'],
    psychic: ['fairy', 'flying', 'fighting', 'fire'],
    bug: ['flying', 'poison', 'grass', 'fighting'],
    rock: ['ground', 'steel', 'water', 'grass', 'fighting', 'dark'],
    ghost: ['poison', 'dark', 'psychic', 'fire', 'ice'],
    dragon: ['flying', 'fire', 'water', 'electric', 'psychic', 'ice'],
    dark: ['ghost', 'fire', 'ice', 'fighting', 'flying', 'dragon'],
    steel: ['rock', 'electric', 'psychic', 'dragon', 'fairy', 'fighting'],
    fairy: ['flying', 'psychic', 'fire', 'fighting'],
  };

  // Select a primary type
  const primaryType = primaryTypes[Math.floor(Math.random() * primaryTypes.length)];

  // 60% chance of having a secondary type
  if (Math.random() < 0.6 && secondaryTypeCombos[primaryType]) {
    const compatibleTypes = secondaryTypeCombos[primaryType];
    const secondaryType = compatibleTypes[Math.floor(Math.random() * compatibleTypes.length)];
    return [primaryType, secondaryType];
  }

  return [primaryType];
};

// Memoize the PokemonTeamMember component
const PokemonTeamMember = memo(function PokemonTeamMember({
  pokemon,
  expandedMember,
  setExpandedMember,
  isTeamLoading,
  loadingPokemon,
  mainColor,
  secondaryColor,
  tertiaryColor,
}: {
  pokemon: PokemonTeamMember;
  expandedMember: number | null;
  setExpandedMember: (id: number | null) => void;
  isTeamLoading: boolean;
  loadingPokemon: number[];
  mainColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}) {
  const handleExpand = useCallback(() => {
    if (!isTeamLoading) {
      setExpandedMember(expandedMember === pokemon.id ? null : pokemon.id);
    }
  }, [isTeamLoading, expandedMember, pokemon.id, setExpandedMember]);

  return (
    <motion.div
      key={pokemon.id}
      className="rounded-xl overflow-hidden transition-all backdrop-blur-sm shadow-sm"
      style={{
        backgroundColor:
          expandedMember === pokemon.id
            ? `color-mix(in srgb, ${mainColor}, transparent 90%)`
            : 'color-mix(in srgb, var(--background), transparent 60%)',
        borderLeft:
          expandedMember === pokemon.id ? `3px solid ${mainColor}` : '3px solid transparent',
      }}
      animate={{
        height: expandedMember === pokemon.id ? 'auto' : '72px',
        opacity: loadingPokemon.includes(pokemon.id) ? 0.6 : 1,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="p-4 cursor-pointer relative" onClick={handleExpand}>
        {/* Loading overlay for individual Pokemon */}
        {loadingPokemon.includes(pokemon.id) && (
          <motion.div
            className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 40%)`,
              }}
            >
              <motion.div
                className="w-5 h-5 border-2 border-transparent rounded-full"
                style={{ borderTopColor: mainColor }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: `radial-gradient(circle, ${mainColor}10 0%, ${secondaryColor}15 100%)`,
                boxShadow: `0 0 15px ${mainColor}30`,
              }}
            >
              {pokemon.sprite && pokemon.sprite.trim() !== '' ? (
                <motion.img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-12 h-12 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  animate={{ opacity: loadingPokemon.includes(pokemon.id) ? 0.5 : 1 }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
              )}
            </div>
            <div>
              <div className="font-medium text-foreground text-lg">{pokemon.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 80%)`,
                    color: mainColor,
                  }}
                >
                  #{pokemon.dexId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Level</span>
              <span className="font-bold text-lg" style={{ color: mainColor }}>
                {pokemon.level}
              </span>
            </div>

            <div className="hidden sm:flex gap-2 items-center">
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: pokemon.id % 2 === 0 ? secondaryColor : mainColor,
                }}
                animate={{
                  scale: loadingPokemon.includes(pokemon.id) ? [1, 1.5, 1] : [1, 1.2, 1],
                  opacity: loadingPokemon.includes(pokemon.id) ? [0.5, 1, 0.5] : [0.7, 1, 0.7],
                }}
                transition={{
                  duration: loadingPokemon.includes(pokemon.id) ? 0.5 : 2,
                  repeat: Infinity,
                  delay: pokemon.id * 0.2,
                }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: pokemon.id % 2 === 0 ? tertiaryColor : secondaryColor,
                }}
                animate={{
                  scale: loadingPokemon.includes(pokemon.id) ? [1, 1.5, 1] : [1, 1.2, 1],
                  opacity: loadingPokemon.includes(pokemon.id) ? [0.5, 1, 0.5] : [0.7, 1, 0.7],
                }}
                transition={{
                  duration: loadingPokemon.includes(pokemon.id) ? 0.5 : 2,
                  repeat: Infinity,
                  delay: pokemon.id * 0.3,
                }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: pokemon.id % 2 === 0 ? mainColor : tertiaryColor,
                }}
                animate={{
                  scale: loadingPokemon.includes(pokemon.id) ? [1, 1.5, 1] : [1, 1.2, 1],
                  opacity: loadingPokemon.includes(pokemon.id) ? [0.5, 1, 0.5] : [0.7, 1, 0.7],
                }}
                transition={{
                  duration: loadingPokemon.includes(pokemon.id) ? 0.5 : 2,
                  repeat: Infinity,
                  delay: pokemon.id * 0.4,
                }}
              />
            </div>

            <motion.div
              className={`w-6 h-6 rounded-full flex items-center justify-center`}
              style={{
                backgroundColor: expandedMember === pokemon.id ? mainColor : 'transparent',
                color: expandedMember === pokemon.id ? 'white' : 'var(--muted-foreground)',
              }}
              whileHover={{ scale: isTeamLoading ? 1 : 1.1 }}
            >
              {loadingPokemon.includes(pokemon.id) ? (
                <motion.div
                  className="w-3 h-3 border-t-2 border-r-2 border-transparent rounded-full"
                  style={{ borderColor: mainColor }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedMember === pokemon.id ? 'rotate-180' : ''
                  }`}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <div className="px-4 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-3">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <HeartIcon className="w-3.5 h-3.5" style={{ color: mainColor }} />
                <span className="text-muted-foreground font-medium">HP</span>
              </div>
              <span className="font-medium">{pokemon.stats.hp}</span>
            </div>
            <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden backdrop-blur-md">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: mainColor }}
                initial={{ width: 0 }}
                animate={{ width: `${(pokemon.stats.hp / 150) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <Sword className="w-3.5 h-3.5" style={{ color: secondaryColor }} />
                <span className="text-muted-foreground font-medium">Attack</span>
              </div>
              <span className="font-medium">{pokemon.stats.attack}</span>
            </div>
            <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden backdrop-blur-md">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: secondaryColor }}
                initial={{ width: 0 }}
                animate={{ width: `${(pokemon.stats.attack / 150) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <ShieldIcon className="w-3.5 h-3.5" style={{ color: tertiaryColor }} />
                <span className="text-muted-foreground font-medium">Defense</span>
              </div>
              <span className="font-medium">{pokemon.stats.defense}</span>
            </div>
            <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden backdrop-blur-md">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: tertiaryColor }}
                initial={{ width: 0 }}
                animate={{ width: `${(pokemon.stats.defense / 150) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <ZapIcon className="w-3.5 h-3.5" style={{ color: mainColor }} />
                <span className="text-muted-foreground font-medium">Speed</span>
              </div>
              <span className="font-medium">{pokemon.stats.speed}</span>
            </div>
            <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden backdrop-blur-md">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: mainColor }}
                initial={{ width: 0 }}
                animate={{ width: `${(pokemon.stats.speed / 150) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Memoize the TeamStats component
const TeamStats = memo(function TeamStats({
  teamSummary,
  mainColor,
  secondaryColor,
  tertiaryColor,
}: {
  teamSummary: {
    avgLevel: number;
    totalWins: number;
    recentWinRate: number;
  };
  mainColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}) {
  return (
    <div className="md:col-span-1 space-y-4">
      <div
        className="flex flex-col p-5 rounded-xl backdrop-blur-md relative overflow-hidden"
        style={{ backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 90%)` }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg. Level</span>
          <Star className="w-4 h-4" style={{ color: mainColor }} />
        </div>
        <span className="text-3xl font-bold mt-1" style={{ color: mainColor }}>
          {teamSummary.avgLevel}
        </span>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="text-xs text-green-500 font-medium">+2.8</div>
          <div className="text-xs text-muted-foreground">since last week</div>
        </div>
      </div>

      <div
        className="flex flex-col p-5 rounded-xl backdrop-blur-md relative overflow-hidden"
        style={{
          backgroundColor: `color-mix(in srgb, ${secondaryColor}, transparent 90%)`,
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Wins</span>
          <Award className="w-4 h-4" style={{ color: secondaryColor }} />
        </div>
        <span className="text-3xl font-bold mt-1" style={{ color: secondaryColor }}>
          {teamSummary.totalWins}
        </span>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="text-xs text-green-500 font-medium">+24</div>
          <div className="text-xs text-muted-foreground">this month</div>
        </div>
      </div>

      <div
        className="flex flex-col p-5 rounded-xl backdrop-blur-md relative overflow-hidden"
        style={{ backgroundColor: `color-mix(in srgb, ${tertiaryColor}, transparent 90%)` }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <Sword className="w-4 h-4" style={{ color: tertiaryColor }} />
        </div>
        <span className="text-3xl font-bold mt-1" style={{ color: tertiaryColor }}>
          {teamSummary.recentWinRate}%
        </span>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="text-xs text-green-500 font-medium">+5.2%</div>
          <div className="text-xs text-muted-foreground">past 10 battles</div>
        </div>
      </div>
    </div>
  );
});

// Memoize the BattleStats component
const BattleStats = memo(function BattleStats({
  battleStats,
  mainColor,
  secondaryColor,
  tertiaryColor,
}: {
  battleStats: {
    winRate: number;
    streak: number;
    accuracy: number;
    winRateChange: number;
    accuracyChange: number;
    nextRankPoints: number;
    totalRankPoints: number;
  };
  mainColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}) {
  return (
    <Card className="p-6 md:col-span-2 min-h-[250px] relative overflow-hidden">
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Battle Stats</h3>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="animate-pulse whitespace-nowrap"
              style={{
                backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 90%)`,
                borderColor: mainColor,
              }}
            >
              Last Battle: 2h ago
            </Badge>
            <LineChart className="w-4 h-4 shrink-0" style={{ color: mainColor }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 shrink-0" style={{ color: mainColor }} />
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold" style={{ color: mainColor }}>
                {battleStats.winRate}%
              </p>
              <span
                className={`text-xs ${
                  battleStats.winRateChange >= 0 ? 'text-green-500' : 'text-orange-500'
                }`}
              >
                {battleStats.winRateChange >= 0 ? '+' : ''}
                {battleStats.winRateChange}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: mainColor }}
                initial={{ width: '0%' }}
                animate={{ width: `${battleStats.winRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 shrink-0" style={{ color: secondaryColor }} />
              <p className="text-sm text-muted-foreground">Streak</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
                {battleStats.streak}
              </p>
              <span className="text-xs text-muted-foreground">max 12</span>
            </div>
            <div className="flex gap-0.5 h-1.5">
              {Array.from({ length: battleStats.streak }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{ backgroundColor: secondaryColor }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
              {Array.from({ length: 12 - battleStats.streak }).map((_, i) => (
                <div key={i + battleStats.streak} className="flex-1 rounded-full bg-secondary" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 shrink-0" style={{ color: tertiaryColor }} />
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold" style={{ color: tertiaryColor }}>
                {battleStats.accuracy}%
              </p>
              <span
                className={`text-xs ${
                  battleStats.accuracyChange >= 0 ? 'text-green-500' : 'text-orange-500'
                }`}
              >
                {battleStats.accuracyChange >= 0 ? '+' : ''}
                {battleStats.accuracyChange}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: tertiaryColor }}
                initial={{ width: '0%' }}
                animate={{ width: `${battleStats.accuracy}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" style={{ color: mainColor }} />
              <span className="text-sm text-muted-foreground">Next Rank:</span>
              <span className="text-sm font-medium">Elite Trainer</span>
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {battleStats.nextRankPoints}/{battleStats.totalRankPoints} points
            </div>
          </div>
          <motion.div
            className="mt-2 w-full h-1.5 rounded-full bg-secondary overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: mainColor }}
              initial={{ width: '0%' }}
              animate={{
                width: `${(battleStats.nextRankPoints / battleStats.totalRankPoints) * 100}%`,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
      </div>
    </Card>
  );
});

export const ExampleComponents = memo(function ExampleComponents({
  selectedColorProgress,
  selectedColorNotification,
  selectedColorCard,
  progress,
  getContrastColor,
  colors,
}: ExampleComponentsProps) {
  const mainColor = colors[0] || '#000000';
  const secondaryColor = colors[1] || mainColor;
  const tertiaryColor = colors[2] || secondaryColor;

  // State for dynamic bar values
  const [barData, setBarData] = useState(generateRandomValues());
  const [weeklyChange, setWeeklyChange] = useState('+20.1%');
  const [notifications, setNotifications] = useState(notificationTemplates.slice(0, 3));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Cookie consent state
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreference[]>([
    {
      id: 'necessary',
      title: 'Necessary Cookies',
      description:
        'These cookies are essential for the proper functioning of the Pokémon Trainer platform.',
      required: true,
      enabled: true,
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      description:
        'These cookies enhance your training experience by remembering your preferences.',
      required: false,
      enabled: true,
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description:
        'Help us improve by collecting anonymous data about how trainers use our platform.',
      required: false,
      enabled: false,
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'Allow us to provide personalized Pokémon product recommendations.',
      required: false,
      enabled: false,
    },
  ]);
  const [cookieConsent, setCookieConsent] = useState<'pending' | 'accepted' | 'declined'>(
    'pending'
  );
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);

  // Memoize battle stats
  const [battleStats, setBattleStats] = useState({
    winRate: 65,
    streak: 5,
    accuracy: 85,
    winRateChange: 2,
    accuracyChange: 1,
    nextRankPoints: 150,
    totalRankPoints: 300,
  });

  const [calendarEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'Elite Four Challenge',
      time: '2:30 PM',
      date: new Date(new Date().setDate(12)),
      type: 'elite',
    },
    {
      id: 2,
      title: 'Gym Leader Battle',
      time: '4:00 PM',
      date: new Date(new Date().setDate(18)),
      type: 'gym',
    },
    {
      id: 3,
      title: 'Pokemon Contest',
      time: '1:00 PM',
      date: new Date(new Date().setDate(23)),
      type: 'special',
    },
  ]);

  // Add loading state
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [loadingPokemon, setLoadingPokemon] = useState<number[]>([]);

  // Add Pokemon team members data with randomization
  const generateRandomTeam = () => {
    // Get 4 random Pokemon from the species data
    const pokemonKeys = Object.keys(speciesData);
    const randomPokemon = shuffleArray(pokemonKeys).slice(0, 4);

    return randomPokemon.map((name: string, index: number) => {
      const id = (speciesData as Record<string, number>)[name];

      // Generate randomized stats based on ID for consistency
      const seed = id % 100;
      const hp = 50 + (seed % 50);
      const attack = 60 + ((seed + 10) % 40);
      const defense = 55 + ((seed + 20) % 45);
      const speed = 65 + ((seed + 15) % 50);

      return {
        id: index + 1,
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
        dexId: id,
        level: 60 + Math.floor(id % 15),
        stats: {
          hp: hp,
          attack: attack,
          defense: defense,
          speed: speed,
        },
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
  };

  const [teamMembers, setTeamMembers] = useState<PokemonTeamMember[]>([
    {
      id: 1,
      name: 'Charizard',
      dexId: 6,
      level: 72,
      stats: {
        hp: 78,
        attack: 84,
        defense: 78,
        speed: 100,
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    },
    {
      id: 2,
      name: 'Blastoise',
      dexId: 9,
      level: 70,
      stats: {
        hp: 79,
        attack: 83,
        defense: 100,
        speed: 78,
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    },
    {
      id: 3,
      name: 'Venusaur',
      dexId: 3,
      level: 71,
      stats: {
        hp: 80,
        attack: 82,
        defense: 83,
        speed: 80,
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    },
    {
      id: 4,
      name: 'Pikachu',
      dexId: 25,
      level: 68,
      stats: {
        hp: 60,
        attack: 90,
        defense: 55,
        speed: 110,
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    },
  ]);

  // State for expanded team member
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  // Team stats summary
  const [teamSummary, setTeamSummary] = useState({
    avgLevel: 70,
    totalWins: 276,
    recentWinRate: 83,
    typeEffectiveness: 75,
  });

  // Helper function to toggle cookie preferences
  const toggleCookiePreference = (id: string) => {
    setCookiePreferences(prev =>
      prev.map(pref =>
        pref.id === id && !pref.required ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  // Helper function to set all non-required cookie preferences
  const setAllCookiePreferences = (enabled: boolean) => {
    setCookiePreferences(prev => prev.map(pref => (pref.required ? pref : { ...pref, enabled })));
  };

  // Helper to save cookie preferences
  const saveCookiePreferences = () => {
    setCookieConsent('accepted');
    setCookieDialogOpen(false);
  };

  // Decline all optional cookies
  const declineAllCookies = () => {
    setAllCookiePreferences(false);
    setCookieConsent('declined');
    setCookieDialogOpen(false);
  };

  // Effect to update bar values periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRandomValues();
      setBarData(newData);

      const avgPrev = barData.reduce((acc, curr) => acc + curr.value, 0) / 7;
      const avgNew = newData.reduce((acc, curr) => acc + curr.value, 0) / 7;
      const changeValue = ((avgNew - avgPrev) / avgPrev) * 100;
      setWeeklyChange(`${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(1)}%`);
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, [barData]);

  // Effect to add new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification =
        notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      setNotifications(prev => {
        const updated = [
          { ...newNotification, id: Date.now() }, // Add unique ID for animation
          ...prev.slice(0, 2),
        ];
        return updated;
      });
    }, 4000); // Add new notification every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Update battle stats periodically with useCallback
  const updateBattleStats = useCallback(() => {
    setBattleStats(prev => ({
      ...prev,
      winRate: Math.min(100, Math.max(50, prev.winRate + (Math.random() > 0.5 ? 1 : -1))),
      streak: Math.min(12, Math.max(0, prev.streak + (Math.random() > 0.7 ? 1 : -1))),
      accuracy: Math.min(100, Math.max(70, prev.accuracy + (Math.random() > 0.5 ? 1 : -1))),
      winRateChange: Math.floor(Math.random() * 10) - 4,
      accuracyChange: Math.floor(Math.random() * 10) - 4,
      nextRankPoints: Math.min(300, prev.nextRankPoints + Math.floor(Math.random() * 10)),
    }));
  }, []);

  // Use effect for periodic updates
  useEffect(() => {
    const interval = setInterval(updateBattleStats, 5000);
    return () => clearInterval(interval);
  }, [updateBattleStats]);

  // Memoize the randomizeTeam function
  const randomizeTeam = useCallback(() => {
    setIsTeamLoading(true);
    const loadSequence = Array.from({ length: teamMembers.length }, (_, i) => i + 1);
    let index = 0;

    const loadInterval = setInterval(() => {
      if (index < loadSequence.length) {
        setLoadingPokemon(prev => [...prev, loadSequence[index]]);
        index++;
      } else {
        clearInterval(loadInterval);
        const pokemonEntries = Object.entries(speciesData);
        const randomSelection = shuffleArray(pokemonEntries).slice(0, 4);

        const newTeam = randomSelection.map(([name, dexId], idx) => {
          const seed = Number(dexId) % 100;
          return {
            id: idx + 1,
            name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
            dexId: Number(dexId),
            level: 60 + Math.floor(Math.random() * 15),
            stats: {
              hp: 50 + (seed % 50),
              attack: 60 + ((seed + 10) % 40),
              defense: 55 + ((seed + 20) % 45),
              speed: 65 + ((seed + 15) % 50),
            },
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`,
          };
        });

        const avgLevel = Math.floor(newTeam.reduce((sum, p) => sum + p.level, 0) / newTeam.length);
        setTeamSummary(prev => ({
          ...prev,
          avgLevel,
          totalWins: Math.floor(Math.random() * 300) + 150,
          recentWinRate: Math.floor(Math.random() * 25) + 70,
        }));

        setTimeout(() => {
          setTeamMembers(newTeam);
          setLoadingPokemon([]);
          setIsTeamLoading(false);
        }, 600);
      }
    }, 150);
  }, [teamMembers.length]);

  // Memoize the team members list
  const teamMembersList = useMemo(() => {
    return teamMembers.map(pokemon => (
      <PokemonTeamMember
        key={pokemon.id}
        pokemon={pokemon}
        expandedMember={expandedMember}
        setExpandedMember={setExpandedMember}
        isTeamLoading={isTeamLoading}
        loadingPokemon={loadingPokemon}
        mainColor={colors[0]}
        secondaryColor={colors[1]}
        tertiaryColor={colors[2]}
      />
    ));
  }, [teamMembers, expandedMember, isTeamLoading, loadingPokemon, colors]);

  // Memoize the team stats
  const teamStatsComponent = useMemo(() => {
    return (
      <TeamStats
        teamSummary={teamSummary}
        mainColor={colors[0]}
        secondaryColor={colors[1]}
        tertiaryColor={colors[2]}
      />
    );
  }, [teamSummary, colors]);

  // Memoize the battle stats component
  const battleStatsComponent = useMemo(() => {
    return (
      <BattleStats
        battleStats={battleStats}
        mainColor={colors[0]}
        secondaryColor={colors[1]}
        tertiaryColor={colors[2]}
      />
    );
  }, [battleStats, colors]);

  return (
    <div className="space-y-8 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats Card - Subtle UI */}
        <Card className="p-6 md:col-span-2 h-[180px] relative overflow-hidden">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-foreground">Statistics</h3>
            <div className="mt-2">
              <div className="text-3xl font-bold" style={{ color: mainColor }}>
                2,345
              </div>
              <div className="text-sm text-muted-foreground">Active trainers</div>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily active</span>
                <span className="font-medium" style={{ color: mainColor }}>
                  +12.3%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: '65%',
                    backgroundColor: mainColor,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Battle Stats Card */}
        {battleStatsComponent}

        {/* Chat Interface Card */}
        <Chat
          mainColor={mainColor}
          secondaryColor={secondaryColor}
          getContrastColor={getContrastColor}
        />

        <TrainingTracker
          mainColor={mainColor}
          secondaryColor={secondaryColor}
          getContrastColor={getContrastColor}
        />
      </div>

      {/* Calendar Card */}
      <Card className="p-4 md:col-span-2 h-[400px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: mainColor }} />
              <h3 className="text-lg font-semibold text-foreground">Tournament Schedule</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-[120px] text-center font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="hover:bg-muted"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
            {eachDayOfInterval({
              start: startOfMonth(currentDate),
              end: endOfMonth(currentDate),
            }).map((date, i) => {
              const dayEvents = calendarEvents.filter(event => isSameDay(event.date, date));
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);

              return (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer relative',
                          'transition-colors duration-200',
                          isSelected
                            ? 'text-white'
                            : isCurrentMonth
                            ? 'text-foreground'
                            : 'text-muted-foreground/50',
                          isCurrentDay && !isSelected && 'ring-2 ring-primary/20'
                        )}
                        style={isSelected ? { backgroundColor: mainColor } : {}}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="relative z-10">{format(date, 'd')}</span>
                        {dayEvents.length > 0 && !isSelected && (
                          <div className="flex gap-0.5 mt-1">
                            {dayEvents.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className="w-1 h-1 rounded-full"
                                style={{
                                  backgroundColor:
                                    event.type === 'elite'
                                      ? mainColor
                                      : event.type === 'gym'
                                      ? secondaryColor
                                      : tertiaryColor,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    {dayEvents.length > 0 && (
                      <TooltipContent>
                        <div className="space-y-1">
                          {dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex} className="text-xs">
                              {event.time} - {event.title}
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {calendarEvents
                .filter(event => isSameDay(event.date, selectedDate))
                .map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${
                        event.type === 'elite'
                          ? mainColor
                          : event.type === 'gym'
                          ? secondaryColor
                          : tertiaryColor
                      }, transparent 95%)`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          event.type === 'elite'
                            ? mainColor
                            : event.type === 'gym'
                            ? secondaryColor
                            : tertiaryColor,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Training Progress Card */}
      <Card className="p-8 md:col-span-2 h-[300px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Training Progress</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{weeklyChange} from last week</p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-0.5 text-xs bg-background"
              style={{
                color: 'var(--muted-foreground)',
                borderColor: 'var(--border)',
              }}
            >
              This Week
            </Badge>
          </div>

          <div className="flex-1 flex items-end px-1 gap-4">
            {barData.map((data, i) => (
              <div key={i} className="group flex-1 flex flex-col items-center min-w-0">
                <div className="w-full relative h-[180px]">
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-[12px] sm:w-[18px] group-hover:opacity-90 transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: i % 2 === 0 ? mainColor : secondaryColor,
                      transform: 'translateX(-50%)',
                      borderRadius: '3px',
                    }}
                    animate={{
                      height: `${data.value}%`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                </div>
                <div className="pt-4 flex flex-col items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Notification Center Card */}
      <Card className="p-4 md:col-span-2 h-[300px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <Bell className="w-4 h-4" style={{ color: mainColor }} />
          </div>
          <ScrollArea className="flex-1 pr-4">
            <AnimatePresence mode="popLayout">
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id || i}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  }}
                  className="mb-3"
                >
                  <motion.div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${
                        i % 2 ? secondaryColor : mainColor
                      }, transparent 95%)`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </Card>

      {/* Team Stats Card */}
      <Card className="p-6 md:col-span-4 relative overflow-hidden border-none bg-background/80 backdrop-blur-sm shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-sm rounded-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 60%)` }}
              >
                <Users className="w-5 h-5" style={{ color: mainColor }} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Team Performance</h3>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-background/50 backdrop-blur-sm border-none px-3 py-1.5 shadow-sm"
                style={{
                  backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 85%)`,
                  color: mainColor,
                }}
              >
                <TrendingUp className="w-3 h-3" />
                <span>Synergy Level: 8.2</span>
              </Badge>

              <Button
                size="sm"
                variant="outline"
                className={`ml-2 rounded-full h-8 w-8 p-0 border-none bg-background/30 backdrop-blur-sm ${
                  isTeamLoading ? 'cursor-not-allowed opacity-70' : ''
                }`}
                style={{ color: mainColor }}
                onClick={randomizeTeam}
                title="Randomize Team"
                disabled={isTeamLoading}
              >
                {isTeamLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shuffle className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Shuffle className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {teamStatsComponent}
            <div className="md:col-span-4 space-y-3">{teamMembersList}</div>
          </div>
        </div>
      </Card>

      {/* Cookie Banner Card */}
      <Card className="md:col-span-2 relative overflow-hidden shadow-lg flex flex-col">
        <div className="p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-muted rounded-full">
              <Cookie className="w-5 h-5" style={{ color: mainColor }} />
            </div>
            <h3 className="text-base font-semibold flex items-center">
              Cookie Preferences
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1.5">
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80"
                  style={{
                    borderColor: mainColor,
                    boxShadow: `0 4px 12px ${mainColor}25`,
                  }}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm" style={{ color: mainColor }}>
                      About our cookies
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Cookies help us provide, protect, and improve our Pokémon training platform.
                      We use them to remember your preferences, analyze how you use our website, and
                      provide personalized content.
                    </p>
                    <div className="pt-2">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: mainColor, color: mainColor }}
                      >
                        Your Privacy Matters
                      </Badge>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            We use cookies to enhance your Pokémon training experience and analyze how our platform
            is used.
          </p>

          <div className="space-y-4 mb-6">
            {cookiePreferences.map(pref => (
              <div
                key={pref.id}
                className="flex items-center justify-between py-2 border-b border-muted"
              >
                <div className="font-medium">{pref.title}</div>
                <div className="relative">
                  <button
                    onClick={() => toggleCookiePreference(pref.id)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      pref.enabled ? 'bg-primary' : 'bg-muted',
                      pref.required && 'opacity-60 cursor-not-allowed'
                    )}
                    style={{
                      backgroundColor: pref.enabled ? mainColor : undefined,
                    }}
                    disabled={pref.required}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                        pref.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={declineAllCookies}>
                Decline All
              </Button>

              <Button
                size="sm"
                style={{ backgroundColor: mainColor }}
                className={getContrastColor(mainColor).text}
                onClick={() => {
                  setAllCookiePreferences(true);
                  setCookieConsent('accepted');
                }}
              >
                Accept All
              </Button>
            </div>

            <Dialog open={cookieDialogOpen} onOpenChange={setCookieDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-center mt-1">
                  <span className="text-xs text-muted-foreground">Advanced Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle style={{ color: mainColor }}>Cookie Preferences</DialogTitle>
                  <DialogDescription>
                    Customize which cookies you allow during your Pokémon training journey.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-sm font-medium">Cookie Settings</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setAllCookiePreferences(false)}
                      >
                        Reject All
                      </Button>
                      <Button
                        size="sm"
                        style={{ backgroundColor: mainColor }}
                        className={getContrastColor(mainColor).text}
                        onClick={() => {
                          setAllCookiePreferences(true);
                          setCookieConsent('accepted');
                        }}
                      >
                        Accept All
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-5">
                      {cookiePreferences.map(pref => (
                        <div key={pref.id} className="flex items-start gap-3">
                          <div className="pt-0.5">
                            <button
                              onClick={() => toggleCookiePreference(pref.id)}
                              className={cn(
                                'relative h-5 w-5 rounded-md border flex items-center justify-center transition-colors',
                                pref.enabled
                                  ? `bg-[${mainColor}] border-[${mainColor}]`
                                  : 'bg-background',
                                pref.required && 'opacity-60 cursor-not-allowed'
                              )}
                              style={{
                                backgroundColor: pref.enabled ? mainColor : '',
                                borderColor: pref.enabled ? mainColor : '',
                              }}
                              disabled={pref.required}
                            >
                              {pref.enabled && <Check className="h-3.5 w-3.5 text-white" />}
                            </button>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{pref.title}</span>
                              {pref.required && (
                                <Badge
                                  className="ml-2 px-1.5 py-0 text-[0.6rem]"
                                  variant="secondary"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{pref.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={saveCookiePreferences}
                    style={{ backgroundColor: mainColor }}
                    className={getContrastColor(mainColor).text}
                  >
                    Save Preferences
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </div>
  );
});
