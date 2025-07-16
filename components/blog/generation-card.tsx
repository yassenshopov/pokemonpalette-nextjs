import { Card, CardContent } from '@/components/ui/card';

interface GenerationCardProps {
  generation: {
    number: number;
    name: string;
    year: string;
    designPhilosophy: string;
    innovations: string[];
  };
}

export function GenerationCard({ generation }: GenerationCardProps) {
  return (
    <Card className="border shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-bold text-primary text-sm">G{generation.number}</span>
          </div>
          <div>
            <h3 className="font-semibold">{generation.name}</h3>
            <p className="text-xs text-muted-foreground">{generation.year}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{generation.designPhilosophy}</p>
        <div className="space-y-2">
          <div className="text-xs font-medium">Key Innovations:</div>
          {generation.innovations.slice(0, 2).map((innovation, idx) => (
            <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>{innovation}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
