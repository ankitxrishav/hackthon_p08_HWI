'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { BarChart2, Leaf, Lightbulb, PlusCircle, User, Settings, LogOut } from 'lucide-react';
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
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';


const navItems = [
  { href: '/dashboard', icon: Leaf, label: 'Dashboard' },
  { href: '/add-activity', icon: PlusCircle, label: 'Add Activity' },
  { href: '/insights', icon: BarChart2, label: 'Insights' },
  { href: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  const getGreeting = () => {
      if (!user?.displayName) return 'Hello!';
      return `Hello, ${user.displayName.split(' ')[0]}!`;
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icons.logo className="size-8 text-primary" />
              <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
                Susthira
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
             <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/20 bg-background/70 backdrop-blur-lg px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg font-semibold md:text-xl">
                  {getGreeting()}
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
                              <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                              <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/profile"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
          {children}
          {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 h-16 rounded-2xl bg-background/70 backdrop-blur-lg border border-white/20 shadow-lg">
                <div className="grid h-full grid-cols-5 mx-auto">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                             <Link key={item.href} href={item.href} className={cn("inline-flex flex-col items-center justify-center p-2 hover:bg-muted/50 rounded-lg group transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                                <item.icon className="size-6 mb-1 transition-transform group-hover:scale-110" />
                                 {isActive && <motion.span layoutId="active-pill" className='absolute bottom-1 h-1 w-6 rounded-full bg-primary' />}
                             </Link>
                        )
                    })}
                     <Link href="/profile" className={cn("inline-flex flex-col items-center justify-center p-2 hover:bg-muted/50 rounded-lg group transition-colors", pathname.startsWith('/profile') ? "text-primary" : "text-muted-foreground")}>
                        <User className="size-6 mb-1 transition-transform group-hover:scale-110" />
                         {pathname.startsWith('/profile') && <motion.span layoutId="active-pill" className='absolute bottom-1 h-1 w-6 rounded-full bg-primary' />}
                    </Link>
                </div>
            </nav>
        </SidebarInset>
    </SidebarProvider>
  );
}
