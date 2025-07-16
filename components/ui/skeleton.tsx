import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />;
}

// Pokemon-specific skeleton components
export function PokemonCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PokemonSpriteSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  return (
    <div className={cn('relative rounded-full', sizeClasses[size])}>
      <Skeleton className="w-full h-full rounded-full" />
      {/* Pokeball-like skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-background/50" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton className="w-3 h-3 rounded-full bg-background/30" />
      </div>
    </div>
  );
}

export function ColorPaletteSkeleton() {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-12 h-12 rounded-full" />
      ))}
    </div>
  );
}

export function PokemonMenuSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Main Pokemon sprite */}
      <div className="flex justify-center">
        <PokemonSpriteSkeleton size="lg" />
      </div>

      {/* Pokemon name */}
      <div className="text-center">
        <Skeleton className="h-8 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>

      {/* Type badges */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Color palette */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <ColorPaletteSkeleton />
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function PokemonGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <PokemonSpriteSkeleton size="sm" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
