import { Palette, Wrench, Sparkles, Globe } from 'lucide-react';

export interface ResourceItem {
  title: string;
  description: string;
  link: string;
  type: string;
  free: boolean;
  rating: number;
}

export interface ResourceCategory {
  category: string;
  icon: any; // Lucide icon component
  gradient: string;
  items: ResourceItem[];
}

export interface Guide {
  title: string;
  description: string;
  readTime: string;
  difficulty: string;
  tag: string;
  color: string;
}

export const resources: ResourceCategory[] = [
  {
    category: 'Color Theory',
    icon: Palette,
    gradient: 'from-blue-500 to-purple-600',
    items: [
      {
        title: 'Color Psychology in Design',
        description: 'Understanding how colors affect emotions and user behavior',
        link: 'https://www.interaction-design.org/literature/topics/color-theory',
        type: 'Guide',
        free: true,
        rating: 4.8,
      },
      {
        title: 'Color Accessibility Guidelines',
        description: 'WCAG guidelines for ensuring your designs are accessible to all users',
        link: 'https://www.w3.org/WAI/WCAG21/quickref/',
        type: 'Guidelines',
        free: true,
        rating: 4.9,
      },
      {
        title: 'Color Contrast Checker',
        description: 'Tool to check if your color combinations meet accessibility standards',
        link: 'https://webaim.org/resources/contrastchecker/',
        type: 'Tool',
        free: true,
        rating: 4.7,
      },
    ],
  },
  {
    category: 'Design Tools',
    icon: Wrench,
    gradient: 'from-emerald-500 to-teal-600',
    items: [
      {
        title: 'Adobe Color',
        description: 'Professional color palette generator with advanced features',
        link: 'https://color.adobe.com/',
        type: 'Tool',
        free: true,
        rating: 4.6,
      },
      {
        title: 'Coolors',
        description: 'Fast color palette generator with export options',
        link: 'https://coolors.co/',
        type: 'Tool',
        free: true,
        rating: 4.8,
      },
      {
        title: 'Paletton',
        description: 'Advanced color scheme designer with color theory principles',
        link: 'https://paletton.com/',
        type: 'Tool',
        free: true,
        rating: 4.5,
      },
    ],
  },
  {
    category: 'Pokemon Design',
    icon: Sparkles,
    gradient: 'from-orange-500 to-red-600',
    items: [
      {
        title: 'Pokemon Design Philosophy',
        description: 'Official insights into Pokemon character design principles',
        link: 'https://www.pokemon.com/us/strategy/pokemon-design-philosophy/',
        type: 'Article',
        free: true,
        rating: 4.9,
      },
      {
        title: 'Pokemon Type Chart',
        description: 'Complete Pokemon type effectiveness chart for design inspiration',
        link: 'https://pokemondb.net/type',
        type: 'Reference',
        free: true,
        rating: 4.7,
      },
      {
        title: 'Pokemon Art Gallery',
        description: 'Official Pokemon artwork for design inspiration',
        link: 'https://www.pokemon.com/us/pokemon-news/pokemon-art-gallery/',
        type: 'Gallery',
        free: true,
        rating: 4.8,
      },
    ],
  },
  {
    category: 'Web Design',
    icon: Globe,
    gradient: 'from-violet-500 to-purple-600',
    items: [
      {
        title: 'CSS Color Functions',
        description: 'Modern CSS color functions for advanced color manipulation',
        link: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors',
        type: 'Documentation',
        free: true,
        rating: 4.6,
      },
      {
        title: 'Tailwind CSS Color Palette',
        description: 'Pre-built color palette system for rapid web development',
        link: 'https://tailwindcss.com/docs/customizing-colors',
        type: 'Framework',
        free: true,
        rating: 4.8,
      },
      {
        title: 'CSS Grid Color Layouts',
        description: 'Creative ways to use CSS Grid for color-based layouts',
        link: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
        type: 'Tutorial',
        free: true,
        rating: 4.7,
      },
    ],
  },
];

export const guides: Guide[] = [
  {
    title: 'Creating Accessible Color Palettes',
    description:
      'Learn how to design color palettes that work for everyone, including users with color vision deficiencies.',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    tag: 'Accessibility',
    color: 'bg-blue-500',
  },
  {
    title: 'Color Theory for Web Designers',
    description: 'Essential color theory concepts every web designer should know.',
    readTime: '12 min read',
    difficulty: 'Beginner',
    tag: 'Theory',
    color: 'bg-green-500',
  },
  {
    title: 'Using Pokemon Colors in Branding',
    description: 'How to incorporate Pokemon-inspired colors into professional branding projects.',
    readTime: '10 min read',
    difficulty: 'Advanced',
    tag: 'Branding',
    color: 'bg-purple-500',
  },
];
