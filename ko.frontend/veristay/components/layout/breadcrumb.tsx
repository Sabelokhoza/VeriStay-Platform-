'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toTitleCase } from '@/lib/utils';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '../shared';

const BreadcrumbPath = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    return (
        <div className="flex justify-between items-center">
            <Breadcrumb className="ml-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">
                            <HomeIcon size={16} aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {segments.map((segment: string, index: number) => {
                        const href = '/' + segments.slice(0, index + 1).join('/');
                        const isLast = index === segments.length - 1;

                        return (
                            <BreadcrumbItem key={href}>
                                {isLast ? (
                                    <BreadcrumbPage>{toTitleCase(segment)}</BreadcrumbPage>
                                ) : (
                                    <>
                                        <BreadcrumbLink asChild>
                                            <Link href={href}>{toTitleCase(segment)}</Link>
                                        </BreadcrumbLink>
                                        <BreadcrumbSeparator />
                                    </>
                                )}
                            </BreadcrumbItem>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
            <nav className=" justify-end">
                <ThemeSwitcher />
            </nav>
        </div>
    );
};

export default BreadcrumbPath;
