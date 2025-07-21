'use client';

import { MobileNav } from '@/components/ui/mobile-nav';
import { Navbar } from '@/components/landing/navbar';
import { useColors } from '@/contexts/color-context';
import { getContrastColor } from '@/lib/color-utils';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  const { colors } = useColors();

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="flex h-14 items-center px-4">
            <MobileNav />
          </div>
        </header>
        {/* Desktop Navbar */}
        <div className="hidden lg:block">
          <Navbar colors={colors} getContrastColor={getContrastColor} />
        </div>
        <div className="mx-auto max-w-5xl px-4 pt-24 pb-4">{children}</div>
      </main>
    </div>
  );
}
