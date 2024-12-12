'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle"
import { PokemonMenu } from "@/components/pokemon-menu";
import { useColors } from "@/contexts/color-context";
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Add this interface at the top
interface Pokemon {
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
      home?: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
}

// Add these helper functions at the top of your component
const getRGBFromString = (color: string) => {
  const rgb = color.match(/\d+/g);
  if (!rgb) return [0, 0, 0];
  return rgb.map(Number);
};

const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrastRatio = (color1: string, color2: string) => {
  const [r1, g1, b1] = getRGBFromString(color1);
  const [r2, g2, b2] = getRGBFromString(color2);
  
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Replace your existing getContrastColor function with this:
const getContrastColor = (bgColor: string) => {
  if (!bgColor) return 'text-foreground';
  
  const whiteContrast = getContrastRatio(bgColor, 'rgb(255, 255, 255)');
  const blackContrast = getContrastRatio(bgColor, 'rgb(0, 0, 0)');
  
  // Add a semi-transparent overlay if contrast is too low
  const needsOverlay = Math.max(whiteContrast, blackContrast) < 4.5;
  const textColor = whiteContrast > blackContrast ? 'text-white' : 'text-black';
  
  return {
    text: textColor,
    overlay: needsOverlay ? 'bg-black/10 dark:bg-white/10' : ''
  };
};

export default function Home() {
  const { colors, pokemonName, shiny, form, setColors } = useColors();
  const [officialArt, setOfficialArt] = useState<string>('');

  // Update effect to fetch the official artwork based on shiny and form
  useEffect(() => {
    const fetchOfficialArt = async () => {
      if (!pokemonName) return;
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        const data: Pokemon = await response.json();
        const artwork = shiny
          ? (data.sprites.other['official-artwork'].front_shiny || data.sprites.other['official-artwork'].front_default)
          : data.sprites.other['official-artwork'].front_default;
        setOfficialArt(artwork);
      } catch (error) {
        console.error('Error fetching artwork:', error);
        setOfficialArt('');
      }
    };

    fetchOfficialArt();
  }, [pokemonName, shiny]);

  // Only render color sections if we have colors
  const renderColorSections = colors.length > 0;

  return (
    <div className="min-h-screen flex">
      {/* Fixed Sidebar */}
      <aside className="w-[30%] fixed left-0 top-0 h-screen m-0 p-0 border-r-0">
        <PokemonMenu />
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 ml-[30%] p-8 min-h-screen">
        {/* Theme Toggle moved to top right of main content */}
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          {/* Updated hero section with artwork */}
          <div className="flex items-center gap-8 pt-8">
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold mb-4">
                Your website - inspired by{' '}
                <span className="capitalize">{pokemonName || 'your Pokemon'}</span>
              </h1>
              <p className="text-muted-foreground">
                This website allows you to enter a Pokemon's name (or simply its number
                in the Pokedex), and its top 3 colours will be extracted.
              </p>
            </div>

            {officialArt && (
              <div className="flex-1 flex justify-center">
                <div className="relative w-64 h-64">
                  <Image
                    src={officialArt}
                    alt={pokemonName}
                    fill
                    className="object-contain drop-shadow-lg transition-all duration-300 hover:scale-105"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {renderColorSections && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {colors.map((color, index) => (
                  <Card 
                    key={index} 
                    style={{ backgroundColor: color }}
                    className="transition-all hover:scale-105"
                  >
                    <CardContent className={`p-6 ${getContrastColor(color).overlay}`}>
                      <p className={getContrastColor(color).text}>
                        {color}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card style={{ backgroundColor: colors[0], opacity: 0.9 }}>
                  <CardContent className={`p-8 ${getContrastColor(colors[0]).overlay}`}>
                    <h2 className="text-2xl font-bold mb-4">Primary Color Usage</h2>
                    <p>Perfect for headers, hero sections, and primary CTAs.</p>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: colors[1], opacity: 0.9 }}>
                  <CardContent className={`p-8 ${getContrastColor(colors[1]).overlay}`}>
                    <h2 className="text-2xl font-bold mb-4">Secondary Color Usage</h2>
                    <p>Great for supporting elements, cards, and backgrounds.</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="overflow-hidden">
                <div 
                  className="h-48 w-full"
                  style={{
                    background: `linear-gradient(45deg, ${colors.join(', ')})`
                  }}
                />
              </Card>

              {/* Color Combinations */}
              <section className="space-y-8">
                <h2 className="text-3xl font-bold text-center">Color Combinations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Complementary Colors */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Primary + Secondary</h3>
                      <div className="flex gap-4">
                        <div 
                          className="h-24 w-1/2 rounded-lg"
                          style={{ backgroundColor: colors[0] }}
                        />
                        <div 
                          className="h-24 w-1/2 rounded-lg"
                          style={{ backgroundColor: colors[1] }}
                        />
                      </div>
                      <p className="text-muted-foreground">
                        Classic combination for main UI elements
                      </p>
                    </CardContent>
                  </Card>

                  {/* Gradient Blend */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Gradient Blend</h3>
                      <div 
                        className="h-24 rounded-lg"
                        style={{
                          background: `linear-gradient(to right, ${colors[0]}, ${colors[1]}, ${colors[2]})`
                        }}
                      />
                      <p className="text-muted-foreground">
                        Smooth transition between all colors
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* UI Examples */}
              <section className="space-y-8">
                <h2 className="text-3xl font-bold text-center">UI Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Button Examples */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Buttons</h3>
                      <div className="space-y-4">
                        <button 
                          className={`w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 
                            ${getContrastColor(colors[0]).overlay}`}
                          style={{ 
                            backgroundColor: colors[0],
                          }}
                        >
                          <span className={getContrastColor(colors[0]).text}>
                            Primary Button
                          </span>
                        </button>
                        <button 
                          className={`w-full px-4 py-2 rounded-lg transition-all hover:opacity-90 
                            ${getContrastColor(colors[1]).overlay}`}
                          style={{ 
                            backgroundColor: colors[1],
                          }}
                        >
                          <span className={getContrastColor(colors[1]).text}>
                            Secondary Button
                          </span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card Examples */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Cards</h3>
                      <div 
                        className="p-4 rounded-lg"
                        style={{ 
                          backgroundColor: colors[1],
                          color: getContrastColor(colors[1]).text
                        }}
                      >
                        <h4 className="font-medium">Card Title</h4>
                        <p className="text-sm opacity-90">Sample card content with themed background.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Text Examples */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Typography</h3>
                      <div className="space-y-2">
                        {colors.map((color, index) => (
                          <div 
                            key={index}
                            className={`p-2 rounded ${getContrastColor(color).overlay}`}
                            style={{ backgroundColor: color }}
                          >
                            <p className={getContrastColor(color).text}>
                              {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Accent'} Text Color
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Advanced UI Examples */}
              <section className="space-y-8">
                <h2 className="text-3xl font-bold text-center">Advanced UI Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Accordion Example */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Accordion</h3>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger 
                            className={getContrastColor(colors[0]).text}
                            style={{ backgroundColor: colors[0] }}
                          >
                            Primary Section
                          </AccordionTrigger>
                          <AccordionContent
                            style={{ borderColor: colors[0] }}
                            className="border-l-2 pl-4"
                          >
                            Content styled with your primary color.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger
                            className={getContrastColor(colors[1]).text}
                            style={{ backgroundColor: colors[1] }}
                          >
                            Secondary Section
                          </AccordionTrigger>
                          <AccordionContent
                            style={{ borderColor: colors[1] }}
                            className="border-l-2 pl-4"
                          >
                            Content styled with your secondary color.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>

                  {/* Tabs Example */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Tabs</h3>
                      <Tabs defaultValue="tab1">
                        <TabsList 
                          className="w-full"
                          style={{ backgroundColor: `${colors[0]}20` }}
                        >
                          <TabsTrigger 
                            value="tab1" 
                            className="flex-1"
                            style={{ 
                              '--tab-active-bg': colors[0],
                              '--tab-active-text': getContrastColor(colors[0]).text
                            } as React.CSSProperties}
                          >
                            Tab 1
                          </TabsTrigger>
                          <TabsTrigger 
                            value="tab2"
                            className="flex-1"
                            style={{ 
                              '--tab-active-bg': colors[0],
                              '--tab-active-text': getContrastColor(colors[0]).text
                            } as React.CSSProperties}
                          >
                            Tab 2
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tab1" className="mt-4">
                          <div 
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: `${colors[1]}20` }}
                          >
                            First tab content
                          </div>
                        </TabsContent>
                        <TabsContent value="tab2" className="mt-4">
                          <div 
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: `${colors[2]}20` }}
                          >
                            Second tab content
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Alert Dialog Example */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">Alert Dialog</h3>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className={`w-full ${getContrastColor(colors[0]).overlay}`}
                            style={{ 
                              backgroundColor: colors[0],
                            }}
                          >
                            <span className={getContrastColor(colors[0]).text}>
                              Open Dialog
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle 
                              style={{ color: colors[0] }}
                            >
                              Themed Dialog
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This is an example of how the color palette can be
                              applied to interactive components.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              style={{ 
                                backgroundColor: colors[1],
                              }}
                              className={getContrastColor(colors[1]).text}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Footer */}
              <footer className="border-t pt-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center space-x-4">
                    <a
                      href="https://github.com/yassenshopov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-foreground"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/yassenshopov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-foreground"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Yassen Shopov. All rights reserved.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Disclaimer: This is a fan-made project. Pokémon and all related properties are trademarks of Nintendo, Game Freak, and The Pokémon Company.
                  </p>
                </div>
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
