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
import { BarChart2, Leaf, Lightbulb, PlusCircle, User, Settings } from 'lucide-react';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const navItems = [
  { href: '/dashboard', icon: Leaf, label: 'Dashboard' },
  { href: '/add-activity', icon: PlusCircle, label: 'Add Activity' },
  { href: '/insights', icon: BarChart2, label: 'Insights' },
  { href: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    const activeItem = navItems.find(item => pathname.startsWith(item.href));
    return activeItem ? activeItem.label : 'Profile';
  };
  
  const isProfilePage = pathname.startsWith('/profile');

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icons.logo className="size-8 text-primary" />
              <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
                CarbonWise
              </span>
            </Link>
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
             <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold md:text-xl">
                  {isProfilePage ? 'Profile' : `Hello, Alex!`}
                </h1>
                <div className="ml-auto flex items-center gap-4">
                    <Button asChild size="sm" className="hidden sm:flex">
                        <Link href="/add-activity">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Log Activity
                        </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@shadcn" />
                              <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2" />Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/profile"><Settings className="mr-2" />Settings</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Sign Out</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
