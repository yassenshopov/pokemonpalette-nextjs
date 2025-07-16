'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Palette,
  Calendar,
  User,
  ExternalLink,
  Plus,
  Bookmark,
  Trash2,
  Clock,
  Droplets,
  Settings,
  MapPin,
  Link as LinkIcon,
  Save,
  X,
  Trophy,
  Star,
  Zap,
  Target,
  Crown,
  Flame,
  Sparkles,
  Award,
  Shield,
  Gem,
  Timer,
  TrendingUp,
  Eye,
  Users,
  Rocket,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { SubmitDesignDialog } from '@/components/ui/submit-design-dialog';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { useSave } from '@/contexts/save-context';
import { useLikes } from '@/contexts/likes-context';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

interface Design {
  id: string;
  title: string;
  imageUrl: string;
  pokemon: string;
  category: string;
  likes: number;
  createdAt: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'creation' | 'social' | 'exploration' | 'milestone' | 'rare';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    required: number;
  };
  reward?: string;
}

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const { savedDesigns, removeSaved, clearSaved } = useSave();
  const { likedDesigns, removeLiked, clearLiked } = useLikes();

  // Get saved palettes from localStorage (from the old save functionality)
  const [savedPalettes, setSavedPalettes] = useState<any[]>([]);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.fullName || user?.username || '',
    bio: (user?.publicMetadata as any)?.bio || '',
    location: (user?.publicMetadata as any)?.location || '',
    website: (user?.publicMetadata as any)?.website || '',
  });

  // Achievement detail modal state
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedPalettes');
    if (saved) {
      setSavedPalettes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.fullName || user.username || '',
        bio: (user.publicMetadata as any)?.bio || '',
        location: (user.publicMetadata as any)?.location || '',
        website: (user.publicMetadata as any)?.website || '',
      });
    }
  }, [user]);

  const removePalette = (paletteId: string) => {
    const updatedPalettes = savedPalettes.filter(p => p.id !== paletteId);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
  };

  const clearPalettes = () => {
    setSavedPalettes([]);
    localStorage.removeItem('savedPalettes');
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would update the user via Clerk's user update API
      // await user.update({
      //   firstName: profileData.displayName.split(' ')[0],
      //   lastName: profileData.displayName.split(' ').slice(1).join(' '),
      //   publicMetadata: {
      //     bio: profileData.bio,
      //     location: profileData.location,
      //     website: profileData.website,
      //   }
      // });

      // For now, just show a success message
      // Profile update simulation
      setIsEditing(false);

      // You could add a toast notification here
    } catch (error) {
      // Failed to update profile - showing error
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (user) {
      setProfileData({
        displayName: user.fullName || user.username || '',
        bio: (user.publicMetadata as any)?.bio || '',
        location: (user.publicMetadata as any)?.location || '',
        website: (user.publicMetadata as any)?.website || '',
      });
    }
    setIsEditing(false);
  };

  // Placeholder data - replace with real data from your API
  const designs: Design[] = [];

  // Achievement system - would be fetched from API based on user activity
  const achievements: Achievement[] = [
    // Creation Achievements
    {
      id: 'first-design',
      name: 'First Steps',
      description: 'Submit your first design to the community',
      icon: Palette,
      category: 'creation',
      rarity: 'common',
      unlocked: designs.length > 0,
      unlockedAt: designs.length > 0 ? new Date().toISOString() : undefined,
      reward: '+10 XP',
    },
    {
      id: 'prolific-creator',
      name: 'Prolific Creator',
      description: 'Submit 10 designs to the community',
      icon: Rocket,
      category: 'creation',
      rarity: 'uncommon',
      unlocked: designs.length >= 10,
      progress: { current: designs.length, required: 10 },
      reward: 'Custom badge',
    },
    {
      id: 'master-designer',
      name: 'Master Designer',
      description: 'Submit 50 designs to the community',
      icon: Crown,
      category: 'creation',
      rarity: 'epic',
      unlocked: designs.length >= 50,
      progress: { current: designs.length, required: 50 },
      reward: 'Verified status + Custom flair',
    },

    // Social Achievements
    {
      id: 'first-like',
      name: 'Appreciator',
      description: 'Like your first community design',
      icon: Heart,
      category: 'social',
      rarity: 'common',
      unlocked: likedDesigns.length > 0,
      unlockedAt: likedDesigns.length > 0 ? new Date().toISOString() : undefined,
      reward: '+5 XP',
    },
    {
      id: 'taste-maker',
      name: 'Taste Maker',
      description: 'Like 100 community designs',
      icon: Star,
      category: 'social',
      rarity: 'rare',
      unlocked: likedDesigns.length >= 100,
      progress: { current: likedDesigns.length, required: 100 },
      reward: 'Special like animation',
    },
    {
      id: 'viral-creator',
      name: 'Viral Creator',
      description: 'Get 1000 likes on a single design',
      icon: Flame,
      category: 'social',
      rarity: 'legendary',
      unlocked: false,
      progress: { current: 0, required: 1000 },
      reward: 'Legendary Creator badge',
    },

    // Exploration Achievements
    {
      id: 'pokemon-explorer',
      name: 'Pokemon Explorer',
      description: 'Create palettes for 25 different Pokemon',
      icon: Target,
      category: 'exploration',
      rarity: 'uncommon',
      unlocked: new Set(savedPalettes.map(p => p.pokemonName)).size >= 25,
      progress: { current: new Set(savedPalettes.map(p => p.pokemonName)).size, required: 25 },
      reward: 'Explorer badge',
    },
    {
      id: 'shiny-hunter',
      name: 'Shiny Hunter',
      description: 'Save 5 shiny Pokemon palettes',
      icon: Sparkles,
      category: 'exploration',
      rarity: 'rare',
      unlocked: savedPalettes.filter(p => p.isShiny).length >= 5,
      progress: { current: savedPalettes.filter(p => p.isShiny).length, required: 5 },
      reward: 'Shiny effect on profile',
    },
    {
      id: 'gotta-catch-em-all',
      name: "Gotta Catch 'Em All",
      description: 'Create palettes for 150 different Pokemon',
      icon: Shield,
      category: 'exploration',
      rarity: 'legendary',
      unlocked: false,
      progress: { current: new Set(savedPalettes.map(p => p.pokemonName)).size, required: 150 },
      reward: 'Master Trainer title',
    },

    // Milestone Achievements
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'Join during the beta period',
      icon: Zap,
      category: 'milestone',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: user?.createdAt
        ? new Date(user.createdAt).toISOString()
        : new Date().toISOString(),
      reward: 'Beta tester badge',
    },
    {
      id: 'one-year-member',
      name: 'Veteran Member',
      description: 'Member for over one year',
      icon: Award,
      category: 'milestone',
      rarity: 'uncommon',
      unlocked:
        user && user.createdAt
          ? new Date().getTime() - new Date(user.createdAt).getTime() > 365 * 24 * 60 * 60 * 1000
          : false,
      reward: 'Veteran badge',
    },

    // Rare/Special Achievements
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Create a design with perfect color harmony',
      icon: Gem,
      category: 'rare',
      rarity: 'epic',
      unlocked: false,
      reward: 'Perfectionist title',
    },
    {
      id: 'trendsetter',
      name: 'Trendsetter',
      description: 'Create a design that becomes the most liked this month',
      icon: TrendingUp,
      category: 'rare',
      rarity: 'legendary',
      unlocked: false,
      reward: 'Trendsetter crown',
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;

  if (!isSignedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Sign in to view your profile</h1>
          <p className="text-muted-foreground">
            Join our community to share and save your favorite Pokemon-inspired designs.
          </p>
          <Button
            size="lg"
            onClick={() => {
              const signInButton = document.querySelector('[data-clerk-sign-in]');
              if (signInButton instanceof HTMLElement) {
                signInButton.click();
              }
            }}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Header section with gradient background */}
        <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.imageUrl || ''} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="mb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{user.fullName || user.username}</h1>
                {(user.publicMetadata as { isVerified?: boolean })?.isVerified && (
                  <VerifiedBadge size="md" variant="blue" />
                )}
              </div>
              <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Member since{' '}
                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          <Tabs defaultValue="designs" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-muted/50">
                <TabsTrigger
                  value="designs"
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">My Designs</span>
                  <span className="sm:hidden">Designs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="liked"
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Liked Designs</span>
                  <span className="sm:hidden">Liked</span>
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved Designs</span>
                  <span className="sm:hidden">Saved</span>
                </TabsTrigger>
                <TabsTrigger
                  value="palettes"
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <Droplets className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved Palettes</span>
                  <span className="sm:hidden">Palettes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Achievements</span>
                  <span className="sm:hidden">Awards</span>
                </TabsTrigger>
                <TabsTrigger
                  value="edit"
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="designs" className="space-y-8">
              {designs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {designs.map(design => (
                    <motion.div
                      key={design.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="group overflow-hidden">
                        <div className="aspect-[4/3] overflow-hidden bg-secondary/20">
                          <img
                            src={design.imageUrl}
                            alt={design.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium line-clamp-1">{design.title}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {design.pokemon}
                              </p>
                            </div>
                            <Link href={`/designs/${design.id}`} className="shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {design.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(design.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                    <Palette className="w-10 h-10 text-primary" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-xl font-semibold">No designs yet</h3>
                    <p className="text-muted-foreground">
                      Start creating by submitting your first Pokemon-inspired design!
                    </p>
                    <SubmitDesignDialog>
                      <Button size="lg" className="mt-4 gap-2">
                        <Plus className="w-5 h-5" />
                        Submit Your First Design
                      </Button>
                    </SubmitDesignDialog>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="liked" className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Total Liked
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">{likedDesigns.length}</div>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Palette className="w-4 h-4 text-blue-500" />
                      Pokemon Featured
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">
                      {new Set(likedDesigns.map(d => d.pokemon)).size}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {new Set(likedDesigns.map(d => d.category)).size}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Liked Designs</h2>
                {likedDesigns.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearLiked}
                    className="text-muted-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {likedDesigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedDesigns.map(design => (
                    <motion.div
                      key={design.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="group overflow-hidden">
                        <div className="aspect-[4/3] overflow-hidden bg-secondary/20 relative">
                          {design.imageUrl ? (
                            <img
                              src={design.imageUrl}
                              alt={design.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">
                              🎨
                            </div>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeLiked(design.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium line-clamp-1">{design.title}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {design.pokemon}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/explore/${design.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {design.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(design.likedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge variant="secondary">{design.category}</Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-10 h-10 text-primary" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-xl font-semibold">No liked designs yet</h3>
                    <p className="text-muted-foreground">
                      Start exploring our community and like designs that inspire you!
                    </p>
                    <Button size="lg" className="mt-4 gap-2" asChild>
                      <Link href="/explore">
                        <ExternalLink className="w-5 h-5" />
                        Explore Community
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              {/* Actions */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Collection</h2>
                {savedDesigns.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSaved}
                    className="text-muted-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Saved Designs Grid */}
              {savedDesigns.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <Bookmark className="h-12 w-12 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Saved Designs Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start saving designs that inspire you from our community
                  </p>
                  <Button asChild>
                    <Link href="/explore">Explore Community</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedDesigns.map((design, index) => (
                    <motion.div
                      key={design.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden transition-shadow">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {design.imageUrl ? (
                            <img
                              src={design.imageUrl}
                              alt={design.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">
                              🎨
                            </div>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeSaved(design.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold truncate mb-1">{design.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                by{' '}
                                <Link
                                  href={`/users/${design.creator
                                    .toLowerCase()
                                    .replace(/\s+/g, '')}`}
                                  className="hover:text-primary transition-colors hover:underline"
                                >
                                  {design.creator}
                                </Link>
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/explore/${design.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>

                          {/* Color Palette */}
                          <div className="flex gap-1 mb-4">
                            {design.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(design.savedAt).toLocaleDateString()}</span>
                            </div>
                            <Badge variant="secondary">{design.pokemon}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="palettes" className="space-y-6">
              {/* Actions */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Saved Palettes</h2>
                {savedPalettes.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearPalettes}
                    className="text-muted-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Saved Palettes Grid */}
              {savedPalettes.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <Droplets className="h-12 w-12 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Saved Palettes Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start saving color palettes from your favorite Pokemon
                  </p>
                  <Button asChild>
                    <Link href="/">Create Your First Palette</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPalettes.map((palette, index) => (
                    <motion.div
                      key={palette.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden transition-shadow group">
                        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${
                                palette.colors[0] || 'hsl(var(--muted))'
                              }90, ${
                                palette.colors[1] || palette.colors[0] || 'hsl(var(--muted))'
                              }60, ${
                                palette.colors[2] ||
                                palette.colors[1] ||
                                palette.colors[0] ||
                                'hsl(var(--muted))'
                              }40)`,
                            }}
                          >
                            {/* Pokemon Silhouette */}
                            <div className="relative w-40 h-40 flex items-center justify-center">
                              {palette.pokemonId ? (
                                <div className="absolute inset-0 opacity-25 dark:opacity-20">
                                  <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${palette.pokemonId}.png`}
                                    alt={palette.pokemonName || 'Pokemon'}
                                    className="w-full h-full object-contain"
                                    style={{
                                      filter: 'brightness(0) saturate(0)',
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="absolute inset-0 opacity-25 dark:opacity-20"
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10 Z M35 35 C35 30, 40 25, 45 25 C50 25, 55 30, 55 35 C55 40, 50 45, 45 45 C40 45, 35 40, 35 35 Z M65 35 C65 30, 70 25, 75 25 C80 25, 85 30, 85 35 C85 40, 80 45, 75 45 C70 45, 65 40, 65 35 Z M50 60 C45 60, 40 55, 40 50 C40 45, 45 40, 50 40 C55 40, 60 45, 60 50 C60 55, 55 60, 50 60 Z' fill='%23000000'/%3E%3C/svg%3E")`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                  }}
                                />
                              )}
                            </div>

                            {/* Shiny sparkle effect */}
                            {palette.isShiny && (
                              <div className="absolute top-3 right-3 text-3xl animate-pulse">
                                ✨
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePalette(palette.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold truncate mb-1">{palette.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {palette.pokemonName}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/${palette.pokemonName?.toLowerCase()}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>

                          {/* Color Palette */}
                          <div className="flex gap-1 mb-4">
                            {palette.colors.map((color: string, i: number) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(palette.savedAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                            {palette.isShiny && <Badge variant="secondary">✨ Shiny</Badge>}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="space-y-8">
              {/* All Achievements Grid - Like in Users Page */}
              <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-500 rounded-full">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">All Achievements</h2>
                    <p className="text-sm text-muted-foreground">
                      {unlockedAchievements.length} of {totalAchievements} unlocked
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    const getRarityColor = (rarity: string, unlocked: boolean) => {
                      if (!unlocked) return 'from-gray-300 via-gray-400 to-gray-500';
                      // All unlocked badges are golden
                      return 'from-amber-400 via-yellow-500 to-amber-600';
                    };

                    const getInnerColor = (rarity: string, unlocked: boolean) => {
                      if (!unlocked) return 'from-gray-100 to-gray-200';
                      // All unlocked badges have golden inner color
                      return 'from-amber-200 to-yellow-300';
                    };

                    return (
                      <div key={achievement.id} className="flex flex-col items-center group">
                        <div
                          className="relative w-14 h-14 cursor-pointer"
                          onClick={() => setSelectedAchievement(achievement)}
                        >
                          {/* Badge Circle */}
                          <div
                            className={`w-full h-full rounded-full bg-gradient-to-br ${getRarityColor(
                              achievement.rarity,
                              achievement.unlocked
                            )} p-0.5 transition-all duration-300 group-hover:scale-105 ${
                              !achievement.unlocked ? 'opacity-50' : ''
                            }`}
                          >
                            <div
                              className={`w-full h-full rounded-full bg-gradient-to-br ${getInnerColor(
                                achievement.rarity,
                                achievement.unlocked
                              )} flex items-center justify-center`}
                            >
                              <IconComponent
                                className={`w-7 h-7 ${
                                  achievement.unlocked ? 'text-current' : 'text-gray-600'
                                }`}
                              />
                            </div>
                          </div>
                          {/* Shine effect for unlocked */}
                          {achievement.unlocked && (
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-50"></div>
                          )}
                          {/* Lock badge for locked achievements */}
                          {!achievement.unlocked && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center border border-background">
                              <Lock className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium mt-2 text-center line-clamp-2 max-w-16">
                          {achievement.name}
                        </span>
                        {!achievement.unlocked && achievement.progress && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {achievement.progress.current}/{achievement.progress.required}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Achievement Tips */}
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Achievement Tips</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                          <span>Submit your first design to unlock creation achievements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                          <span>Engage with the community by liking and saving designs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                          <span>Explore different Pokemon to unlock discovery achievements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                          <span>Rare achievements unlock special profile features and badges</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-8">
              {/* Toggle between Edit and Preview */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant={!showPreview ? 'default' : 'outline'}
                  onClick={() => setShowPreview(false)}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button
                  variant={showPreview ? 'default' : 'outline'}
                  onClick={() => setShowPreview(true)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview Profile
                </Button>
              </div>

              {!showPreview ? (
                /* Edit Mode */
                <>
                  <Card className="max-w-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Edit Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Display Name */}
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profileData.displayName}
                          onChange={e =>
                            setProfileData(prev => ({ ...prev, displayName: e.target.value }))
                          }
                          placeholder="Your display name"
                          disabled={!isEditing}
                        />
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={e => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself and your passion for Pokemon design..."
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={e =>
                            setProfileData(prev => ({ ...prev, location: e.target.value }))
                          }
                          placeholder="Your location (e.g., Pallet Town, Kanto)"
                          disabled={!isEditing}
                        />
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={e =>
                            setProfileData(prev => ({ ...prev, website: e.target.value }))
                          }
                          placeholder="https://your-portfolio.com"
                          disabled={!isEditing}
                          type="url"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        {!isEditing ? (
                          <Button onClick={() => setIsEditing(true)} className="gap-2">
                            <Settings className="w-4 h-4" />
                            Edit Profile
                          </Button>
                        ) : (
                          <>
                            <Button onClick={handleSaveProfile} className="gap-2">
                              <Save className="w-4 h-4" />
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Quick Preview */}
                      {isEditing && (
                        <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                          <h3 className="text-lg font-semibold mb-4">Quick Preview</h3>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xl font-bold">
                                {profileData.displayName || 'Your Name'}
                              </h4>
                            </div>
                            {profileData.bio && (
                              <p className="text-muted-foreground">{profileData.bio}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              {profileData.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {profileData.location}
                                </div>
                              )}
                              {profileData.website && (
                                <div className="flex items-center gap-1">
                                  <LinkIcon className="w-4 h-4" />
                                  <span className="text-primary">Portfolio</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Preview Mode - Show how the profile looks to other users */
                <div className="space-y-8">
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                            Public Profile Preview
                          </h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            This is how other users see your profile
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mock Public Profile Header */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-background">
                          <AvatarImage src={user.imageUrl || ''} alt={profileData.displayName} />
                          <AvatarFallback className="text-2xl font-bold">
                            {profileData.displayName
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                              {profileData.displayName || 'Your Name'}
                            </h1>
                            {(user.publicMetadata as { isVerified?: boolean })?.isVerified && (
                              <VerifiedBadge size="lg" variant="blue" />
                            )}
                          </div>
                          <p className="text-xl text-muted-foreground">@{user.username}</p>
                          <p className="text-muted-foreground max-w-2xl">
                            {profileData.bio || 'No bio added yet'}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                            {profileData.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {profileData.location}
                              </div>
                            )}
                            {profileData.website && (
                              <div className="flex items-center gap-1 text-primary">
                                <LinkIcon className="w-4 h-4" />
                                Portfolio
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Joined{' '}
                              {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Follow Button (disabled in preview) */}
                      <div className="lg:ml-auto">
                        <Button disabled className="gap-2 opacity-75">
                          <Users className="w-4 h-4" />
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Real Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-primary">{designs.length}</div>
                      <div className="text-sm text-muted-foreground">Designs</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-red-500">{likedDesigns.length}</div>
                      <div className="text-sm text-muted-foreground">Likes Given</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-blue-500">{savedDesigns.length}</div>
                      <div className="text-sm text-muted-foreground">Saves</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-green-500">
                        {savedPalettes.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Palettes</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-purple-500">
                        {unlockedAchievements.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Achievements</div>
                    </Card>
                  </div>

                  {/* Mock Achievements (simplified) */}
                  {unlockedAchievements.length > 0 && (
                    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500 rounded-full">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">Gym Badges Earned</h2>
                          <p className="text-sm text-muted-foreground">
                            {unlockedAchievements.length} achievements unlocked
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {unlockedAchievements.slice(0, 8).map((achievement, index) => {
                          const IconComponent = achievement.icon;
                          return (
                            <div key={index} className="flex flex-col items-center group">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 p-0.5 transition-all duration-300 group-hover:scale-105">
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center">
                                    <IconComponent className="w-6 h-6 text-amber-800" />
                                  </div>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-50"></div>
                              </div>
                              <span className="text-xs font-medium mt-2 text-center line-clamp-2 max-w-16">
                                {achievement.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  )}

                  {/* Preview Note */}
                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                          <Eye className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                            Profile Preview
                          </p>
                          <p className="text-amber-700 dark:text-amber-300">
                            This shows how your profile appears to other users. Your designs,
                            achievements, and activity stats will be displayed here once you start
                            using the platform.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Edit Mode Only - Profile Tips */}
              {!showPreview && (
                <Card className="max-w-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <strong>Bio:</strong> Share your passion for Pokemon design and color
                          theory. Mention your favorite Pokemon types or design inspirations.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <strong>Location:</strong> Add your region or city - it helps connect with
                          other designers in your area.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <strong>Website:</strong> Link to your portfolio, social media, or
                          personal website to showcase more of your work.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="max-w-md sm:max-w-md">
          {selectedAchievement && (
            <>
              <DialogHeader className="pb-4">
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br p-0.5 ${
                      selectedAchievement.unlocked
                        ? 'from-amber-400 via-yellow-500 to-amber-600'
                        : 'from-gray-300 via-gray-400 to-gray-500'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center ${
                        selectedAchievement.unlocked
                          ? 'from-amber-200 to-yellow-300'
                          : 'from-gray-100 to-gray-200'
                      }`}
                    >
                      <selectedAchievement.icon
                        className={`w-6 h-6 ${
                          selectedAchievement.unlocked ? 'text-current' : 'text-gray-600'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedAchievement.name}</h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        selectedAchievement.unlocked ? 'border-current' : 'text-muted-foreground'
                      }`}
                    >
                      {selectedAchievement.rarity}
                    </Badge>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedAchievement.description}</p>

                {/* Progress Section */}
                {selectedAchievement.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-muted-foreground">
                        {selectedAchievement.progress.current}/
                        {selectedAchievement.progress.required}
                      </span>
                    </div>
                    <Progress
                      value={
                        (selectedAchievement.progress.current /
                          selectedAchievement.progress.required) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={selectedAchievement.unlocked ? 'default' : 'secondary'}>
                    {selectedAchievement.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                  </Badge>
                </div>

                {/* Unlock Date */}
                {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Unlocked on:</span>{' '}
                    {new Date(selectedAchievement.unlockedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}

                {/* Reward */}
                {selectedAchievement.reward && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">
                        Reward:
                      </span>
                      <span className="text-yellow-700 dark:text-yellow-300">
                        {selectedAchievement.reward}
                      </span>
                    </div>
                  </div>
                )}

                {/* Category Info */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Category:</span>{' '}
                  <span className="capitalize">{selectedAchievement.category}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
