'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Guitar, Heart, Home, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Browse Songs', icon: Home },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/tools/chord-progression', label: 'AI Chord Tool', icon: Sparkles },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    const currentNav = navItems.find(item => pathname.startsWith(item.href) && item.href !== '/');
    if (currentNav) return currentNav.label;
    if (pathname.startsWith('/songs/')) return "Chord Sheet";
    if (pathname === '/') return 'Browse Songs';
    return 'ChordSavvy';
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 p-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
            <Guitar className="text-primary" size={28} />
            <h1 className="font-headline text-2xl font-bold text-primary-foreground">ChordSavvy</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:h-16 md:px-6">
          <div className="flex items-center gap-4">
             <div className="md:hidden">
                <SidebarTrigger />
             </div>
             <h2 className="font-headline text-xl font-semibold hidden md:block">
              {getPageTitle()}
             </h2>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
