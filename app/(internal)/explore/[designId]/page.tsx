'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import {
  Heart,
  Bookmark,
  Share2,
  Download,
  Eye,
  MessageSquare,
  Calendar,
  User,
  ArrowLeft,
  ExternalLink,
  Copy,
  Palette,
  Star,
  Flag,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mockDesigns, getUserById, type MockDesign, type MockUser } from '@/data/mockData';
import { useSave } from '@/contexts/save-context';
import { useLikes } from '@/contexts/likes-context';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const designId = params.designId as string;
  const [design, setDesign] = useState<MockDesign | null>(null);
  const [creator, setCreator] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggleSave } = useSave();
  const { isLiked, toggleLike } = useLikes();
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    // Find design and creator from mock data
    const loadDesign = () => {
      setLoading(true);

      const foundDesign = mockDesigns.find(d => d.id === designId);
      if (foundDesign) {
        setDesign(foundDesign);
        const foundCreator = getUserById(foundDesign.userId);
        setCreator(foundCreator || null);
      }

      setLoading(false);
    };

    if (designId) {
      loadDesign();
    }
  }, [designId]);

  const handleLike = () => {
    if (!design) return;

    toggleLike({
      id: parseInt(design.id),
      title: design.title,
      creator: design.creator,
      pokemon: design.pokemon,
      category: design.category,
      likes: design.likes,
      createdAt: design.date,
      imageUrl: design.imageUrl,
      likedAt: new Date().toISOString(),
    });
  };

  const handleSave = () => {
    if (!design) return;

    toggleSave({
      id: parseInt(design.id),
      title: design.title,
      creator: design.creator,
      pokemon: design.pokemon,
      colors: design.colors,
      savedAt: new Date().toISOString(),
      imageUrl: design.imageUrl,
    });
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: 'Color copied!',
      description: `${color} has been copied to your clipboard.`,
      duration: 2000,
    });
  };

  const shareDesign = () => {
    if (navigator.share) {
      navigator.share({
        title: design?.title,
        text: `Check out this Pokemon-inspired design: ${design?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Design link has been copied to your clipboard.',
        duration: 2000,
      });
    }
  };

  const downloadPalette = () => {
    if (!design) return;

    const paletteData = {
      title: design.title,
      creator: design.creator,
      pokemon: design.pokemon,
      category: design.category,
      description: design.description,
      colors: design.colors,
      tags: design.tags,
      date: design.date,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${design.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_palette.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Palette downloaded!',
      description: `${design.title} palette has been downloaded as JSON.`,
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading design...</p>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Palette className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">Design not found</h1>
            <p className="text-muted-foreground">
              The design you're looking for doesn't exist or may have been removed.
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

  const isDesignSaved = isSaved(parseInt(design.id));
  const isDesignLiked = isLiked(parseInt(design.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/explore" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Design Image/Preview */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/10 relative">
                {design.imageUrl ? (
                  <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-8xl opacity-30">🎨</div>
                  </div>
                )}

                {/* Status Badge */}
                {design.status === 'featured' && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
            </Card>

            {/* Color Palette */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Palette
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {design.colors.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div
                        className="w-full h-20 rounded-lg border-2 border-background cursor-pointer transition-all hover:scale-105"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color)}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-mono text-muted-foreground">{color}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyColor(color)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Click on any color to copy its hex value to your clipboard.
                </p>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About this Design</h2>
              <p className="text-muted-foreground leading-relaxed">{design.description}</p>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Design Info */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{design.title}</h1>
                  <Badge variant="outline" className="capitalize">
                    {design.pokemon}
                  </Badge>
                </div>

                {/* Creator Info */}
                {creator && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={creator.avatar} alt={creator.fullName} />
                      <AvatarFallback>
                        {creator.fullName
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link
                        href={`/users/${creator.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {creator.fullName}
                      </Link>
                      {creator.isVerified && (
                        <VerifiedBadge size="sm" variant="blue" className="ml-2" />
                      )}
                      <p className="text-sm text-muted-foreground">@{creator.username}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/users/${creator.id}`}>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{design.likes}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{design.views}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{design.comments}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Published{' '}
                      {new Date(design.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {design.category}
                    </Badge>
                    <span>Category</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  className="w-full gap-2"
                  variant={isDesignLiked ? 'default' : 'outline'}
                  onClick={handleLike}
                >
                  <Heart className={`w-4 h-4 ${isDesignLiked ? 'fill-current' : ''}`} />
                  {isDesignLiked ? 'Liked' : 'Like Design'}
                </Button>

                <Button
                  className="w-full gap-2"
                  variant={isDesignSaved ? 'default' : 'outline'}
                  onClick={handleSave}
                >
                  <Bookmark className={`w-4 h-4 ${isDesignSaved ? 'fill-current' : ''}`} />
                  {isDesignSaved ? 'Saved' : 'Save Design'}
                </Button>

                <Button className="w-full gap-2" variant="outline" onClick={shareDesign}>
                  <Share2 className="w-4 h-4" />
                  Share Design
                </Button>

                <Button className="w-full gap-2" variant="outline" onClick={downloadPalette}>
                  <Download className="w-4 h-4" />
                  Download Palette
                </Button>
              </div>

              {/* More Actions */}
              <div className="mt-4 pt-4 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full gap-2">
                      <MoreHorizontal className="w-4 h-4" />
                      More Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Flag className="w-4 h-4 mr-2" />
                      Report Design
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Pokemon Page
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>

            {/* Related Designs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">More from {creator?.fullName}</h3>
              <div className="space-y-3">
                {mockDesigns
                  .filter(d => d.userId === design.userId && d.id !== design.id)
                  .slice(0, 3)
                  .map(relatedDesign => (
                    <Link
                      key={relatedDesign.id}
                      href={`/explore/${relatedDesign.id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-12 h-12 rounded bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center text-xl">
                          🎨
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                            {relatedDesign.title}
                          </h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {relatedDesign.pokemon}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Heart className="w-3 h-3 inline mr-1" />
                          {relatedDesign.likes}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
