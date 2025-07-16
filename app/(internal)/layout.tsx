'use client';

import { SidebarNav } from '@/components/ui/sidebar-nav';
import { MobileNav } from '@/components/ui/mobile-nav';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block border-r bg-card/50 backdrop-blur-sm fixed left-0 h-screen transition-all duration-300',
          isCollapsed ? 'w-[70px]' : 'w-64'
        )}
      >
        <SidebarNav
          className="w-full"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isCollapsed ? 'lg:pl-[70px]' : 'lg:pl-64'
        )}
      >
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="flex h-14 items-center px-4">
            <MobileNav />
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-4">{children}</div>
      </main>
    </div>
  );
}
