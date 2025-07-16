'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SavedDesign {
  id: number;
  title: string;
  creator: string;
  imageUrl?: string;
  colors: string[];
  pokemon: string;
  savedAt: string;
}

interface SaveContextType {
  savedDesigns: SavedDesign[];
  isSaved: (id: number) => boolean;
  toggleSave: (design: SavedDesign) => void;
  removeSaved: (id: number) => void;
  clearSaved: () => void;
}

const SaveContext = createContext<SaveContextType | undefined>(undefined);

export function SaveProvider({ children }: { children: React.ReactNode }) {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  // Load saved designs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) {
      setSavedDesigns(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever savedDesigns changes
  useEffect(() => {
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));
  }, [savedDesigns]);

  const isSaved = (id: number) => savedDesigns.some(design => design.id === id);

  const toggleSave = (design: SavedDesign) => {
    if (isSaved(design.id)) {
      removeSaved(design.id);
    } else {
      setSavedDesigns(prev => [{ ...design, savedAt: new Date().toISOString() }, ...prev]);
    }
  };

  const removeSaved = (id: number) => {
    setSavedDesigns(prev => prev.filter(design => design.id !== id));
  };

  const clearSaved = () => {
    setSavedDesigns([]);
  };

  return (
    <SaveContext.Provider
      value={{
        savedDesigns,
        isSaved,
        toggleSave,
        removeSaved,
        clearSaved,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
}

export function useSave() {
  const context = useContext(SaveContext);
  if (context === undefined) {
    throw new Error('useSave must be used within a SaveProvider');
  }
  return context;
}
