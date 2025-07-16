import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Heart, User, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Design } from '@/types/pokemon';

interface FeaturedDesignsProps {
  designs: Design[];
  isLiked: (id: number) => boolean;
  toggleLike: (design: any) => void;
}

const FeaturedDesigns = ({ designs, isLiked, toggleLike }: FeaturedDesignsProps) => (
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
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🎨</div>
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
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
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
);

export default FeaturedDesigns;
