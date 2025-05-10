import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useColors } from '@/contexts/color-context';

export function ShinyToggleFab({ primaryColor }: { primaryColor: string }) {
  const { shiny, setShiny } = useColors();

  if (!primaryColor) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
      >
        <motion.div
          animate={{
            scale: shiny ? [1, 1.1, 1] : 1,
            rotate: shiny ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeat: shiny ? Infinity : 0,
            repeatDelay: 2,
          }}
        >
          <Button
            onClick={() => setShiny(!shiny)}
            className={cn(
              'h-14 w-14 rounded-full shadow-lg transition-all duration-300',
              'hover:scale-105 active:scale-95',
              'border-2',
              shiny ? 'border-yellow-400' : 'border-transparent'
            )}
            style={{
              backgroundColor: shiny ? primaryColor : `${primaryColor}20`,
              boxShadow: shiny
                ? `0 0 20px ${primaryColor}40, 0 0 40px ${primaryColor}20`
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Sparkles
              className={cn(
                'h-6 w-6 transition-all duration-300',
                shiny ? 'text-yellow-400' : 'text-foreground/60'
              )}
            />
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
