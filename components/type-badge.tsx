import { memo } from 'react';
import { cn } from '@/lib/utils';
import { PokemonTypeNames } from '@/types/pokemon';

interface TypeBadgeProps {
  type: PokemonTypeNames;
  isMatch?: boolean;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  'aria-label'?: string;
}

const typeColors: Record<PokemonTypeNames, { bg: string; text: string }> = {
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

const typeIcons: Record<PokemonTypeNames, string> = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '🌍',
  flying: '🦅',
  psychic: '🔮',
  bug: '🐛',
  rock: '🗿',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '🧚',
};

export const TypeBadge = memo(function TypeBadge({
  type,
  isMatch,
  className,
  children,
  showIcon = false,
  'aria-label': ariaLabel,
}: TypeBadgeProps) {
  const { bg, text } = typeColors[type];
  const effectiveAriaLabel = ariaLabel || `${type} type Pokemon`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium capitalize',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isMatch !== undefined
          ? isMatch
            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 border border-green-400'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-400'
          : `${bg} ${text}`,
        className
      )}
      role="img"
      aria-label={effectiveAriaLabel}
      title={effectiveAriaLabel}
    >
      {showIcon && (
        <span aria-hidden="true" className="text-[10px]">
          {typeIcons[type]}
        </span>
      )}
      <span>{children || type}</span>
    </span>
  );
});
