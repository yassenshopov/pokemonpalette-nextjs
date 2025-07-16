'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import {
  Heart,
  Palette,
  Calendar,
  User,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Trophy,
  Eye,
  MessageSquare,
  Star,
  ArrowLeft,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getUserById, getDesignsByUser, type MockUser, type MockDesign } from '@/data/mockData';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<MockUser | null>(null);
  const [designs, setDesigns] = useState<MockDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('designs');

  useEffect(() => {
    // Load user and designs from mock data
    const loadUser = () => {
      setLoading(true);

      const foundUser = getUserById(userId);
      const userDesigns = getDesignsByUser(userId);

      setUser(foundUser || null);
      setDesigns(userDesigns);
      setLoading(false);
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">User not found</h1>
            <p className="text-muted-foreground">
              The user profile you're looking for doesn't exist or may have been removed.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/explore" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">Explore Palettes</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const publishedDesigns = designs.filter(d => d.status === 'published' || d.status === 'featured');
  const featuredDesigns = designs.filter(d => d.status === 'featured');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/showcase" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase
          </Link>
        </Button>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="text-2xl font-bold">
                  {user.fullName
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{user.fullName}</h1>
                  {user.isVerified && <VerifiedBadge size="lg" variant="blue" />}
                </div>
                <p className="text-xl text-muted-foreground">@{user.username}</p>
                <p className="text-muted-foreground max-w-2xl">{user.bio}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Portfolio
                    </a>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined{' '}
                    {new Date(user.joinedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="lg:ml-auto">
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Follow
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{user.stats.totalDesigns}</div>
            <div className="text-sm text-muted-foreground">Designs</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-red-500">{user.stats.totalLikes}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-500">{user.stats.totalViews}</div>
            <div className="text-sm text-muted-foreground">Views</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-500">{user.stats.totalFollowers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-500">{user.stats.totalFollowing}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </Card>
        </div>

        {/* Achievements - Pokemon Gym Badge Style */}
        {user.badges.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500 rounded-full">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Gym Badges Earned</h2>
                <p className="text-sm text-muted-foreground">
                  {user.badges.length} achievements unlocked
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {user.badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="relative">
                    {/* Badge Circle */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 p-0.5 transition-all duration-300 group-hover:scale-105">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-amber-800" />
                      </div>
                    </div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-50"></div>
                  </div>
                  <span className="text-xs font-medium mt-2 text-center line-clamp-2 max-w-16">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-muted/50">
            <TabsTrigger
              value="designs"
              className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Palette className="w-4 h-4" />
              All Designs ({publishedDesigns.length})
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              <Star className="w-4 h-4" />
              Featured ({featuredDesigns.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designs" className="space-y-6">
            {publishedDesigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedDesigns.map((design, index) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DesignCard design={design} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Palette}
                title="No designs published yet"
                description="This user hasn't shared any designs with the community yet."
              />
            )}
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            {featuredDesigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDesigns.map((design, index) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DesignCard design={design} featured />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Star}
                title="No featured designs yet"
                description="This user hasn't had any designs featured by the community yet."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Design Card Component
function DesignCard({ design, featured = false }: { design: MockDesign; featured?: boolean }) {
  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 ${
        featured ? 'border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5' : ''
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 relative">
        {design.imageUrl ? (
          <img
            src={design.imageUrl}
            alt={design.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-30">🎨</div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        {featured && (
          <Badge className="absolute top-3 right-3 bg-primary">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}

        {/* Quick Action */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
          asChild
        >
          <Link href={`/explore/${design.id}`}>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Title and Pokemon */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {design.title}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">{design.pokemon}</p>
          </div>

          {/* Color Palette */}
          <div className="flex gap-1">
            {design.colors.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-md border-2 border-background"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {design.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {design.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{design.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{design.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{design.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{design.comments}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {design.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="max-w-md mx-auto space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
