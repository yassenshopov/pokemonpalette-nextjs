import { BlogSection } from '@/components/ui/blog-components';
import { HighlightBox } from '@/components/ui/blog-components';
import { Globe, Sparkles, Heart } from 'lucide-react';

export function FutureOfDesignSection() {
  return (
    <BlogSection
      title="The Future of Pokemon Design"
      description="As technology continues to advance, Pokemon design is entering a new era of possibilities and challenges."
    >
      <div className="grid md:grid-cols-3 gap-6">
        <HighlightBox
          title="Global Cultural Integration"
          icon={<Globe className="w-6 h-6 text-indigo-600" />}
          variant="default"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Modern Pokemon designs draw inspiration from cultures around the world, creating
            creatures that resonate with diverse audiences.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Regional folklore integration</li>
            <li>• Cultural symbolism</li>
            <li>• Global accessibility</li>
          </ul>
        </HighlightBox>

        <HighlightBox
          title="Advanced Animation Systems"
          icon={<Sparkles className="w-6 h-6 text-purple-600" />}
          variant="default"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Next-generation hardware enables more complex animations and personality expression
            through movement and behavior.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Procedural animations</li>
            <li>• Personality-driven behaviors</li>
            <li>• Environmental interactions</li>
          </ul>
        </HighlightBox>

        <HighlightBox
          title="Emotional Connection"
          icon={<Heart className="w-6 h-6 text-pink-600" />}
          variant="default"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Designers focus on creating Pokemon that form deep emotional bonds with players through
            relatable characteristics and stories.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Environmental storytelling</li>
            <li>• Cultural authenticity</li>
            <li>• Accessibility focus</li>
          </ul>
        </HighlightBox>
      </div>
    </BlogSection>
  );
}
