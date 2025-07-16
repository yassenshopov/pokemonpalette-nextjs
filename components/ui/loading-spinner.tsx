'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { componentClasses } from '@/lib/design-tokens';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'pokemon';
}

const SIZES = {
  xs: 'w-4 h-4',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const TEXT_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  className,
  variant = 'default',
}: LoadingSpinnerProps) {
  if (variant === 'minimal') {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        role="status"
        aria-label={message}
      >
        <div className={cn(componentClasses.spinner, SIZES[size])} />
      </div>
    );
  }

  if (variant === 'pokemon') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-4', className)}
        role="status"
        aria-label={message}
      >
        <div className="relative">
          {/* Pokemon-style Pokeball spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={cn('relative', SIZES[size])}
          >
            {/* Pokeball design */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-600 relative border-2 border-white shadow-lg">
              {/* White band */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-white" />
              </div>
              {/* Center button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white border border-gray-300" />
              </div>
              {/* Bottom half */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-b-full" />
            </div>
          </motion.div>
        </div>

        {message && (
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn('text-muted-foreground font-medium text-center', TEXT_SIZES[size])}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  // Default variant with improved design
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4', className)}
      role="status"
      aria-label={message}
    >
      <div className="relative">
        <motion.div
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <div className={cn(componentClasses.spinner, SIZES[size], 'border-primary')} />
          {/* Glow effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 blur-lg',
              SIZES[size]
            )}
          />
        </motion.div>
      </div>

      {message && (
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn('text-muted-foreground font-medium text-center max-w-xs', TEXT_SIZES[size])}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
