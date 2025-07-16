import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Sparkles, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Design } from '@/types/pokemon';

interface TrendingDesignsProps {
  designs: Design[];
}

const TrendingDesigns = ({ designs }: TrendingDesignsProps) => (
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
                  <div className="w-full h-full flex items-center justify-center text-2xl">🎨</div>
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
                  <span className="text-sm text-muted-foreground">{design.likes} likes</span>
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
);

export default TrendingDesigns;
