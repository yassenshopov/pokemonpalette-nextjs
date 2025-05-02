import { LucideTwitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Logo and disclaimer */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="font-semibold text-lg">
                Pokemon Palette
              </div>
              <div className="h-4 w-[1px] bg-border" />
              <span className="text-xs text-muted-foreground font-medium">
                2025
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[600px]">
              Pokemon Palette by{' '}
              <a
                href="https://github.com/yassenshopov"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                Yassen Shopov
              </a>{' '}
              is not affiliated with "The Pokémon Company" and does not own or claim
              any rights to any Nintendo trademark or the Pokémon trademark.
            </p>
          </div>

          {/* Right side - Links and social */}
          <div className="flex flex-col md:items-end space-y-6">
            {/* Social links */}
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
                href="https://github.com/YassenRabie/pokemonpalette"
                target="_blank"
                rel="noreferrer"
                className="group relative"
              >
                <div className="absolute -inset-2 rounded-full bg-zinc-50 dark:bg-zinc-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Github className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>

            {/* Quick links */}
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <a
                href="https://github.com/YassenRabie/pokemonpalette/issues"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Report an issue
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="https://github.com/YassenRabie/pokemonpalette"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Source code
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                PokéAPI
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="https://buymeacoffee.com/yassenshopov"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pokemon Palette. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
