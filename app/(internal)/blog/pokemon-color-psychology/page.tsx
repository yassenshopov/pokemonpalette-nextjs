import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { ImageWithFallback, extractPokemonIdFromUrl } from '@/components/ui/ImageWithFallback';
import { TypeBadge } from '@/components/type-badge';
import {
  BlogHero,
  BlogSection,
  PokemonCard,
  TypeColorCard,
  EvolutionStage,
  ColorMeaningCard,
  StepCard,
  CallToAction,
  RelatedArticle,
  HighlightBox,
} from '@/components/ui/blog-components';
import { Users, Brain, TrendingUp, Globe, BookOpen, Zap, Star } from 'lucide-react';
import { PokemonTypeNames } from '@/types/pokemon';

export const metadata: Metadata = {
  title: 'The Psychology Behind Pokemon Color Choices - Pokemon Palette Blog',
  description:
    'Explore how different Pokemon use color to convey personality, type, and emotional impact. Learn the psychology behind Pokemon design choices.',
  keywords: [
    'pokemon color psychology',
    'pokemon design psychology',
    'color meaning in pokemon',
    'pokemon type colors',
    'pokemon personality colors',
    'design psychology',
    'color theory pokemon',
  ],
  openGraph: {
    title: 'The Psychology Behind Pokemon Color Choices',
    description:
      'Explore how different Pokemon use color to convey personality, type, and emotional impact.',
    images: ['https://pokemonpalette.com/og-image.webp'],
  },
};

// Pokemon examples with their color psychology
const pokemonExamples = [
  {
    name: 'Pikachu',
    id: 25,
    types: ['electric'] as PokemonTypeNames[],
    colors: ['#F7D02C', '#FFE135', '#D4A017'],
    psychology: 'Optimism, friendliness, and approachability',
    description:
      "Pikachu's bright yellow isn't just about its Electric type - it represents joy and universal appeal.",
  },
  {
    name: 'Charizard',
    id: 6,
    types: ['fire', 'flying'] as PokemonTypeNames[],
    colors: ['#F08030', '#FF6600', '#CC4400'],
    psychology: 'Power, aggression, and dominance',
    description:
      'Red and orange convey leadership and strength, matching its fierce competitive nature.',
  },
  {
    name: 'Umbreon',
    id: 197,
    types: ['dark'] as PokemonTypeNames[],
    colors: ['#1A1A1A', '#FFE135', '#705746'],
    psychology: 'Mystery, elegance, and sophistication',
    description: 'Black represents elegance while yellow rings add supernatural mystique.',
  },
  {
    name: 'Blastoise',
    id: 9,
    types: ['water'] as PokemonTypeNames[],
    colors: ['#6890F0', '#4A90E2', '#2E5BBA'],
    psychology: 'Calmness, depth, and reliability',
    description: 'Blue tones convey trustworthiness and the fluid nature of water.',
  },
  {
    name: 'Venusaur',
    id: 3,
    types: ['grass', 'poison'] as PokemonTypeNames[],
    colors: ['#78C850', '#A8D8A8', '#4E8234'],
    psychology: 'Growth, nature, and harmony',
    description: 'Green represents life force and connection to nature.',
  },
  {
    name: 'Gengar',
    id: 94,
    types: ['ghost', 'poison'] as PokemonTypeNames[],
    colors: ['#705898', '#A040A0', '#483D8B'],
    psychology: 'Mystery, mischief, and the supernatural',
    description: 'Purple evokes the mystical and otherworldly nature of ghost types.',
  },
];

const typeColorMappings: Array<{
  type: PokemonTypeNames;
  color: string;
  psychology: string;
}> = [
  {
    type: 'fire',
    color: '#F08030',
    psychology: 'Energy, passion, danger, and warmth',
  },
  {
    type: 'water',
    color: '#6890F0',
    psychology: 'Calmness, depth, adaptability, and flow',
  },
  {
    type: 'grass',
    color: '#78C850',
    psychology: 'Growth, nature, harmony, and life',
  },
  {
    type: 'electric',
    color: '#F8D030',
    psychology: 'Energy, speed, brightness, and power',
  },
  {
    type: 'psychic',
    color: '#F85888',
    psychology: 'Mystery, wisdom, spirituality, and the unknown',
  },
  {
    type: 'dark',
    color: '#705848',
    psychology: 'Mystery, power, sophistication, and sometimes malice',
  },
  {
    type: 'ghost',
    color: '#705898',
    psychology: 'Supernatural, mysterious, and ethereal',
  },
  {
    type: 'dragon',
    color: '#7038F8',
    psychology: 'Power, majesty, and ancient wisdom',
  },
];

const evolutionExample = {
  line: 'Charmander Evolution',
  stages: [
    { name: 'Charmander', id: 4, color: '#FF9900', meaning: 'Youth, energy, and potential' },
    { name: 'Charmeleon', id: 5, color: '#FF6600', meaning: 'Growth and increased power' },
    { name: 'Charizard', id: 6, color: '#FF4400', meaning: 'Maturity, mastery, and complexity' },
  ],
};

const ColorWheelHero = () => (
  <div className="relative w-80 h-80 mx-auto">
    <div className="absolute inset-0 rounded-full bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 opacity-20 border" />

    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
      <ImageWithFallback
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
        alt="Pikachu"
        width={60}
        height={60}
        pokemonId={25}
      />
    </div>
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
      <ImageWithFallback
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
        alt="Charizard"
        width={60}
        height={60}
        pokemonId={6}
      />
    </div>
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <ImageWithFallback
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png"
        alt="Venusaur"
        width={60}
        height={60}
        pokemonId={3}
      />
    </div>
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
      <ImageWithFallback
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
        alt="Blastoise"
        width={60}
        height={60}
        pokemonId={9}
      />
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center bg-background/80 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center border">
        <div>
          <div className="text-2xl font-bold">Color</div>
          <div className="text-sm text-muted-foreground">Psychology</div>
        </div>
      </div>
    </div>
  </div>
);

export default function PokemonColorPsychologyPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHero
        title="The Psychology Behind Pokemon Color Choices"
        description="Discover how Pokemon designers masterfully use color psychology to create characters that resonate emotionally with millions of fans worldwide."
        category="Color Theory"
        readTime="8 min read"
        date="December 19, 2024"
      >
        <ColorWheelHero />
      </BlogHero>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Introduction */}
        <BlogSection
          title="Introduction"
          description="Pokemon design is a masterclass in color psychology. Every Pokemon's color palette is carefully chosen to convey specific emotions, personality traits, and type associations. Let's explore how the brilliant minds behind Pokemon use color to create characters that resonate with millions of fans worldwide."
        />

        {/* Type-Based Color Psychology */}
        <BlogSection
          title="Type-Based Color Psychology"
          description="Pokemon types are perhaps the most obvious example of color psychology in action. Each type has established color associations that help players instantly recognize and understand a Pokemon's capabilities:"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeColorMappings.map(type => (
              <TypeColorCard
                key={type.type}
                type={type.type}
                color={type.color}
                psychology={type.psychology}
                TypeBadge={TypeBadge}
              />
            ))}
          </div>
        </BlogSection>

        {/* Pokemon Examples */}
        <BlogSection
          title="Personality Through Color"
          description="Beyond type associations, Pokemon colors often reflect their personality and character traits. Here are some iconic examples:"
        >
          <div className="space-y-8">
            {pokemonExamples.map(pokemon => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                id={pokemon.id}
                types={pokemon.types}
                colors={pokemon.colors}
                psychology={pokemon.psychology}
                description={pokemon.description}
                TypeBadge={TypeBadge}
              />
            ))}
          </div>
        </BlogSection>

        {/* Evolution Color Progression */}
        <BlogSection
          title="Evolution and Color Progression"
          description="Pokemon evolution often involves color changes that reflect character development. Take Charmander's evolution line as a perfect example:"
        >
          <Card className="overflow-hidden border shadow-none">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">{evolutionExample.line}</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {evolutionExample.stages.map((stage, index) => (
                  <EvolutionStage
                    key={stage.name}
                    name={stage.name}
                    id={stage.id}
                    color={stage.color}
                    meaning={stage.meaning}
                    isLast={index === evolutionExample.stages.length - 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </BlogSection>

        {/* Shiny Pokemon Section */}
        <BlogSection title="Shiny Pokemon and Rarity Psychology">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-muted-foreground mb-6">
                Shiny Pokemon use color psychology to create excitement and rarity. The color
                changes often follow specific patterns that make them feel special and valuable.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 border flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Gold/Silver:</strong> Precious metals represent value and rarity
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 border flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Pink/Purple:</strong> Unusual colors create visual interest
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-green-400 border flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Inverted colors:</strong> Creates a "mirror" effect that feels special
                  </div>
                </li>
              </ul>
            </div>

            <HighlightBox
              title="Shiny Spotlight"
              icon={<Star className="w-6 h-6 text-yellow-600" />}
              variant="warning"
            >
              <p className="text-sm text-muted-foreground mb-4">
                The psychology of rarity makes shiny Pokemon highly coveted. Their alternative color
                schemes trigger our natural attraction to the unique and valuable.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">1/4096</div>
                  <div className="text-xs text-muted-foreground">Base odds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">∞</div>
                  <div className="text-xs text-muted-foreground">Perceived value</div>
                </div>
              </div>
            </HighlightBox>
          </div>
        </BlogSection>

        {/* Cultural Color Meanings */}
        <BlogSection
          title="Cultural Color Meanings"
          description="Pokemon design also considers cultural color associations, especially from Japanese culture where Pokemon originated:"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                color: '#DC2626',
                name: 'Red',
                meaning: 'Life, energy, and protection',
                culture: 'Japanese tradition',
              },
              {
                color: '#FFFFFF',
                name: 'White',
                meaning: 'Purity, cleanliness, and new beginnings',
                culture: 'Universal symbolism',
              },
              {
                color: '#1F2937',
                name: 'Black',
                meaning: 'Mystery, elegance, and sometimes mourning',
                culture: 'Cross-cultural',
              },
              {
                color: '#16A34A',
                name: 'Green',
                meaning: 'Nature, growth, and harmony',
                culture: 'Global association',
              },
            ].map((item, index) => (
              <ColorMeaningCard
                key={index}
                color={item.color}
                name={item.name}
                meaning={item.meaning}
                culture={item.culture}
              />
            ))}
          </div>
        </BlogSection>

        {/* Practical Applications */}
        <BlogSection title="Practical Applications for Designers">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 shadow-none">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground mb-8">
                Understanding Pokemon color psychology can help designers create more effective
                color palettes. Here's how to apply these principles:
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <StepCard
                    step={1}
                    title="Consider your audience"
                    description="What emotions do you want to evoke?"
                    icon={<Users className="w-4 h-4 text-muted-foreground" />}
                  />
                  <StepCard
                    step={2}
                    title="Think about personality"
                    description="What traits does your design represent?"
                    icon={<Brain className="w-4 h-4 text-muted-foreground" />}
                  />
                </div>
                <div className="space-y-6">
                  <StepCard
                    step={3}
                    title="Use color progression"
                    description="How can colors change to show development?"
                    icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
                  />
                  <StepCard
                    step={4}
                    title="Cultural awareness"
                    description="Consider how colors are perceived in different cultures"
                    icon={<Globe className="w-4 h-4 text-muted-foreground" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </BlogSection>

        {/* Call to Action */}
        <BlogSection title="" description="" className="">
          <CallToAction
            title="Try It Yourself"
            description="Use our Pokemon Palette Generator to explore the psychology behind your favorite Pokemon's colors and apply these insights to your own designs."
            buttonText="Generate Pokemon Palettes"
            buttonHref="/"
          >
            <div className="relative w-48 h-48 mx-auto">
              <ImageWithFallback
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                alt="Pikachu"
                width={120}
                height={120}
                className="absolute top-0 right-0"
                pokemonId={25}
              />
              <ImageWithFallback
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
                alt="Charizard"
                width={100}
                height={100}
                className="absolute bottom-0 left-0 opacity-80"
                pokemonId={6}
              />
            </div>
          </CallToAction>
        </BlogSection>

        {/* Conclusion */}
        <BlogSection title="Conclusion">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Pokemon color psychology demonstrates how thoughtful color choices can create powerful
              emotional connections. By understanding these principles, designers can create more
              meaningful and effective color palettes that resonate with their audience.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you're designing a website, creating art, or developing a brand, consider how
              color psychology can enhance your work. And remember, sometimes the best inspiration
              comes from the most unexpected places - like a world of pocket monsters.
            </p>
          </div>
        </BlogSection>

        {/* Related Articles */}
        <BlogSection title="Continue Reading">
          <div className="grid md:grid-cols-2 gap-6">
            <RelatedArticle
              title="How to Use Pokemon Color Palettes in Your Designs"
              description="Practical tips for incorporating Pokemon-inspired colors into your projects."
              href="/blog/designing-with-pokemon-palettes"
              category="Design Guide"
              icon={<BookOpen className="w-8 h-8 text-purple-600" />}
              borderColor="border-purple-200"
            />
            <RelatedArticle
              title="The Evolution of Pokemon Design: From Red to Scarlet"
              description="How Pokemon design and color choices have evolved across generations."
              href="/blog/evolution-of-pokemon-design"
              category="Design History"
              icon={<Zap className="w-8 h-8 text-orange-600" />}
              borderColor="border-orange-200"
            />
          </div>
        </BlogSection>
      </div>
    </div>
  );
}
