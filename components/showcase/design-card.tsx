import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bookmark, Heart, Calendar, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Design } from '@/types/pokemon';

interface DesignCardProps {
  design: Design;
  isSaved: (id: number) => boolean;
  isLiked: (id: number) => boolean;
  toggleSave: (design: any) => void;
  toggleLike: (design: any) => void;
}

const DesignCard = ({ design, isSaved, isLiked, toggleSave, toggleLike }: DesignCardProps) => (
  <Card className="overflow-hidden transition-shadow group">
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
            transition={{ duration: 0.5, ease: 'easeInOut' }}
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
            transition={{ duration: 0.6, ease: 'easeInOut' }}
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
        <Link href={`/showcase/${design.id}`}>
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
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{design.description}</p>
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
      <Button asChild className="w-full gap-2">
        <Link href={`/showcase/${design.id}`}>
          View Design
          <ExternalLink className="w-4 h-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default DesignCard;
