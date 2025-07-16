import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'blue' | 'gold' | 'custom';
}

export function VerifiedBadge({ className, size = 'md', variant = 'blue' }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
  };

  const variantClasses = {
    blue: 'bg-blue-500 text-white',
    gold: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white',
    custom: 'bg-primary text-primary-foreground',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full shrink-0 shadow-sm ring-2 ring-background transition-all hover:scale-110 cursor-help',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      title="Verified account"
    >
      <Check className={cn('stroke-[3px]', iconSizes[size])} />
    </div>
  );
}
