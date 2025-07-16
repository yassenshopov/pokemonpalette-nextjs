'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Heart,
  ExternalLink,
  Palette,
  Calendar,
  User,
  Plus,
  Sparkles,
  Brush,
  Wand2,
  Shapes,
  Crown,
  Download,
  Share2,
  Zap,
  Bookmark,
} from 'lucide-react';
import Link from 'next/link';
import { SubmitDesignDialog } from '@/components/ui/submit-design-dialog';
import { PokemonCommand } from '@/components/ui/pokemon-command';
import { motion } from 'framer-motion';
import Image from 'next/image';
import speciesData from '@/data/species.json';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSave } from '@/contexts/save-context';
import { useLikes } from '@/contexts/likes-context';
import { mockDesigns, type MockDesign } from '@/data/mockData';
import EmptyState from '@/components/showcase/empty-state';
import ProFeaturesBanner from '@/components/showcase/pro-features-banner';
import TrendingDesigns from '@/components/showcase/trending-designs';
import PopularCategories from '@/components/showcase/popular-categories';
import FeaturedDesigns from '@/components/showcase/featured-designs';
import DesignCard from '@/components/showcase/design-card';

interface Design {
  id: number;
  title: string;
  creator: string;
  userId: string;
  pokemon: string;
  category: string;
  description: string;
  likes: number;
  tags: string[];
  date: string;
  colors: string[];
  imageUrl?: string;
  status: string;
  savedAt?: string;
}

export default function ShowcasePage() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const { isSaved, toggleSave } = useSave();
  const { isLiked, toggleLike } = useLikes();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPokemon, setSelectedPokemon] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, []);

  useEffect(() => {
    filterDesigns();
  }, [designs, selectedCategory, selectedPokemon, searchTerm]);

  const fetchDesigns = async () => {
    try {
      // Fetch real designs from the API
      const response = await fetch('/api/designs');
      if (!response.ok) throw new Error('API request failed');
      const { designs: apiDesigns } = await response.json();
      setDesigns(apiDesigns);
    } catch (error) {
      // Error fetching designs - using fallback mock data
      const convertedDesigns = mockDesigns.map(design => ({
        id: parseInt(design.id),
        title: design.title,
        creator: design.creator,
        userId: design.userId,
        pokemon: design.pokemon,
        category: design.category,
        description: design.description,
        likes: design.likes,
        tags: design.tags,
        date: new Date(design.date).toISOString().split('T')[0],
        colors: design.colors,
        imageUrl: design.imageUrl,
        status: design.status,
      }));
      setDesigns(convertedDesigns);
      toast({
        title: 'Error',
        description: 'Failed to load designs from the server. Showing mock data instead.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDesigns = () => {
    let filtered = designs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(design => design.category === selectedCategory);
    }

    if (selectedPokemon !== 'all') {
      filtered = filtered.filter(design => design.pokemon === selectedPokemon);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        design =>
          design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          design.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          design.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredDesigns(filtered);
  };

  const handlePokemonSelect = (name: string) => {
    setSelectedPokemon(name || 'all');
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'web-design', label: 'Web Design' },
    { value: 'branding', label: 'Branding' },
    { value: 'art', label: 'Art' },
    { value: 'product-design', label: 'Product Design' },
    { value: 'mobile-app', label: 'Mobile App' },
    { value: 'print-design', label: 'Print Design' },
  ];

  const pokemonOptions = [
    { value: 'all', label: 'All Pokemon' },
    { value: 'pikachu', label: 'Pikachu' },
    { value: 'charizard', label: 'Charizard' },
    { value: 'bulbasaur', label: 'Bulbasaur' },
    { value: 'squirtle', label: 'Squirtle' },
    { value: 'umbreon', label: 'Umbreon' },
    { value: 'mewtwo', label: 'Mewtwo' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading community designs..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">Design Showcase</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore Pokemon-inspired designs created by our community. Get inspired and share your
            own creations!
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/profile" className="gap-2">
                <Bookmark className="w-4 h-4" />
                My Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Pro Features Banner */}
        {!loading && <ProFeaturesBanner />}

        {/* Trending & Popular Categories */}
        {!loading && designs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <TrendingDesigns designs={designs} />
            <PopularCategories
              categories={categories}
              designs={designs}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Featured Designs */}
        {!loading && designs.length > 0 && (
          <FeaturedDesigns designs={designs} isLiked={isLiked} toggleLike={toggleLike} />
        )}

        {/* Filters */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search designs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pokemon</label>
              <PokemonCommand
                value={selectedPokemon === 'all' ? undefined : selectedPokemon}
                onSelect={handlePokemonSelect}
                placeholder="Filter by Pokemon..."
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPokemon('all');
                  setSearchTerm('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDesigns.length} of {designs.length} designs
          </p>
        </div>

        {/* Designs Grid or Empty State */}
        {filteredDesigns.length === 0 ? (
          loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <EmptyState selectedPokemon={selectedPokemon} />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map(design => (
              <DesignCard
                key={design.id}
                design={design}
                isSaved={isSaved}
                isLiked={isLiked}
                toggleSave={toggleSave}
                toggleLike={toggleLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
