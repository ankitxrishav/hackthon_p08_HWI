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
import { Home, PlusCircle } from 'lucide-react';
import { Icons } from '../icons';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/add-activity') return 'Add Activity';
    return 'CarbonWise';
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
              <SidebarMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname === '/'} tooltip="Dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/add-activity" legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === '/add-activity'}
                    tooltip="Add Activity"
                  >
                    <PlusCircle />
                    <span>Add Activity</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
             <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold md:text-xl">
                  {getPageTitle()}
                </h1>
            </header>
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
