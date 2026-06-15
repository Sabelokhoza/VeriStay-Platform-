'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { studentSidebarItems, adminSidebarItems } from '@/types/platform';
import { SidebarLink } from '@/types/platform.d';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/manage') ?? false;
  const sidebarItems = isAdmin ? adminSidebarItems : studentSidebarItems;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="pt-4">
        {sidebarItems.map((item: SidebarLink) => {
          const isActive = pathname === item.href;
          return (
            <SidebarMenuItem className="p-2" key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
