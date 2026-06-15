'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { LayoutDashboard, User, BookOpen, Users, BarChart, Shield } from 'lucide-react';

const navigation = [
    {
        name: 'Dashboard',
        href: routes.partner.manage,
        icon: LayoutDashboard,
    },
    {
        name: 'Profile',
        href: routes.partner.profile,
        icon: User,
    },
    {
        name: 'Courses',
        href: routes.partner.courses.list,
        icon: BookOpen,
    },
    {
        name: 'Students',
        href: routes.partner.students,
        icon: Users,
    },
    {
        name: 'Reports',
        href: routes.partner.reports,
        icon: BarChart,
    },
    {
        name: 'Compliance',
        href: routes.partner.compliance,
        icon: Shield,
    },
];

export function PartnerSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-background">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Shield className="h-6 w-6" />
                    <span>TRAINERSCOUNCIL</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
