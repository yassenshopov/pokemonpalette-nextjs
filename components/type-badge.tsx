import { cn } from "@/lib/utils";

type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

interface TypeBadgeProps {
  type: PokemonType;
  isMatch?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const typeColors: Record<PokemonType, { bg: string; text: string }> = {
  normal: { bg: 'bg-gray-400', text: 'text-white' },
  fire: { bg: 'bg-red-500', text: 'text-white' },
  water: { bg: 'bg-blue-500', text: 'text-white' },
  electric: { bg: 'bg-yellow-400', text: 'text-black' },
  grass: { bg: 'bg-green-500', text: 'text-white' },
  ice: { bg: 'bg-cyan-300', text: 'text-black' },
  fighting: { bg: 'bg-red-700', text: 'text-white' },
  poison: { bg: 'bg-purple-500', text: 'text-white' },
  ground: { bg: 'bg-amber-600', text: 'text-white' },
  flying: { bg: 'bg-indigo-400', text: 'text-white' },
  psychic: { bg: 'bg-pink-500', text: 'text-white' },
  bug: { bg: 'bg-lime-500', text: 'text-white' },
  rock: { bg: 'bg-yellow-700', text: 'text-white' },
  ghost: { bg: 'bg-purple-700', text: 'text-white' },
  dragon: { bg: 'bg-indigo-600', text: 'text-white' },
  dark: { bg: 'bg-gray-700', text: 'text-white' },
  steel: { bg: 'bg-gray-500', text: 'text-white' },
  fairy: { bg: 'bg-pink-400', text: 'text-white' },
};

export function TypeBadge({ type, isMatch, className, children }: TypeBadgeProps) {
  const { bg, text } = typeColors[type];
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-xs font-medium capitalize',
        isMatch !== undefined
          ? isMatch
            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
          : `${bg} ${text}`,
        className
      )}
    >
      {children || type}
    </span>
  );
} 