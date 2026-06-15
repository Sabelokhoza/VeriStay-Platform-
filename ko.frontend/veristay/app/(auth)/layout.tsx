'use client';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <header className="bg-transparent sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold">
                        <GraduationCap className="h-6 w-6" />
                        <span>TRAINERSCOUNCIL</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <ThemeSwitcher />
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </div>
    );
}
