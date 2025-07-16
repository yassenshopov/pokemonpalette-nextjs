'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarDays, Clock, ArrowRight, Sparkles, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 'pokemon-color-psychology',
    title: 'The Psychology Behind Pokemon Color Choices',
    excerpt:
      'Explore how different Pokemon use color to convey personality, type, and emotional impact. Discover the intentional design decisions that make each Pokemon memorable.',
    readTime: '5 min read',
    category: 'Color Theory',
    date: '2024-12-19',
    featured: true,
    tags: ['Psychology', 'Design', 'Colors'],
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    id: 'designing-with-pokemon-palettes',
    title: 'How to Use Pokemon Color Palettes in Your Designs',
    excerpt:
      'Practical tips for incorporating Pokemon-inspired colors into web design, branding, and art projects. Learn which combinations work best for different purposes.',
    readTime: '7 min read',
    category: 'Design Tips',
    date: '2024-12-18',
    featured: true,
    tags: ['Practical', 'Web Design', 'Branding'],
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'evolution-of-pokemon-design',
    title: 'The Evolution of Pokemon Design: From Red to Scarlet',
    excerpt:
      'How Pokemon design and color choices have evolved across generations and what we can learn from it.',
    readTime: '8 min read',
    category: 'Pokemon History',
    date: '2024-12-17',
    featured: false,
    tags: ['History', 'Evolution', 'Analysis'],
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'color-palette-tools-comparison',
    title: 'Pokemon Palette Generator vs Other Color Tools',
    excerpt:
      'A comprehensive comparison of different color palette generators and why Pokemon-inspired colors are unique.',
    readTime: '6 min read',
    category: 'Tool Comparison',
    date: '2024-12-16',
    featured: false,
    tags: ['Tools', 'Comparison', 'Review'],
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'pokemon-branding-inspiration',
    title: 'Pokemon-Inspired Branding: Case Studies',
    excerpt:
      'Real-world examples of how businesses have used Pokemon color palettes in their branding.',
    readTime: '9 min read',
    category: 'Branding',
    date: '2024-12-15',
    featured: false,
    tags: ['Branding', 'Case Studies', 'Business'],
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'accessibility-in-pokemon-colors',
    title: 'Accessibility and Pokemon Color Palettes',
    excerpt: 'How to ensure your Pokemon-inspired designs are accessible to all users.',
    readTime: '6 min read',
    category: 'Accessibility',
    date: '2024-12-14',
    featured: false,
    tags: ['Accessibility', 'Inclusive Design', 'UX'],
    gradient: 'from-cyan-500 to-blue-600',
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

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
              <BookOpen className="w-4 h-4" />
              Design Insights & Color Theory
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Pokemon Design:
              <br />
              <span className="text-primary">Ideas That Matter</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Exploring the intersection of color theory, Pokemon design, and practical insights for
              creating memorable visual experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="#featured">
                  <Sparkles className="w-5 h-5" />
                  Explore Articles
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link href="/">
                  Start Creating
                  <ArrowRight className="w-5 h-5" />
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
              <div className="text-3xl font-bold text-primary">{blogPosts.length}+</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50k+</div>
              <div className="text-sm text-muted-foreground">Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Topics</div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Featured Posts */}
          <motion.section
            id="featured"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Articles</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Deep dives into Pokemon design, color theory, and practical creative insights
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, _index) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <Card className="group h-full overflow-hidden border-0 transition-all duration-500 bg-gradient-to-br from-card to-card/50">
                    <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 group-hover:gap-3 transition-all"
                          asChild
                        >
                          <Link href={`/blog/${post.id}`}>
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* All Posts */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">All Articles</h2>
              <p className="text-lg text-muted-foreground">
                Browse our complete collection of design insights
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {regularPosts.map((post, _index) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <Card className="group h-full overflow-hidden transition-all duration-300 bg-gradient-to-br from-card to-card/30">
                    <div className={`h-1 bg-gradient-to-r ${post.gradient}`} />

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors leading-tight">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1 h-8 px-3"
                          asChild
                        >
                          <Link href={`/blog/${post.id}`}>
                            Read
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Newsletter CTA */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-primary/20">
              <CardContent className="p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="text-4xl mb-6">🎨</div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Palette?</h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Join thousands of designers using our Pokemon Palette Generator to create
                    beautiful, Pokemon-inspired color schemes for their projects.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="gap-2" asChild>
                      <Link href="/">
                        <Sparkles className="w-5 h-5" />
                        Start Creating
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
