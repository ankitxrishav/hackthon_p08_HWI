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
import { Leaf, PlusCircle } from 'lucide-react';
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
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Dashboard">
                  <Link href="/">
                    <Leaf />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/add-activity'}
                  tooltip="Add Activity"
                >
                  <Link href="/add-activity">
                    <PlusCircle />
                    <span>Add Activity</span>
                  </Link>
                </SidebarMenuButton>
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
