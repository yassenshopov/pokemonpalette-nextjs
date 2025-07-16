import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Sparkles, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Design } from '@/types/pokemon';
import { useRouter } from 'next/navigation';

interface TrendingDesignsProps {
  designs: Design[];
}

const TrendingDesigns = ({ designs }: TrendingDesignsProps) => {
  const router = useRouter();

  const handleViewAll = () => {
    // Navigate to showcase page to view all designs
    router.push('/showcase');
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Trending Designs</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!designs || designs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-lg mb-2">No trending designs yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to create a trending design! Share your Pokemon-inspired artwork with
                the community.
              </p>
              <Button asChild>
                <Link href="/submit-design">Create Design</Link>
              </Button>
            </div>
          ) : (
            (() => {
              const trendingDesigns = designs.sort((a, b) => b.likes - a.likes).slice(0, 3);

              if (trendingDesigns.length === 0) {
                return (
                  <div className="text-center py-6">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No trending designs available</p>
                  </div>
                );
              }

              return trendingDesigns.map(design => (
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
                      <span className="text-sm text-muted-foreground">{design.likes} likes</span>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/showcase/${design.id}`}>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ));
            })()
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingDesigns;
