'use client';

import { LucideTwitter, Github, BookOpen, HelpCircle, Palette, User, Compass } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { SubmitDesignDialog } from '@/components/ui/submit-design-dialog';

export function Footer() {
  const { isSignedIn } = useUser();

  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="font-semibold text-lg">Pokemon Palette</div>
              <div className="h-4 w-[1px] bg-border" />
              <span className="text-xs text-muted-foreground font-medium">2025</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generate beautiful color palettes from Pokemon artwork. Free design tool for artists,
              designers, and Pokemon fans.
            </p>
            <p className="text-xs text-muted-foreground">
              Not affiliated with "The Pokémon Company" or Nintendo.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Palette Generator
              </Link>
              <Link
                href="/game"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Color Game
              </Link>
              <Link
                href="/explore"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Compass className="h-3 w-3" />
                Explore Community
              </Link>
              {isSignedIn && (
                <Link
                  href="/profile"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <User className="h-3 w-3" />
                  My Profile
                </Link>
              )}
              <SubmitDesignDialog>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Submit Design
                </Button>
              </SubmitDesignDialog>
              <Link
                href="/challenges"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Design Challenges
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <BookOpen className="h-3 w-3" />
                Design Blog
              </Link>
              <Link
                href="/resources"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Palette className="h-3 w-3" />
                Resources
              </Link>
            </nav>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Help & Support</h3>
            <nav className="space-y-2">
              <Link
                href="/faq"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <HelpCircle className="h-3 w-3" />
                FAQ
              </Link>
              <a
                href="https://github.com/yassenshopov/pokemonpalette-nextjs/issues"
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Report an Issue
              </a>
              <a
                href="https://buymeacoffee.com/yassenshopov"
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Support Project
              </a>
            </nav>
          </div>

          {/* Social & External */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Connect</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/yassenshopov"
                target="_blank"
                rel="noreferrer"
                className="group relative"
              >
                <div className="absolute -inset-2 rounded-full bg-blue-50 dark:bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <LucideTwitter className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://github.com/yassenshopov"
                target="_blank"
                rel="noreferrer"
                className="group relative"
              >
                <div className="absolute -inset-2 rounded-full bg-zinc-50 dark:bg-zinc-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Github className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
            <div className="space-y-2">
              <a
                href="https://github.com/yassenshopov/pokemonpalette-nextjs"
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Source Code
              </a>
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Powered by PokéAPI
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pokemon Palette by{' '}
            <a
              href="https://github.com/yassenshopov"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Yassen Shopov
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
