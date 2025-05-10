import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  colors?: string[];
  className?: string;
}

export function LoadingSpinner({ colors = [], className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative w-16 h-16">
        {/* Outer spinning ring */}
        <div
          className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: colors[0] || 'currentColor',
            borderTopColor: 'transparent',
          }}
        />
        {/* Inner spinning ring */}
        <div
          className="absolute inset-2 border-4 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: colors[1] || 'currentColor',
            borderTopColor: 'transparent',
            animationDirection: 'reverse',
            animationDuration: '1.5s',
          }}
        />
        {/* Center dot */}
        <div
          className="absolute inset-[30%] rounded-full animate-pulse"
          style={{
            backgroundColor: colors[2] || 'currentColor',
          }}
        />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Generating colors...</p>
    </div>
  );
}
