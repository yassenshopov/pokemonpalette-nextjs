import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Design } from '@/types/pokemon';

interface Category {
  value: string;
  label: string;
}

interface PopularCategoriesProps {
  categories: Category[];
  designs: Design[];
  setSelectedCategory: (category: string) => void;
}

const PopularCategories = ({
  categories,
  designs,
  setSelectedCategory,
}: PopularCategoriesProps) => (
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
);

export default PopularCategories;
