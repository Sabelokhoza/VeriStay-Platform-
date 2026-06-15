'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenuItem,
    NavbarMenu,
    NavbarContent,
    NavbarItem,
} from '@heroui/react';
import { Moon, Sun } from 'lucide-react';
import { NavLinkProps, NavLink } from '@/types/landing.d';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function LandingNavbar({ links }: NavLinkProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
    };

    return (
        <Navbar isBordered={false} isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
            </NavbarContent>

            <NavbarContent justify="start">
                <NavbarBrand></NavbarBrand>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex w-full justify-between gap-32"
                justify="center"
            >
                {links.map((link: NavLink) => (
                    <NavbarItem className="flex justify-center" key={link.key}>
                        <Link href={link.href}>
                            <a
                                onClick={() => scrollToSection(link.key)}
                                className={`cursor-pointer transition-colors ${
                                    activeSection === link.key
                                        ? 'text-primary font-bold border-b-2 border-primary' // Active state styling
                                        : 'text-gray-600'
                                }`}
                            >
                                {link.label}
                            </a>
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end" className="sm:fixed sm:right-16">
                <Button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-200 hidden sm:block"
                    aria-label="Toggle Dark Mode"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
            </NavbarContent>
            <NavbarContent>
                {links.map((link: NavLink) => (
                    <NavbarMenuItem key={link.key}>
                        <a
                            onClick={() => {
                                scrollToSection(link.key);
                                setIsMenuOpen(false);
                            }}
                            className={`w-full cursor-pointer ${
                                activeSection === link.key
                                    ? 'text-primary font-bold'
                                    : 'text-gray-600'
                            }`}
                        >
                            {link.label}
                        </a>
                    </NavbarMenuItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end" className="sm:fixed sm:right-16">
                <Button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-200 hidden sm:block"
                    aria-label="Toggle Dark Mode"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
            </NavbarContent>

            <NavbarMenu>
                {links.map((link: NavLink) => (
                    <NavbarMenuItem key={link.key}>
                        <a
                            onClick={() => {
                                scrollToSection(link.key);
                                setIsMenuOpen(false);
                            }}
                            className={`w-full cursor-pointer ${
                                activeSection === link.key
                                    ? 'text-primary font-bold'
                                    : 'text-gray-600'
                            }`}
                        >
                            {link.label}
                        </a>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
