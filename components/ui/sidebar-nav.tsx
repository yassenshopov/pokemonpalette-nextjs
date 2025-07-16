'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Heart,
  Trophy,
  Compass,
  Palette,
  Lightbulb,
  BookOpen,
  Settings,
  Home,
  ChevronRight,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';

const sidebarNavItems = [
  {
    section: 'Main',
    items: [
      {
        title: 'Home',
        href: '/',
        icon: Home,
        description: 'Return to color palette generator',
      },
      {
        title: 'Profile',
        href: '/profile',
        icon: User,
        description: 'View your profile and designs',
      },
      {
        title: 'Explore',
        href: '/explore',
        icon: Compass,
        description: 'Browse community designs',
      },
    ],
  },
  {
    section: 'Activities',
    items: [
      {
        title: 'Challenges',
        href: '/challenges',
        icon: Trophy,
        description: 'Participate in design challenges',
      },
      {
        title: 'Game',
        href: '/game',
        icon: Palette,
        description: 'Test your color knowledge',
      },
    ],
  },
  {
    section: 'Resources',
    items: [
      {
        title: 'Blog',
        href: '/blog',
        icon: BookOpen,
        description: 'Read articles and insights',
      },
      {
        title: 'Resources',
        href: '/resources',
        icon: Lightbulb,
        description: 'Helpful tools and guides',
      },
    ],
  },
  {
    section: 'Preferences',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        description: 'Customize your experience',
      },
    ],
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  simplified?: boolean;
}

export function SidebarNav({
  className,
  isCollapsed = false,
  onToggleCollapse,
  simplified = false,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useUser();

  if (simplified) {
    return (
      <div className={cn('flex flex-col h-full max-h-full', className)} {...props}>
        {/* Scrollable navigation content */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-6">
            {sidebarNavItems.map(section => (
              <div key={section.section} className="space-y-3">
                <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 px-3 py-2 h-auto',
                          isActive && 'bg-primary/10'
                        )}
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile Section at Bottom - Fixed Position */}
        {user && (
          <div className="flex-shrink-0 mt-auto pt-4 border-t border-border bg-background">
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-8 w-8',
                      userButtonPopover: 'rounded-lg border border-border',
                    },
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn('pb-12 relative h-full flex flex-col', className)} {...props}>
        {/* Top Bar with Logo and Controls */}
        <div className="flex flex-col">
          {/* Controls Bar */}
          <div className="h-14 px-4 border-b flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Branding */}
          <div className="px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo192.png"
                alt="PokemonPalette"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span
                className={cn(
                  'font-semibold text-lg whitespace-nowrap overflow-hidden transition-all duration-300',
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}
              >
                PokemonPalette
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-4 pt-4">
            {sidebarNavItems.map(section => (
              <div key={section.section} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {section.section}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn(
                              'w-full justify-start gap-2',
                              isActive && 'bg-primary/10',
                              isCollapsed && 'px-2 justify-center'
                            )}
                            asChild
                          >
                            <Link href={item.href}>
                              <Icon className="h-4 w-4 shrink-0" />
                              {!isCollapsed && <span className="truncate">{item.title}</span>}
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent
                            side="right"
                            className="flex items-center gap-2 bg-popover border-border"
                            sideOffset={20}
                          >
                            <span className="font-medium">{item.title}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile Section at Bottom - Full Sidebar */}
        {user && (
          <div className="mt-auto p-3 border-t border-border">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: 'h-8 w-8',
                          userButtonPopover: 'rounded-lg border border-border',
                        },
                      }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={20}>
                  <div className="text-sm">
                    <div className="font-medium">{user.fullName || 'User'}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-8 w-8',
                      userButtonPopover: 'rounded-lg border border-border',
                    },
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
