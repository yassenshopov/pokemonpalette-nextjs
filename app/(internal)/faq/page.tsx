'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

const faqs = [
  {
    category: 'Getting Started',
    icon: '🚀',
    color: 'from-blue-500 to-cyan-500',
    questions: [
      {
        question: 'What is Pokemon Palette Generator?',
        answer:
          'Pokemon Palette Generator is a free web tool that extracts color palettes from Pokemon artwork. It analyzes official Pokemon images and provides you with the exact HEX, RGB, and HSL color values that you can use in your design projects.',
      },
      {
        question: 'How do I use Pokemon Palette Generator?',
        answer:
          'Simply select a Pokemon from the dropdown menu or search for a specific Pokemon. The tool will automatically extract and display the color palette with multiple color blocks. Click on any color to copy its values in your preferred format (HEX, RGB, or HSL).',
      },
      {
        question: 'Is Pokemon Palette Generator free to use?',
        answer:
          'Yes, Pokemon Palette Generator is completely free to use. No registration, account creation, or payment is required. You can use it as much as you want for both personal and commercial projects.',
      },
    ],
  },
  {
    category: 'Color Formats',
    icon: '🎨',
    color: 'from-purple-500 to-pink-500',
    questions: [
      {
        question: 'What color formats are supported?',
        answer:
          'Pokemon Palette Generator supports three main color formats: HEX (hexadecimal), RGB (Red, Green, Blue), and HSL (Hue, Saturation, Lightness). You can switch between formats using the dropdown menu next to each color.',
      },
      {
        question: 'How do I copy color values?',
        answer:
          'Click on any color block in the palette to automatically copy its value to your clipboard. The color will be copied in the currently selected format (HEX, RGB, or HSL). You can also use the format dropdown to change the format before copying.',
      },
      {
        question: 'Can I use these colors in my design software?',
        answer:
          'Absolutely! The color values provided by Pokemon Palette Generator are compatible with all major design software including Adobe Photoshop, Illustrator, Figma, Sketch, Canva, and any web development tools.',
      },
    ],
  },
  {
    category: 'Pokemon Coverage',
    icon: '⚡',
    color: 'from-emerald-500 to-teal-500',
    questions: [
      {
        question: 'Which Pokemon are available?',
        answer:
          'Pokemon Palette Generator includes all Pokemon from all generations, including the latest ones. This includes regular Pokemon, regional variants, and special forms. The database is regularly updated with new Pokemon.',
      },
      {
        question: 'Do you have shiny Pokemon colors?',
        answer:
          'Yes! You can toggle between regular and shiny Pokemon using the shiny toggle button. This will show you the color palette for the shiny version of the selected Pokemon, which often has completely different colors.',
      },
      {
        question: 'Are regional variants included?',
        answer:
          'Yes, regional variants like Alolan, Galarian, and Paldean forms are included. You can select these variants from the Pokemon menu to see their unique color palettes.',
      },
    ],
  },
  {
    category: 'Technical Questions',
    icon: '⚙️',
    color: 'from-orange-500 to-red-500',
    questions: [
      {
        question: 'How does the color extraction work?',
        answer:
          "Pokemon Palette Generator uses advanced image processing algorithms to analyze official Pokemon artwork. It identifies the dominant colors and creates a balanced palette that represents the Pokemon's visual identity.",
      },
      {
        question: 'What browsers are supported?',
        answer:
          "Pokemon Palette Generator works on all modern browsers including Chrome, Firefox, Safari, and Edge. It's also fully responsive and works on mobile devices and tablets.",
      },
      {
        question: 'Do I need to install anything?',
        answer:
          'No installation required! Pokemon Palette Generator is a web-based tool that runs entirely in your browser. Just visit the website and start generating palettes immediately.',
      },
    ],
  },
  {
    category: 'Design and Usage',
    icon: '✨',
    color: 'from-violet-500 to-purple-500',
    questions: [
      {
        question: 'Can I use these colors for commercial projects?',
        answer:
          'Yes, you can use the color values for commercial projects. However, please note that Pokemon Palette Generator is not affiliated with The Pokemon Company, and you should ensure your use complies with relevant copyright and trademark laws.',
      },
      {
        question: 'How many colors are in each palette?',
        answer:
          "Each Pokemon palette typically contains 5-8 dominant colors that best represent the Pokemon's appearance. The exact number may vary depending on the Pokemon's design complexity.",
      },
      {
        question: 'Can I save my favorite palettes?',
        answer:
          'Yes! You can save your favorite palettes by creating an account. Visit your profile to view and manage all your saved palettes and designs.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    icon: '🔧',
    color: 'from-rose-500 to-pink-500',
    questions: [
      {
        question: "The colors aren't copying to my clipboard",
        answer:
          'Make sure your browser allows clipboard access. Some browsers may require you to click "Allow" when prompted. You can also manually select and copy the color values if needed.',
      },
      {
        question: "The Pokemon I'm looking for isn't showing up",
        answer:
          "Try searching for the Pokemon using its name or number. If you still can't find it, the Pokemon might be very new or there might be a temporary issue. Please try refreshing the page.",
      },
      {
        question: 'The colors look different on my screen',
        answer:
          'Color appearance can vary depending on your monitor settings, color calibration, and lighting conditions. The color values provided are accurate, but visual perception may differ between devices.',
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (category: string) => {
    setOpenSections(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredFaqs = faqs
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              How Can We
              <br />
              <span className="text-primary">Help You?</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Find answers to common questions about Pokemon Palette Generator and learn how to make
              the most of our color extraction tools.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-primary/20 focus:border-primary/40"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Quick Navigation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Navigation</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {faqs.map(category => (
              <Button
                key={category.category}
                variant="outline"
                size="sm"
                onClick={() => {
                  const element = document.getElementById(
                    category.category.toLowerCase().replace(/\s+/g, '-')
                  );
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="gap-2 hover:scale-105 transition-transform"
              >
                <span>{category.icon}</span>
                {category.category}
              </Button>
            ))}
          </div>
        </motion.section>

        {/* FAQ Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {(searchTerm ? filteredFaqs : faqs).map((category, categoryIndex) => (
            <motion.section
              key={category.category}
              variants={itemVariants}
              id={category.category.toLowerCase().replace(/\s+/g, '-')}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white text-xl`}
                >
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{category.category}</h2>
                  <p className="text-muted-foreground">{category.questions.length} questions</p>
                </div>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, index) => (
                  <Collapsible
                    key={index}
                    open={openSections.includes(`${category.category}-${index}`)}
                    onOpenChange={() => toggleSection(`${category.category}-${index}`)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer transition-shadow group">
                        <CardHeader className="py-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-left group-hover:text-primary transition-colors">
                              {faq.question}
                            </h3>
                            <div className="ml-4 flex-shrink-0">
                              {openSections.includes(`${category.category}-${index}`) ? (
                                <ChevronDown className="w-5 h-5 text-primary" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Card className="border-t-0 rounded-t-none">
                        <CardContent className="pt-0 pb-6">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-primary/20">
            <CardContent className="p-12">
              <div className="max-w-2xl mx-auto">
                <div className="text-4xl mb-6">💬</div>
                <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Can't find what you're looking for? Check out our resources, try the tool
                  yourself, or explore our community designs for inspiration.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/">
                      <Sparkles className="w-5 h-5" />
                      Try the Generator
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <Link href="/resources">
                      <BookOpen className="w-5 h-5" />
                      View Resources
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <Link href="/explore">
                      <MessageSquare className="w-5 h-5" />
                      Join Community
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
