'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import BreadcrumbPath from '@/components/layout/breadcrumb';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col min-w-0">
                <header className="py-4 px-4 w-full">
                    <BreadcrumbPath />
                </header>
                <main className="px-20 flex-1 bg-muted/40 dark:bg-muted/30">{children}</main>
            </div>
        </SidebarProvider>
    );
}
