'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Users,
  Trophy,
  Palette,
  Target,
  Clock,
  Award,
  Plus,
  Star,
  Zap,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TypeBadge } from '@/components/type-badge';
import { SubmitDesignDialog } from '@/components/ui/submit-design-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { PokemonTypeNames } from '@/types/pokemon';
import { logger } from '@/lib/logger';

interface Challenge {
  id: string;
  title: string;
  description: string;
  pokemon: string;
  category: string;
  startDate: string;
  endDate: string;
  participants: number;
  submissions: number;
  status: 'active' | 'upcoming' | 'completed';
  prize: string;
  requirements: string[];
  colors?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const challenges: Challenge[] = [
  {
    id: 'charizard-brand-2024',
    title: 'Charizard Brand Identity Challenge',
    description:
      "Create a complete brand identity system using Charizard's fiery color palette. Design a logo, business cards, and social media templates.",
    pokemon: 'charizard',
    category: 'branding',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    participants: 47,
    submissions: 23,
    status: 'active',
    prize: 'Featured on homepage + Design spotlight',
    requirements: [
      'Logo design using Charizard colors',
      'Business card mockup',
      'Social media template set',
      'Brand guidelines document',
    ],
    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#2E2E2E', '#FFFFFF'],
    difficulty: 'intermediate',
  },
  {
    id: 'pikachu-app-2024',
    title: 'Pikachu Mobile App UI Challenge',
    description:
      "Design a mobile app interface inspired by Pikachu's bright and energetic personality. Focus on user experience and accessibility.",
    pokemon: 'pikachu',
    category: 'mobile-app',
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    participants: 32,
    submissions: 8,
    status: 'active',
    prize: 'Community choice award + Portfolio feature',
    requirements: [
      'App icon design',
      'Main screen mockup',
      'Navigation flow',
      'Color accessibility compliance',
    ],
    colors: ['#FFD23F', '#FFE066', '#FFF2CC', '#2E2E2E', '#FFFFFF'],
    difficulty: 'beginner',
  },
  {
    id: 'umbreon-night-2024',
    title: 'Umbreon Night Mode Challenge',
    description:
      "Create a dark theme design system using Umbreon's mysterious and elegant color palette. Perfect for apps, websites, or digital art.",
    pokemon: 'umbreon',
    category: 'web-design',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    participants: 0,
    submissions: 0,
    status: 'upcoming',
    prize: 'Premium design tools subscription',
    requirements: [
      'Dark theme color palette',
      'UI component set',
      'Typography system',
      'Accessibility considerations',
    ],
    colors: ['#2E2E2E', '#4A4A4A', '#6B6B6B', '#8B8B8B', '#F0F0F0'],
    difficulty: 'advanced',
  },
  {
    id: 'bulbasaur-eco-2024',
    title: 'Bulbasaur Eco-Friendly Challenge',
    description:
      "Design sustainable packaging or eco-friendly product concepts using Bulbasaur's natural green color palette.",
    pokemon: 'bulbasaur',
    category: 'product-design',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    participants: 28,
    submissions: 19,
    status: 'completed',
    prize: 'Sustainable design award',
    requirements: [
      'Product packaging design',
      'Sustainability statement',
      'Material considerations',
      'Lifecycle analysis',
    ],
    colors: ['#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9'],
    difficulty: 'intermediate',
  },
];

interface PokemonCardData {
  officialArt: string;
  types: string[];
  number: number;
  colors: string[];
}

async function fetchPokemonCardData(pokemon: string): Promise<PokemonCardData> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await response.json();
    const officialArt = data.sprites.other['official-artwork'].front_default;
    const types = data.types.map((t: { type: { name: string } }) => t.type.name);
    const number = data.id;
    // Use the first 5 colors from the artwork (fallback to challenge colors if needed)
    // We'll use the existing challenge colors for now, but you can integrate ColorThief or similar for real extraction
    return { officialArt, types, number, colors: [] };
  } catch (error) {
    // Log the error for debugging and monitoring purposes
    logger.error('Failed to fetch Pokemon card data', error, {
      pokemon,
      endpoint: 'https://pokeapi.co/api/v2/pokemon/',
      function: 'fetchPokemonCardData',
    });

    return { officialArt: '', types: [], number: 0, colors: [] };
  }
}

export default function ChallengesPage() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [_selectedChallenge, _setSelectedChallenge] = useState<Challenge | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [pokemonData, setPokemonData] = useState<Record<string, PokemonCardData>>({});

  useEffect(() => {
    // Create AbortController for cleanup
    const abortController = new AbortController();
    const isMounted = { current: true };

    // Fetch Pokémon data for all challenges
    const fetchPokemonData = async () => {
      try {
        for (const challenge of challenges) {
          // Check if component is still mounted
          if (!isMounted.current || abortController.signal.aborted) {
            return;
          }

          // Only fetch if we don't already have the data
          if (!pokemonData[challenge.pokemon]) {
            const data = await fetchPokemonCardData(challenge.pokemon);

            // Check again before updating state
            if (isMounted.current && !abortController.signal.aborted) {
              setPokemonData(prev => ({ ...prev, [challenge.pokemon]: data }));
            }
          }
        }
      } catch (error) {
        // Only log error if component is still mounted
        if (isMounted.current && !abortController.signal.aborted) {
          logger.error('Failed to fetch Pokemon data for challenges', error, {
            challenges: challenges.map(c => c.pokemon),
          });
        }
      }
    };

    fetchPokemonData();

    // Cleanup function
    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, [challenges, pokemonData]);

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    return challenge.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleJoinChallenge = (challenge: Challenge) => {
    if (!isSignedIn) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to join design challenges.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Challenge joined!',
      description: `You've joined the ${challenge.title}. Start creating!`,
    });
  };

  const _handleSubmitDesign = (challenge: Challenge) => {
    if (!isSignedIn) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit your design.',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to submit design page with challenge context using Next.js router
    router.push(`/submit-design?challenge=${challenge.id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const _itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              Design Competitions
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Design Challenges
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Put your Pokemon palette skills to the test with community challenges. Compete,
              create, and win amazing prizes!
            </p>

            {!isSignedIn ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-8 mb-8 max-w-lg mx-auto"
              >
                <div className="text-5xl mb-4">🏆</div>
                <h2 className="text-2xl font-semibold mb-4">Join the Competition</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Sign in to participate in challenges, win prizes, and showcase your creative
                  skills to the community.
                </p>
                <SignInButton mode="modal">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="w-5 h-5" />
                    Sign In to Compete
                  </Button>
                </SignInButton>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <SubmitDesignDialog>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Submit Design
                  </Button>
                </SubmitDesignDialog>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <Link href="/explore">
                    <Star className="w-5 h-5" />
                    View Gallery
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{challenges.length}</div>
                <div className="text-sm text-muted-foreground">Total Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {challenges.reduce((acc, c) => acc + c.participants, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Active Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {challenges.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Live Challenges</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {[
            { value: 'all', label: 'All Challenges', count: challenges.length, icon: Trophy },
            {
              value: 'active',
              label: 'Active',
              count: challenges.filter(c => c.status === 'active').length,
              icon: Zap,
            },
            {
              value: 'upcoming',
              label: 'Upcoming',
              count: challenges.filter(c => c.status === 'upcoming').length,
              icon: Clock,
            },
            {
              value: 'completed',
              label: 'Completed',
              count: challenges.filter(c => c.status === 'completed').length,
              icon: Award,
            },
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.value}
                onClick={() => setFilter(tab.value as 'all' | 'active' | 'upcoming' | 'completed')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl transition-all text-sm font-medium backdrop-blur-sm border ${
                  filter === tab.value
                    ? 'bg-primary text-primary-foreground scale-105'
                    : 'bg-card/80 border-border/50 hover:bg-accent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tab.count}
                  </Badge>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Enhanced Challenges Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <AnimatePresence mode="wait">
            {filteredChallenges.map((challenge, _index) => {
              const poke = pokemonData[challenge.pokemon];
              const primaryColor = challenge.colors?.[0] || '#6366f1';

              return (
                <motion.div
                  key={challenge.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  layout
                  className="group"
                >
                  <Card className="overflow-hidden transition-shadow duration-300 bg-card border">
                    {/* Simplified Pokemon Artwork Section */}
                    <div
                      className="relative flex flex-col items-center p-6"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}10, transparent)`,
                      }}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge
                          className={`${getStatusColor(challenge.status)} text-white capitalize`}
                        >
                          {challenge.status === 'active' && <Zap className="w-3 h-3 mr-1" />}
                          {challenge.status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
                          {challenge.status === 'completed' && <Award className="w-3 h-3 mr-1" />}
                          {challenge.status}
                        </Badge>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="text-xs">
                          {challenge.category.replace('-', ' ')}
                        </Badge>
                      </div>

                      {/* Pokemon Artwork */}
                      <div className="mb-4">
                        {poke?.officialArt ? (
                          <Image
                            src={poke.officialArt}
                            alt={challenge.pokemon}
                            width={128}
                            height={128}
                            className="w-32 h-32 object-contain"
                          />
                        ) : (
                          <div className="w-32 h-32 flex items-center justify-center bg-muted rounded-xl border-2 border-dashed">
                            <Palette className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Pokemon Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs font-mono">
                          #{poke?.number?.toString().padStart(3, '0') || '???'}
                        </Badge>
                        <span className="capitalize font-bold text-lg">{challenge.pokemon}</span>
                      </div>

                      {/* Pokemon Types */}
                      <div className="flex gap-1">
                        {poke?.types?.map(type => (
                          <TypeBadge key={type} type={type as PokemonTypeNames} />
                        ))}
                      </div>
                    </div>

                    <CardHeader className="pb-4 px-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold line-clamp-2 mb-2">
                            {challenge.title}
                          </CardTitle>
                        </div>
                        <Badge
                          className={`${getDifficultyColor(
                            challenge.difficulty
                          )} shrink-0 font-medium`}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {challenge.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0 px-6 pb-6 space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                          <Users className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-bold">{challenge.participants}</div>
                            <div className="text-xs text-muted-foreground">Participants</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                          <Target className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-bold">{challenge.submissions}</div>
                            <div className="text-xs text-muted-foreground">Submissions</div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Section */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">
                                Ends {new Date(challenge.endDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Started {new Date(challenge.startDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {challenge.status === 'active' && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {getDaysRemaining(challenge.endDate)} days left
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Prize Section */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Prize & Rewards</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed ml-6">
                          {challenge.prize}
                        </p>
                      </div>

                      {/* Progress Bar for Active Challenges */}
                      {challenge.status === 'active' && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Submission Progress</span>
                            </div>
                            <span className="text-sm font-bold">
                              {Math.round(
                                (challenge.submissions / Math.max(challenge.participants, 1)) * 100
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              (challenge.submissions / Math.max(challenge.participants, 1)) * 100
                            }
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Requirements Section */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Challenge Requirements</span>
                        </div>
                        <div className="space-y-1">
                          {challenge.requirements.slice(0, 2).map((req, _reqIndex) => (
                            <div
                              key={_reqIndex}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="leading-relaxed">{req}</span>
                            </div>
                          ))}
                          {challenge.requirements.length > 2 && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="font-medium">
                                +{challenge.requirements.length - 2} more requirements
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3">
                        {challenge.status === 'active' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleJoinChallenge(challenge)}
                              className="flex-1"
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Join Challenge
                            </Button>
                            <SubmitDesignDialog prefilledPokemon={challenge.pokemon}>
                              <Button size="sm" className="flex-1">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Submit Design
                              </Button>
                            </SubmitDesignDialog>
                          </>
                        ) : challenge.status === 'upcoming' ? (
                          <Button variant="outline" size="sm" className="w-full" disabled>
                            <Clock className="w-4 h-4 mr-2" />
                            Coming Soon
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full" disabled>
                            <Award className="w-4 h-4 mr-2" />
                            Challenge Ended
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-12 text-center"
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative">
            <div className="text-5xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold mb-4">Ready to Show Your Skills?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Join our design challenges to showcase your Pokemon palette skills, win amazing
              prizes, and connect with a community of creative designers from around the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link href="/explore">
                  <Star className="w-5 h-5" />
                  View Submissions
                </Link>
              </Button>
              <SubmitDesignDialog>
                <Button size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Submit Your Design
                </Button>
              </SubmitDesignDialog>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
