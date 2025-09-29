import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ColorProvider } from '@/contexts/color-context';
import { SaveProvider } from '@/contexts/save-context';
import { LikesProvider } from '@/contexts/likes-context';
import { Toaster } from '@/components/ui/toaster';

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
      </body>
    </html>
  );
}

