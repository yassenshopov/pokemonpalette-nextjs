import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Clock,
  User,
  Star,
  Palette,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Zap,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface BlogHeroProps {
  title: string;
  description: string;
  category: string;
  readTime: string;
  author?: string;
  date: string;
  children?: React.ReactNode;
}

export function BlogHero({
  title,
  description,
  category,
  readTime,
  author = 'Pokemon Palette Team',
  date,
  children,
}: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 border-b">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4 py-16 max-w-6xl relative">
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                {category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              {title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time>{date}</time>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
            </div>
          </div>

          {children && <div className="relative">{children}</div>}
        </div>
      </div>
    </section>
  );
}

interface BlogSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function BlogSection({ title, description, children, className = '' }: BlogSectionProps) {
  return (
    <section className={`mb-16 ${className}`}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{description}</p>
      )}
      {children}
    </section>
  );
}

interface PokemonCardProps {
  name: string;
  id: number;
  types: string[];
  colors: string[];
  psychology: string;
  description: string;
  TypeBadge: React.ComponentType<{ type: any }>;
}

export function PokemonCard({
  name,
  id,
  types,
  colors,
  psychology,
  description,
  TypeBadge,
}: PokemonCardProps) {
  return (
    <Card className="overflow-hidden border hover:border-purple-200 dark:hover:border-purple-800 transition-colors shadow-none">
      <div className="grid md:grid-cols-3 gap-0">
        <div
          className="relative h-48 md:h-auto flex items-center justify-center p-8 border-r"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}20, ${colors[1]}20)`,
          }}
        >
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            alt={name}
            width={120}
            height={120}
            className="hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="md:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold">{name}</h3>
            <div className="flex gap-2">
              {types.map(type => (
                <TypeBadge key={type} type={type as any} />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Psychology: {psychology}
            </h4>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Color Palette:</span>
            <div className="flex gap-2">
              {colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface TypeColorCardProps {
  type: string;
  color: string;
  psychology: string;
  TypeBadge: React.ComponentType<{ type: any; className?: string }>;
}

export function TypeColorCard({ type, color, psychology, TypeBadge }: TypeColorCardProps) {
  return (
    <Card className="overflow-hidden border hover:border-primary/20 transition-colors group shadow-none">
      <div
        className="h-24 relative flex items-center justify-center border-b"
        style={{ backgroundColor: color }}
      >
        <TypeBadge type={type as any} className="scale-125" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 capitalize">{type} Types</h3>
        <p className="text-sm text-muted-foreground">{psychology}</p>
      </CardContent>
    </Card>
  );
}

interface EvolutionStageProps {
  name: string;
  id: number;
  color: string;
  meaning: string;
  isLast?: boolean;
}

export function EvolutionStage({ name, id, color, meaning, isLast }: EvolutionStageProps) {
  return (
    <div className="text-center group relative">
      <div
        className="relative w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center border-2 group-hover:border-primary transition-colors"
        style={{ backgroundColor: `${color}20`, borderColor: color }}
      >
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
          alt={name}
          width={80}
          height={80}
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h4 className="font-semibold text-lg mb-2">{name}</h4>
      <div
        className="w-16 h-4 mx-auto mb-2 rounded-full border"
        style={{ backgroundColor: color }}
      />
      <p className="text-sm text-muted-foreground">{meaning}</p>

      {!isLast && (
        <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

interface ColorMeaningCardProps {
  color: string;
  name: string;
  meaning: string;
  culture: string;
}

export function ColorMeaningCard({ color, name, meaning, culture }: ColorMeaningCardProps) {
  return (
    <Card className="text-center border hover:border-primary/20 transition-colors shadow-none">
      <CardContent className="p-6">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-border"
          style={{ backgroundColor: color }}
        />
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{meaning}</p>
        <Badge variant="outline" className="text-xs">
          {culture}
        </Badge>
      </CardContent>
    </Card>
  );
}

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function StepCard({ step, title, description, icon }: StepCardProps) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center flex-shrink-0">
        <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">{step}</span>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  children?: React.ReactNode;
}

export function CallToAction({
  title,
  description,
  buttonText,
  buttonHref,
  children,
}: CallToActionProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden relative border-0 shadow-none">
      <div className="absolute inset-0 bg-black/10" />
      <CardContent className="p-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="mb-6 opacity-90">{description}</p>
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 border-0"
            >
              <Link href={buttonHref}>
                {buttonText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          {children && <div className="hidden md:block">{children}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

interface RelatedArticleProps {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: React.ReactNode;
  borderColor?: string;
}

export function RelatedArticle({
  title,
  description,
  href,
  category,
  icon,
  borderColor = 'border-purple-200',
}: RelatedArticleProps) {
  const colorClass = borderColor.includes('purple')
    ? 'group-hover:text-purple-600'
    : borderColor.includes('orange')
    ? 'group-hover:text-orange-600'
    : borderColor.includes('blue')
    ? 'group-hover:text-blue-600'
    : 'group-hover:text-primary';

  return (
    <Card className={`group border-2 hover:${borderColor} transition-colors shadow-none`}>
      <CardContent className="p-6">
        <Link href={href} className="block">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${colorClass} transition-colors`}>
                {title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{description}</p>
              <Badge variant="outline">{category}</Badge>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

interface HighlightBoxProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  variant?: 'default' | 'warning' | 'success' | 'info';
}

export function HighlightBox({ title, children, icon, variant = 'default' }: HighlightBoxProps) {
  const variants = {
    default: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  };

  return (
    <Card className={`${variants[variant]} border-2 shadow-none`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

// Export icons for easy use
export const BlogIcons = {
  ArrowLeft,
  Clock,
  User,
  Star,
  Palette,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Zap,
  ArrowRight,
  ExternalLink,
};
