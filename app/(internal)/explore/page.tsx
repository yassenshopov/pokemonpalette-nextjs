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
  Compass,
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

// Remove metadata from client component
// export const metadata: Metadata = {
//   title: 'Community Explore - Pokemon Palette',
//   description: 'See amazing designs created by the Pokemon Palette community.',
// };

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

const EmptyState = ({ selectedPokemon }: { selectedPokemon: string }) => {
  // Get Pokemon data if selected
  const pokemonId =
    selectedPokemon !== 'all' ? speciesData[selectedPokemon as keyof typeof speciesData] : null;
  const pokemonSprite = pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    : null;
  const pokemonName =
    selectedPokemon !== 'all'
      ? selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1).replace(/-/g, ' ')
      : null;

  return (
    <div className="text-center py-16">
      {/* Center Pokemon or Pokeball */}
      <div className="relative w-64 h-64 mx-auto mb-12">
        {pokemonSprite ? (
          // Show selected Pokemon (no rotation)
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
              />
              {/* Glow effect */}
              <div className="absolute inset-0 w-64 h-64 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 dark:from-primary/20 dark:to-primary/5 blur-2xl" />
            </div>
          </motion.div>
        ) : (
          // Show Pokeball (with rotation)
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="relative w-32 h-32">
              {/* Main Pokeball body */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-rose-600 p-1">
                <div className="w-full h-full rounded-full bg-background p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-rose-600 relative">
                    {/* White band */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-white rounded-full" />
                    </div>
                    {/* Center button */}
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

      {/* Text Content */}
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
            : 'Our community is waiting for its first masterpiece. Share your Pokemon-inspired designs and inspire others!'}
        </p>

        {/* Action Buttons */}
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

const ProFeaturesBanner = () => (
  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border rounded-lg p-6 mb-8">
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="flex-1 text-center lg:text-left">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Unlock Pro Features</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Take your designs to the next level with premium features
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <span className="text-sm">Download Palettes</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <span className="text-sm">Share Collections</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">AI Color Suggestions</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Button size="lg" className="gap-2">
          <Crown className="w-5 h-5" />
          Upgrade to Pro
        </Button>
      </div>
    </div>
  </div>
);

export default function ExplorePage() {
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
      // For now, use mock data directly instead of API
      // const response = await fetch('/api/designs');
      // const data = await response.json();

      // Convert mock designs to the expected format
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
    } catch (error) {
      // Error fetching designs - using fallback data
      toast({
        title: 'Error',
        description: 'Failed to load designs. Please try again.',
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Compass className="w-4 h-4" />
              Community Designs
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Explore Designs
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Discover amazing Pokemon-inspired designs created by our community. Get inspired and
              share your own creations!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/profile">
                  <Bookmark className="w-4 h-4" />
                  My Profile
                </Link>
              </Button>
              <SubmitDesignDialog>
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Submit Design
                </Button>
              </SubmitDesignDialog>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Pro Features Banner */}
        {!loading && <ProFeaturesBanner />}

        {/* Trending Section */}
        {!loading && designs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Trending Designs */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <CardTitle>Trending Designs</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {designs
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 3)
                    .map(design => (
                      <div
                        key={design.id}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                          {design.imageUrl ? (
                            <img
                              src={design.imageUrl}
                              alt={design.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🎨
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{design.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by{' '}
                            <Link
                              href={`/users/${design.userId}`}
                              className="hover:text-primary transition-colors hover:underline"
                            >
                              {design.creator}
                            </Link>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            <span className="text-sm text-muted-foreground">
                              {design.likes} likes
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <CardTitle>Popular Categories</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories
                    .filter(cat => cat.value !== 'all')
                    .map(category => {
                      const count = designs.filter(d => d.category === category.value).length;
                      return (
                        <Button
                          key={category.value}
                          variant="ghost"
                          className="w-full justify-between h-auto py-3"
                          onClick={() => setSelectedCategory(category.value)}
                        >
                          <span>{category.label}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </Button>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Featured Designs */}
        {!loading && designs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Featured Designs</h2>
              <Button variant="ghost" className="text-primary">
                View All Featured
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {designs
                .filter(design => design.status === 'featured')
                .slice(0, 2)
                .map(design => (
                  <Card
                    key={design.id}
                    className="overflow-hidden transition-shadow bg-gradient-to-br from-background to-muted/50 border-2"
                  >
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        🎨
                      </div>
                      {design.imageUrl && (
                        <img
                          src={design.imageUrl}
                          alt={design.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="default" className="bg-primary/90 hover:bg-primary">
                          Featured
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl line-clamp-2">{design.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Featured on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleLike({
                              id: design.id,
                              title: design.title,
                              creator: design.creator,
                              pokemon: design.pokemon,
                              category: design.category,
                              likes: design.likes,
                              createdAt: design.date,
                              imageUrl: design.imageUrl,
                              likedAt: new Date().toISOString(),
                            })
                          }
                          className={`p-2 h-auto ${
                            isLiked(design.id) ? 'text-red-500' : 'text-muted-foreground'
                          }`}
                        >
                          <motion.div
                            animate={
                              isLiked(design.id)
                                ? {
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 10, -10, 0],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 0.6,
                              ease: 'easeInOut',
                            }}
                          >
                            <Heart
                              className={`w-4 h-4 transition-all duration-300 ${
                                isLiked(design.id) ? 'fill-current' : 'hover:scale-110'
                              }`}
                            />
                          </motion.div>
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <User className="w-4 h-4" />
                        <Link
                          href={`/users/${design.userId}`}
                          className="hover:text-primary transition-colors hover:underline"
                        >
                          {design.creator}
                        </Link>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{design.date}</span>
                      </div>

                      {/* Color Palette */}
                      <div className="flex gap-1 mb-4">
                        {design.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>

                      <Button className="w-full gap-2">
                        View Design
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
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
              <Card key={design.id} className="overflow-hidden transition-shadow group">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🎨
                  </div>
                  {design.imageUrl && (
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant={isSaved(design.id) ? 'default' : 'secondary'}
                      size="icon"
                      onClick={() =>
                        toggleSave({
                          id: design.id,
                          title: design.title,
                          creator: design.creator,
                          pokemon: design.pokemon,
                          colors: design.colors,
                          imageUrl: design.imageUrl,
                          savedAt: new Date().toISOString(),
                        })
                      }
                      className={`bg-background/80 backdrop-blur-sm transition-all duration-300 ${
                        isSaved(design.id) ? 'bg-primary text-primary-foreground scale-110' : ''
                      }`}
                    >
                      <motion.div
                        animate={
                          isSaved(design.id)
                            ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0],
                              }
                            : {}
                        }
                        transition={{
                          duration: 0.5,
                          ease: 'easeInOut',
                        }}
                      >
                        <Bookmark
                          className={`w-4 h-4 transition-all duration-300 ${
                            isSaved(design.id) ? 'fill-current' : ''
                          }`}
                        />
                      </motion.div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toggleLike({
                          id: design.id,
                          title: design.title,
                          creator: design.creator,
                          pokemon: design.pokemon,
                          category: design.category,
                          likes: design.likes,
                          createdAt: design.date,
                          imageUrl: design.imageUrl,
                          likedAt: new Date().toISOString(),
                        });
                      }}
                      className={`bg-background/80 backdrop-blur-sm transition-all duration-300 ${
                        isLiked(design.id) ? 'text-red-500' : 'text-foreground'
                      }`}
                    >
                      <motion.div
                        animate={
                          isLiked(design.id)
                            ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, 10, -10, 0],
                              }
                            : {}
                        }
                        transition={{
                          duration: 0.6,
                          ease: 'easeInOut',
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-300 ${
                            isLiked(design.id) ? 'fill-current' : ''
                          }`}
                        />
                      </motion.div>
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Link href={`/explore/${design.id}`}>
                      <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                        {design.title}
                      </CardTitle>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <Link
                      href={`/users/${design.userId}`}
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      {design.creator}
                    </Link>
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>{design.date}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {design.description}
                  </p>

                  {/* Color Palette */}
                  <div className="flex gap-1 mb-4">
                    {design.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {design.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {design.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{design.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{design.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {design.category.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {design.pokemon}
                      </Badge>
                    </div>
                  </div>

                  {/* View Design Button */}
                  <Button asChild className="w-full gap-2">
                    <Link href={`/explore/${design.id}`}>
                      View Design
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
