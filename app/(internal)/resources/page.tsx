'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Lightbulb,
  Palette,
  Wrench,
  BookOpen,
  ExternalLink,
  Sparkles,
  Eye,
  Users,
  Award,
  Star,
  Download,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';

const resources = [
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

const guides = [
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ResourcesPage() {
  return (
    <>
      {/* Hero Section - Full Width */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 max-w-6xl"
        style={{
          marginTop: '-1rem',
        }}
      >
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4" />
              Curated Design Resources
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Design Resources &
              <br />
              <span className="text-primary">Creative Tools</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Curated tools, guides, and resources to help you create amazing designs with color
              theory, accessibility, and Pokemon-inspired creativity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="#tools">
                  <Wrench className="w-5 h-5" />
                  Explore Tools
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link href="#guides">
                  <BookOpen className="w-5 h-5" />
                  Read Guides
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {resources.reduce((acc, cat) => acc + cat.items.length, 0)}+
              </div>
              <div className="text-sm text-muted-foreground">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{resources.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Quick Start Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Start</h2>
              <p className="text-lg text-muted-foreground">
                Jump right into creating with these essential tools and guides
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="group transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                    🎨
                  </div>
                  <h3 className="text-xl font-bold mb-3">Generate a Palette</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Use our Pokemon Palette Generator to create unique color schemes from your
                    favorite Pokemon
                  </p>
                  <Button className="w-full gap-2" asChild>
                    <Link href="/">
                      <Sparkles className="w-4 h-4" />
                      Start Creating
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h3 className="text-xl font-bold mb-3">Learn Color Theory</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Understand the psychology and principles behind effective color use in design
                  </p>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href="/blog">
                      <BookOpen className="w-4 h-4" />
                      Read Articles
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                    🛠️
                  </div>
                  <h3 className="text-xl font-bold mb-3">Explore Tools</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Discover professional design tools and resources for your creative projects
                  </p>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href="#tools">
                      <Wrench className="w-4 h-4" />
                      View Tools
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Resource Categories */}
          <motion.section
            id="tools"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Resource Categories</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to create beautiful, accessible designs
              </p>
            </motion.div>

            <div className="space-y-16">
              {resources.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <motion.div key={category.category} variants={itemVariants}>
                    <div className="flex items-center gap-4 mb-8">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-r ${category.gradient} text-white`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{category.category}</h3>
                        <p className="text-muted-foreground">{category.items.length} resources</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.items.map((item, index) => (
                        <Card key={index} className="group transition-all duration-300 h-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                              <div className="flex items-center gap-2">
                                {item.free && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-green-600 border-green-600"
                                  >
                                    Free
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {item.rating}
                                </div>
                              </div>
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {item.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {item.description}
                            </p>
                            <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                              <Link href={item.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3" />
                                Visit Resource
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Internal Guides */}
          <motion.section
            id="guides"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Guides</h2>
              <p className="text-lg text-muted-foreground">
                In-depth tutorials and insights from our team
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-300 h-full overflow-hidden"
                >
                  <div className={`h-2 ${guide.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {guide.tag}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BookOpen className="w-3 h-3" />
                        {guide.readTime}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {guide.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {guide.difficulty}
                      </Badge>
                      <Button variant="ghost" size="sm" className="gap-2 text-xs h-8 px-3" asChild>
                        <Link href="/blog">
                          Read More
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-primary/20">
              <CardContent className="p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="text-4xl mb-6">🚀</div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Now that you have the tools and knowledge, it's time to create something
                    amazing. Start with our Pokemon Palette Generator or explore community designs
                    for inspiration.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="gap-2" asChild>
                      <Link href="/">
                        <Palette className="w-5 h-5" />
                        Create Palette
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2" asChild>
                      <Link href="/explore">
                        <Users className="w-5 h-5" />
                        View Community
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
}
