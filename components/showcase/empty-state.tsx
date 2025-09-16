import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { SubmitDesignDialog } from '../ui/submit-design-dialog';
import { Button } from '../ui/button';
import speciesData from '@/data/species.json';

const EmptyState = ({ selectedPokemon }: { selectedPokemon: string }) => {
  const [imageError, setImageError] = useState(false);

  // Validate that selectedPokemon exists in speciesData before accessing it
  const isValidPokemon = selectedPokemon !== 'all' && selectedPokemon in speciesData;
  const pokemonId = isValidPokemon
    ? speciesData[selectedPokemon as keyof typeof speciesData]
    : null;
  const pokemonSprite = pokemonId ? `/images/pokemon/front/${pokemonId}.png` : null;
  const pokemonName = isValidPokemon
    ? selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1).replace(/-/g, ' ')
    : null;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="text-center py-16">
      <div className="relative w-64 h-64 mx-auto mb-12">
        {pokemonSprite && !imageError ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <div className="relative">
              <Image
                src={pokemonSprite}
                alt={pokemonName || 'Pokemon'}
                width={256}
                height={256}
                className="w-64 h-64 filter brightness-0 dark:invert dark:brightness-100 opacity-30 dark:opacity-20"
                style={{ imageRendering: 'pixelated' }}
                quality={50}
                unoptimized={true}
                onError={handleImageError}
              />
              <div className="absolute inset-0 w-64 h-64 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 dark:from-primary/20 dark:to-primary/5 blur-2xl" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div className="relative w-32 h-32">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-rose-600 p-1">
                <div className="w-full h-full rounded-full bg-background p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-rose-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-white rounded-full" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 max-w-md mx-auto"
      >
        <h3 className="text-2xl font-bold">
          {pokemonName ? `No ${pokemonName} Designs Yet!` : 'Be the First to Share!'}
        </h3>
        <p className="text-muted-foreground text-lg mb-8">
          {pokemonName
            ? `Be the first to create and share a ${pokemonName}-inspired design! Inspire others with your creativity.`
            : 'The showcase is waiting for its first masterpiece. Share your Pokemon-inspired designs and inspire others!'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SubmitDesignDialog prefilledPokemon={pokemonName || undefined}>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Submit Your Design
            </Button>
          </SubmitDesignDialog>
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog/pokemon-color-psychology">
              <Sparkles className="h-5 w-5 mr-2" />
              Get Inspired
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyState;
