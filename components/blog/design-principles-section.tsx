import { BlogSection } from '@/components/ui/blog-components';
import { HighlightBox } from '@/components/ui/blog-components';
import { Gamepad2, Palette } from 'lucide-react';

export function DesignPrinciplesSection() {
  return (
    <BlogSection
      title="The Foundation Years (Gen I-II)"
      description="The first two generations established the core principles that still guide Pokemon design today."
    >
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <HighlightBox
          title="Generation I: Simplicity is Key"
          icon={<Gamepad2 className="w-6 h-6 text-green-600" />}
          variant="success"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Working with Game Boy's monochrome display, designers focused on creating strong
            silhouettes that would be instantly recognizable even at tiny sizes.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>8x8 pixel sprites</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Monochrome design</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Strong silhouettes</span>
            </div>
          </div>
        </HighlightBox>

        <HighlightBox
          title="Generation II: Color Revolution"
          icon={<Palette className="w-6 h-6 text-blue-600" />}
          variant="info"
        >
          <p className="text-sm text-muted-foreground mb-4">
            The Game Boy Color introduced limited color palettes, forcing designers to be strategic
            about color choices and establish type-color associations.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>56 colors available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Type-color psychology</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Day/night variations</span>
            </div>
          </div>
        </HighlightBox>
      </div>
    </BlogSection>
  );
}
