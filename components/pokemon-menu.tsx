'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { PokemonSpriteV2 } from '@/components/pokemon-sprite-v2';

// Simplified PokemonMenu component that uses PokemonSpriteV2
export function PokemonMenu() {
  return (
    <Card className="w-full h-full overflow-hidden flex flex-col border-none shadow-none px-2 sm:px-4 md:px-8 mt-16 sm:mt-8">
      <PokemonSpriteV2 className="w-full" />
    </Card>
  );
}
