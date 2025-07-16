import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/type-badge';
import {
  BlogHero,
  BlogSection,
  PokemonCard,
  StepCard,
  CallToAction,
  RelatedArticle,
  HighlightBox,
  BlogIcons,
} from '@/components/ui/blog-components';
import {
  Gamepad2,
  Palette,
  Cpu,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
  BookOpen,
  Calendar,
  Monitor,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Evolution of Pokemon Design: From Red to Scarlet - Pokemon Palette Blog',
  description:
    'Explore how Pokemon design and color choices have evolved across generations, from Game Boy limitations to modern 3D masterpieces.',
  keywords: [
    'pokemon design evolution',
    'pokemon art history',
    'game boy pokemon',
    'pokemon generations',
    'pokemon 3d design',
    'nintendo design',
    'pixel art pokemon',
    'pokemon development',
  ],
  openGraph: {
    title: 'The Evolution of Pokemon Design: From Red to Scarlet',
    description: 'Explore how Pokemon design and color choices have evolved across generations.',
    images: ['https://pokemonpalette.com/og-image.webp'],
  },
};

// Generation data with key Pokemon examples
const generations = [
  {
    number: 1,
    name: 'Generation I',
    games: ['Red', 'Blue', 'Yellow'],
    year: '1996-1998',
    platform: 'Game Boy',
    colors: 4,
    resolution: '160x144',
    keyPokemon: [
      { name: 'Pikachu', id: 25, innovation: 'Iconic mascot design' },
      { name: 'Charizard', id: 6, innovation: 'Dragon-like without being Dragon-type' },
      { name: 'Mewtwo', id: 150, innovation: 'Legendary psychic design' },
    ],
    designPhilosophy: 'Simple, recognizable silhouettes that work in monochrome',
    technicalLimitations: 'Monochrome display, 8x8 pixel sprites, limited memory',
    colorPalette: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
    innovations: [
      'Established core design principles',
      'Created iconic silhouettes',
      'Balanced cute and cool aesthetics',
    ],
  },
  {
    number: 2,
    name: 'Generation II',
    games: ['Gold', 'Silver', 'Crystal'],
    year: '1999-2001',
    platform: 'Game Boy Color',
    colors: 56,
    resolution: '160x144',
    keyPokemon: [
      { name: 'Lugia', id: 249, innovation: 'First legendary with wings prominently featured' },
      { name: 'Ho-Oh', id: 250, innovation: 'Rainbow-colored legendary' },
      { name: 'Celebi', id: 251, innovation: 'Time-travel mythical design' },
    ],
    designPhilosophy: "Color as storytelling - each Pokemon's palette tells its story",
    technicalLimitations: 'Limited color palette per sprite, still pixel-based',
    colorPalette: ['#000000', '#555555', '#aaaaaa', '#ffffff'],
    innovations: [
      'Introduction of color psychology',
      'Day/night cycle affecting colors',
      'Gender differences in design',
      'Baby Pokemon introduced',
    ],
  },
  {
    number: 3,
    name: 'Generation III',
    games: ['Ruby', 'Sapphire', 'Emerald'],
    year: '2002-2005',
    platform: 'Game Boy Advance',
    colors: 32768,
    resolution: '240x160',
    keyPokemon: [
      { name: 'Rayquaza', id: 384, innovation: 'Serpentine legendary with flowing design' },
      { name: 'Blaziken', id: 257, innovation: 'Humanoid starter evolution' },
      { name: 'Gardevoir', id: 282, innovation: 'Elegant, dress-like Pokemon' },
    ],
    designPhilosophy: 'Organic shapes and natural color gradients',
    technicalLimitations: 'Higher resolution but still 2D sprites',
    colorPalette: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    innovations: [
      'More complex color palettes',
      'Abilities affecting design choices',
      'Weather-based design elements',
      'Contest-focused beauty designs',
    ],
  },
  {
    number: 4,
    name: 'Generation IV',
    games: ['Diamond', 'Pearl', 'Platinum'],
    year: '2006-2009',
    platform: 'Nintendo DS',
    colors: 32768,
    resolution: '256x192 (dual screen)',
    keyPokemon: [
      { name: 'Dialga', id: 483, innovation: 'Mechanical/organic fusion design' },
      { name: 'Palkia', id: 484, innovation: 'Space-themed pearl aesthetics' },
      { name: 'Arceus', id: 493, innovation: 'Divine, minimalist legendary' },
    ],
    designPhilosophy: 'Mythology meets technology - divine and mechanical themes',
    technicalLimitations: 'Dual screens, touch capabilities, still 2D',
    colorPalette: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    innovations: [
      'Physical/Special split affecting designs',
      'Legendary trios with thematic unity',
      'More detailed sprite animations',
      'Gender differences expanded',
    ],
  },
  {
    number: 5,
    name: 'Generation V',
    games: ['Black', 'White', 'Black 2', 'White 2'],
    year: '2010-2012',
    platform: 'Nintendo DS',
    colors: 32768,
    resolution: '256x192',
    keyPokemon: [
      { name: 'Reshiram', id: 644, innovation: 'Pure white legendary with blue flames' },
      { name: 'Zekrom', id: 644, innovation: 'Pure black legendary with red electricity' },
      { name: 'Kyurem', id: 646, innovation: 'Ice legendary with fusion capabilities' },
    ],
    designPhilosophy: 'Truth vs Ideals - contrasting designs with deeper meaning',
    technicalLimitations: 'Enhanced 2D with pseudo-3D effects',
    colorPalette: ['#000000', '#ffffff', '#3498db', '#e74c3c'],
    innovations: [
      'Seasonal design changes',
      'Form changes mid-battle',
      'More animated sprites',
      'Contrasting legendary designs',
    ],
  },
  {
    number: 6,
    name: 'Generation VI',
    games: ['X', 'Y'],
    year: '2013-2014',
    platform: 'Nintendo 3DS',
    colors: 'Full color (16.77 million)',
    resolution: '400x240 (3D capable)',
    keyPokemon: [
      { name: 'Xerneas', id: 716, innovation: 'Majestic deer with rainbow antlers' },
      { name: 'Yveltal', id: 717, innovation: 'Dark bird with red and black wings' },
      { name: 'Greninja', id: 658, innovation: 'Ninja frog with tongue scarf' },
    ],
    designPhilosophy: 'Life and Destruction - 3D models allow for dynamic poses',
    technicalLimitations: 'First 3D Pokemon games, learning 3D design',
    colorPalette: ['#ff9a9e', '#fecfef', '#fecfef', '#ffecd2'],
    innovations: [
      'Full 3D models and animations',
      'Mega Evolution designs',
      'Character customization',
      'Fairy type introduction',
    ],
  },
  {
    number: 7,
    name: 'Generation VII',
    games: ['Sun', 'Moon', 'Ultra Sun', 'Ultra Moon'],
    year: '2016-2017',
    platform: 'Nintendo 3DS',
    colors: 'Full color',
    resolution: '400x240',
    keyPokemon: [
      { name: 'Solgaleo', id: 791, innovation: 'Lion legendary representing the sun' },
      { name: 'Lunala', id: 792, innovation: 'Bat legendary representing the moon' },
      { name: 'Necrozma', id: 800, innovation: 'Prism Pokemon with light absorption' },
    ],
    designPhilosophy: 'Tropical paradise meets cosmic horror - regional variants',
    technicalLimitations: '3DS hardware limitations for complex animations',
    colorPalette: ['#ffeaa7', '#fd79a8', '#a29bfe', '#6c5ce7'],
    innovations: [
      'Regional variant designs',
      'Z-Move specific animations',
      'Ultra Beast alien designs',
      'Totem Pokemon size variants',
    ],
  },
  {
    number: 8,
    name: 'Generation VIII',
    games: ['Sword', 'Shield'],
    year: '2019',
    platform: 'Nintendo Switch',
    colors: 'Full color (HDR)',
    resolution: '1920x1080 (docked)',
    keyPokemon: [
      { name: 'Zacian', id: 888, innovation: 'Legendary wolf with sword' },
      { name: 'Zamazenta', id: 889, innovation: 'Legendary wolf with shield' },
      { name: 'Dragapult', id: 887, innovation: 'Stealth bomber dragon' },
    ],
    designPhilosophy: 'British inspiration meets modern gaming - Dynamax scale',
    technicalLimitations: 'First HD Pokemon, balancing performance with quality',
    colorPalette: ['#74b9ff', '#0984e3', '#a29bfe', '#6c5ce7'],
    innovations: [
      'Dynamax gigantic designs',
      'Galarian regional forms',
      'HD textures and lighting',
      'Open world Wild Area',
    ],
  },
  {
    number: 9,
    name: 'Generation IX',
    games: ['Scarlet', 'Violet'],
    year: '2022',
    platform: 'Nintendo Switch',
    colors: 'Full color (HDR)',
    resolution: '1920x1080',
    keyPokemon: [
      { name: 'Koraidon', id: 1007, innovation: 'Ancient legendary with organic design' },
      { name: 'Miraidon', id: 1008, innovation: 'Future legendary with technological design' },
      { name: 'Gimmighoul', id: 999, innovation: 'Treasure chest Pokemon' },
    ],
    designPhilosophy: 'Past vs Future - open world exploration with time themes',
    technicalLimitations: 'Open world rendering challenges, performance optimization',
    colorPalette: ['#ff7675', '#fd79a8', '#fdcb6e', '#e17055'],
    innovations: [
      'Terastallization crystal designs',
      'Paradox Pokemon (past/future)',
      'Full open world design',
      'Time-based design philosophy',
    ],
  },
];

const designEvolutionSteps = [
  {
    step: 1,
    title: 'Silhouette First',
    description: 'Strong, recognizable shapes that work at any size',
    icon: <Monitor className="w-4 h-4 text-muted-foreground" />,
  },
  {
    step: 2,
    title: 'Color Psychology',
    description: 'Colors that match personality and type associations',
    icon: <Palette className="w-4 h-4 text-muted-foreground" />,
  },
  {
    step: 3,
    title: 'Technical Adaptation',
    description: 'Designs that work within hardware limitations',
    icon: <Cpu className="w-4 h-4 text-muted-foreground" />,
  },
  {
    step: 4,
    title: 'Cultural Relevance',
    description: 'Incorporating regional and cultural elements',
    icon: <Users className="w-4 h-4 text-muted-foreground" />,
  },
];

const GenerationTimeline = () => (
  <div className="relative">
    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
    <div className="space-y-8">
      {generations.slice(0, 4).map((gen, index) => (
        <div key={gen.number} className="relative flex items-start gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-none relative z-10">
            <span className="font-bold text-primary">Gen {gen.number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{gen.name}</h3>
              <Badge variant="outline">{gen.year}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{gen.designPhilosophy}</p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{gen.platform}</span>
              <span>•</span>
              <span>{gen.colors} colors</span>
              <span>•</span>
              <span>{gen.resolution}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function EvolutionOfPokemonDesignPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHero
        title="The Evolution of Pokemon Design: From Red to Scarlet"
        description="Journey through nearly three decades of Pokemon design evolution, from Game Boy pixels to Switch HD graphics, and discover how technical limitations shaped iconic creatures."
        category="Design History"
        readTime="12 min read"
        date="December 20, 2024"
      >
        <GenerationTimeline />
      </BlogHero>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Introduction */}
        <BlogSection
          title="The Journey from Pixels to Polygons"
          description="Pokemon design has undergone a remarkable transformation since 1996. What started as simple 8x8 pixel sprites has evolved into complex 3D models with intricate animations. This evolution reflects not just advancing technology, but also changing artistic philosophies and cultural influences."
        />

        {/* Early Generations */}
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
                The Game Boy Color introduced limited color palettes, forcing designers to be
                strategic about color choices and establish type-color associations.
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

          <div className="grid md:grid-cols-3 gap-6">
            {generations.slice(0, 3).map(gen => (
              <Card key={gen.number} className="border shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary text-sm">G{gen.number}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{gen.name}</h3>
                      <p className="text-xs text-muted-foreground">{gen.year}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{gen.designPhilosophy}</p>
                  <div className="space-y-2">
                    <div className="text-xs font-medium">Key Innovations:</div>
                    {gen.innovations.slice(0, 2).map((innovation, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-muted-foreground flex items-start gap-2"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{innovation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </BlogSection>

        {/* 3D Transition */}
        <BlogSection
          title="The 3D Revolution (Gen VI-VII)"
          description="Generation VI marked the biggest shift in Pokemon design history - the move from 2D sprites to 3D models. This transition changed everything about how Pokemon were designed and animated."
        >
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800 shadow-none">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-600" />
                      The 3D Challenge
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Moving to 3D meant redesigning every single Pokemon from scratch. Designers
                      had to consider how each creature would look from every angle, not just the
                      front view players were used to.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span>721 Pokemon redesigned for 3D</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span>New animation systems</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span>360-degree design considerations</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center mb-2">
                          <span className="text-xs text-gray-500">2D Sprite</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Single angle</p>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-lg border-2 border-purple-300 flex items-center justify-center mb-2">
                          <span className="text-xs text-purple-700 dark:text-purple-200">
                            3D Model
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">All angles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {generations.slice(5, 7).map(gen => (
              <Card key={gen.number} className="border shadow-none">
                <div
                  className="h-32 border-b flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${gen.colorPalette[0]}40, ${gen.colorPalette[1]}40)`,
                  }}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{gen.name}</h3>
                    <p className="text-sm opacity-75">{gen.games.join(', ')}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">{gen.designPhilosophy}</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Pokemon:</h4>
                      <div className="space-y-1">
                        {gen.keyPokemon.map((pokemon, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground">
                            <span className="font-medium">{pokemon.name}:</span>{' '}
                            {pokemon.innovation}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Technical Specs:</h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Platform: {gen.platform}</div>
                        <div>Colors: {gen.colors}</div>
                        <div>Resolution: {gen.resolution}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </BlogSection>

        {/* Modern Era */}
        <BlogSection
          title="The Modern Era (Gen VIII-IX)"
          description="Recent generations have embraced HD graphics, open-world design, and new gameplay mechanics that influence Pokemon design in unprecedented ways."
        >
          <div className="space-y-8">
            {generations.slice(7, 9).map((gen, index) => (
              <Card key={gen.number} className="overflow-hidden border shadow-none">
                <div className="grid md:grid-cols-3 gap-0">
                  <div
                    className="relative h-48 md:h-auto flex items-center justify-center p-8 border-r"
                    style={{
                      background: `linear-gradient(135deg, ${gen.colorPalette[0]}30, ${gen.colorPalette[1]}30)`,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">Gen {gen.number}</div>
                      <div className="text-sm opacity-75">{gen.year}</div>
                      <div className="mt-4">
                        <Badge variant="outline">{gen.platform}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold">{gen.name}</h3>
                      <div className="flex gap-2">
                        {gen.games.map(game => (
                          <Badge key={game} variant="secondary">
                            {game}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Design Philosophy: {gen.designPhilosophy}
                      </h4>
                      <p className="text-muted-foreground mb-4">{gen.technicalLimitations}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Key Innovations:</h5>
                        <ul className="space-y-1">
                          {gen.innovations.slice(0, 3).map((innovation, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{innovation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Technical Specs:</h5>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>Colors: {gen.colors}</div>
                          <div>Resolution: {gen.resolution}</div>
                          <div>Platform: {gen.platform}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </BlogSection>

        {/* Design Principles */}
        <BlogSection
          title="Timeless Design Principles"
          description="Despite technological advances, certain design principles have remained constant throughout Pokemon's evolution."
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 shadow-none">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {designEvolutionSteps.slice(0, 2).map(step => (
                    <StepCard
                      key={step.step}
                      step={step.step}
                      title={step.title}
                      description={step.description}
                      icon={step.icon}
                    />
                  ))}
                </div>
                <div className="space-y-6">
                  {designEvolutionSteps.slice(2, 4).map(step => (
                    <StepCard
                      key={step.step}
                      step={step.step}
                      title={step.title}
                      description={step.description}
                      icon={step.icon}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </BlogSection>

        {/* Future of Design */}
        <BlogSection title="The Future of Pokemon Design">
          <HighlightBox
            title="What's Next?"
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            variant="success"
          >
            <p className="text-sm text-muted-foreground mb-4">
              As technology continues to advance, Pokemon design will likely embrace ray tracing,
              advanced AI assistance, and possibly AR/VR experiences. However, the core principles
              of strong silhouettes and emotional connection will remain unchanged.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Emerging Technologies:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Ray tracing lighting</li>
                  <li>• AI-assisted animation</li>
                  <li>• Procedural textures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Design Trends:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Environmental storytelling</li>
                  <li>• Cultural authenticity</li>
                  <li>• Accessibility focus</li>
                </ul>
              </div>
            </div>
          </HighlightBox>
        </BlogSection>

        {/* Call to Action */}
        <BlogSection title="" description="">
          <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden relative border-0 shadow-none">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <CardContent className="p-12 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Interactive Design Tool
                  </div>

                  <h2 className="text-4xl font-bold leading-tight">
                    Explore 30 Years of
                    <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
                      Pokemon Design Evolution
                    </span>
                  </h2>

                  <p className="text-xl opacity-90 leading-relaxed">
                    Journey through every generation with our interactive palette generator. See how
                    colors, styles, and design philosophies have evolved from Game Boy pixels to
                    Switch HD.
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                      <Monitor className="w-4 h-4" />
                      <span>9 Generations</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                      <Palette className="w-4 h-4" />
                      <span>1000+ Pokemon</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                      <TrendingUp className="w-4 h-4" />
                      <span>Evolution Timeline</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/"
                      className="group bg-white text-purple-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg border-0 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
                    >
                      <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Start Your Design Journey
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  {/* Clean, organized Pokemon showcase */}
                  <div className="space-y-6">
                    {/* Evolution timeline header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
                        <TrendingUp className="w-4 h-4" />
                        Design Evolution Timeline
                      </div>
                    </div>

                    {/* Three Pokemon representing eras */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Gen I - Pixel Era */}
                      <div className="text-center space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
                          <Image
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                            alt="Pikachu"
                            width={60}
                            height={60}
                            className="filter brightness-110"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Pikachu</div>
                          <div className="text-xs opacity-70">Gen I • 1996</div>
                          <div className="text-xs mt-1 px-2 py-1 bg-green-500/20 rounded text-green-200">
                            Pixel Era
                          </div>
                        </div>
                      </div>

                      {/* Gen VI - 3D Transition */}
                      <div className="text-center space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
                          <Image
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png"
                            alt="Greninja"
                            width={60}
                            height={60}
                            className="filter brightness-110"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Greninja</div>
                          <div className="text-xs opacity-70">Gen VI • 2013</div>
                          <div className="text-xs mt-1 px-2 py-1 bg-blue-500/20 rounded text-blue-200">
                            3D Revolution
                          </div>
                        </div>
                      </div>

                      {/* Gen IX - Modern Era */}
                      <div className="text-center space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
                          <Image
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png"
                            alt="Koraidon"
                            width={60}
                            height={60}
                            className="filter brightness-110"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Koraidon</div>
                          <div className="text-xs opacity-70">Gen IX • 2022</div>
                          <div className="text-xs mt-1 px-2 py-1 bg-purple-500/20 rounded text-purple-200">
                            Open World
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Evolution progress bar */}
                    <div className="relative mt-8">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex justify-between text-xs mt-2 opacity-70">
                        <span>1996</span>
                        <span>2013</span>
                        <span>2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlogSection>

        {/* Conclusion */}
        <BlogSection title="Conclusion">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              The evolution of Pokemon design reflects not just technological progress, but also
              changing cultural values and artistic philosophies. From the simple, iconic designs of
              Generation I to the complex, culturally-rich Pokemon of today, each era has
              contributed to the rich tapestry of the Pokemon world.
            </p>
            <p className="text-lg text-muted-foreground">
              As we look to the future, one thing remains constant: the best Pokemon designs are
              those that create an emotional connection with players, regardless of the technology
              used to create them. The pixels may have given way to polygons, but the heart of
              Pokemon design remains unchanged.
            </p>
          </div>
        </BlogSection>

        {/* Related Articles */}
        <BlogSection title="Continue Reading">
          <div className="grid md:grid-cols-2 gap-6">
            <RelatedArticle
              title="The Psychology Behind Pokemon Color Choices"
              description="Explore how different Pokemon use color to convey personality, type, and emotional impact."
              href="/blog/pokemon-color-psychology"
              category="Color Theory"
              icon={<Palette className="w-8 h-8 text-purple-600" />}
              borderColor="border-purple-200"
            />
            <RelatedArticle
              title="How to Use Pokemon Color Palettes in Your Designs"
              description="Practical tips for incorporating Pokemon-inspired colors into your projects."
              href="/blog/designing-with-pokemon-palettes"
              category="Design Guide"
              icon={<BookOpen className="w-8 h-8 text-blue-600" />}
              borderColor="border-blue-200"
            />
          </div>
        </BlogSection>
      </div>
    </div>
  );
}
