'use client';

import React, { createContext, useContext, useState } from 'react';

interface ColorContextType {
  colors: string[];
  setColors: (colors: string[]) => void;
  pokemonName: string;
  setPokemonName: (name: string) => void;
  shiny: boolean;
  setShiny: (isShiny: boolean) => void;
  form: string;
  setForm: (form: string) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<string[]>(['rgb(255, 255, 255)', 'rgb(0, 0, 0)', 'rgb(128, 128, 128)']);
  const [pokemonName, setPokemonName] = useState<string>('');
  const [shiny, setShiny] = useState<boolean>(false);
  const [form, setForm] = useState<string>('');

  return (
    <ColorContext.Provider value={{ colors, setColors, pokemonName, setPokemonName, shiny, setShiny, form, setForm }}>
      {children}
    </ColorContext.Provider>
  );
}

export const useColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return {
    ...context,
    setShiny: (isShiny: boolean) => context.setShiny(isShiny),
    setForm: (form: string) => context.setForm(form),
  };
}; 