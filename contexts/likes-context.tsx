'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface LikedDesign {
  id: number;
  title: string;
  creator: string;
  imageUrl?: string;
  pokemon: string;
  category: string;
  likes: number;
  createdAt: string;
  likedAt: string;
}

interface LikesContextType {
  likedDesigns: LikedDesign[];
  isLiked: (id: number) => boolean;
  toggleLike: (design: LikedDesign) => void;
  removeLiked: (id: number) => void;
  clearLiked: () => void;
  getLikedCount: () => number;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [likedDesigns, setLikedDesigns] = useState<LikedDesign[]>([]);

  // Load liked designs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('likedDesigns');
    if (saved) {
      setLikedDesigns(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever likedDesigns changes
  useEffect(() => {
    localStorage.setItem('likedDesigns', JSON.stringify(likedDesigns));
  }, [likedDesigns]);

  const isLiked = (id: number) => likedDesigns.some(design => design.id === id);

  const toggleLike = (design: LikedDesign) => {
    if (isLiked(design.id)) {
      removeLiked(design.id);
    } else {
      setLikedDesigns(prev => [{ ...design, likedAt: new Date().toISOString() }, ...prev]);
    }
  };

  const removeLiked = (id: number) => {
    setLikedDesigns(prev => prev.filter(design => design.id !== id));
  };

  const clearLiked = () => {
    setLikedDesigns([]);
  };

  const getLikedCount = () => likedDesigns.length;

  return (
    <LikesContext.Provider
      value={{
        likedDesigns,
        isLiked,
        toggleLike,
        removeLiked,
        clearLiked,
        getLikedCount,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
}
