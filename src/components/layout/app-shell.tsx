'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { BarChart2, Leaf, Lightbulb, PlusCircle, User } from 'lucide-react';
import { Icons } from '../icons';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', icon: Leaf, label: 'Dashboard' },
  { href: '/add-activity', icon: PlusCircle, label: 'Add Activity' },
  { href: '/insights', icon: BarChart2, label: 'Insights' },
  { href: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    const activeItem = navItems.find(item => pathname.startsWith(item.href));
    return activeItem ? activeItem.label : 'CarbonWise';
  };

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Icons.logo className="size-8 text-primary" />
              <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
                CarbonWise
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
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
             <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold md:text-xl">
                  {getPageTitle()}
                </h1>
                <div className="ml-auto">
                    <Button asChild size="sm">
                        <Link href="/add-activity">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Log Activity
                        </Link>
                    </Button>
                </div>
            </header>
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
