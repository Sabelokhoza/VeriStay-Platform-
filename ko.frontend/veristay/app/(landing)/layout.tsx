'use client';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import { cn } from '@/lib/utils';
import { montserrat } from '@/lib/fonts';
import { GraduationCap, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingLayout({ children }: { readonly children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div>
            <div className="flex min-h-screen flex-col">
                <header
                    className={`${montserrat.className} fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/50 border-b border-border/50`}
                >
                    <div className="container mx-auto flex h-20 items-center justify-between px-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 font-bold transition-transform hover:scale-105"
                        >
                            <GraduationCap className="h-7 w-7 text-primary" />
                            <span className="text-lg tracking-wide">VeriStay</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/#process"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                How it Works
                            </Link>
                            <Link
                                href="/#reasons"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Why Us
                            </Link>
                            <Link
                                href="/listings"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Listings
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:scale-105"
                            >
                                Get Started
                            </Link>
                            <ThemeSwitcher />
                        </nav>

                        {/* Mobile Navigation */}
                        <div className="md:hidden flex items-center gap-2">
                            <ThemeSwitcher />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                aria-label="Toggle mobile menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
                            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                                <Link
                                    href="/#process"
                                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    How it Works
                                </Link>
                                <Link
                                    href="/#reasons"
                                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Why Us
                                </Link>
                                <Link
                                    href="/listings"
                                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Listings
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all text-center mt-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </nav>
                        </div>
                    )}
                </header>
                <div className="flex-1 w-full items-center justify-center ">
                    <div
                        className={cn(
                            'absolute inset-0',
                            '[background-size:40px_40px]',
                            '[background-image:linear-gradient(to_right,#e4e4e1_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
                            'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
                        )}
                    />
                    {/* Radial gradient for the container to give a faded look */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
                    <main className="relative z-10">{children}</main>
                </div>
            </div>
        </div>
    );
}
