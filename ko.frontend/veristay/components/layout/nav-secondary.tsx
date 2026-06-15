'use client';

import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import SupportTab from '../platform/support-tab';
import { useState } from 'react';

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
    }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const pathname = usePathname();
    const [supportDialogOpen, setSupportDialogOpen] = useState(false);

    return (
        <>
            <SidebarGroup {...props}>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => {
                            const isActive = pathname.startsWith(item.url);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild size="sm">
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (item.title === 'Support') {
                                                    setSupportDialogOpen(true);
                                                }
                                            }}
                                            href={'#'}
                                            className={cn(
                                                'flex items-center gap-2 rounded-md p-2 text-sm font-medium',
                                                isActive
                                                    ? 'bg-primary/50 text-primary-foreground'
                                                    : 'hover:bg-muted'
                                            )}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <SupportTab open={supportDialogOpen} onOpenChange={setSupportDialogOpen} />
        </>
    );
}
