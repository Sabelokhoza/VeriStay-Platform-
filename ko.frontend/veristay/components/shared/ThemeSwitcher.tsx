'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:cursor-pointer p-2 rounded-full bg-primary/20 shadow-lg text-primary/60 border-2 border-primary/60 hidden sm:block"
                aria-label="Toggle Dark Mode"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    );
}
