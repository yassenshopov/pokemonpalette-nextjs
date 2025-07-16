import { Button } from '../ui/button';
import { Crown, Download, Share2, Zap } from 'lucide-react';

const ProFeaturesBanner = () => (
  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border rounded-lg p-6 mb-8">
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="flex-1 text-center lg:text-left">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Unlock Pro Features</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Take your designs to the next level with premium features
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <span className="text-sm">Download Palettes</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <span className="text-sm">Share Collections</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">AI Color Suggestions</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Button size="lg" className="gap-2">
          <Crown className="w-5 h-5" />
          Upgrade to Pro
        </Button>
      </div>
    </div>
  </div>
);

export default ProFeaturesBanner;
