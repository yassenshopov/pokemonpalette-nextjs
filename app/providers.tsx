'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { ColorProvider } from "@/contexts/color-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <ColorProvider>
          {children}
        </ColorProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
} 