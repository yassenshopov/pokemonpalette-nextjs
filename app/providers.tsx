'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { ColorProvider } from '@/contexts/color-context';
import { SaveProvider } from '@/contexts/save-context';
import { LikesProvider } from '@/contexts/likes-context';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ColorProvider>
          <SaveProvider>
            <LikesProvider>
              {children}
              <Toaster />
            </LikesProvider>
          </SaveProvider>
        </ColorProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
