import { cn } from '@/lib/utils';
import React from 'react';
import { Shield, Lock, KeyRound } from 'lucide-react';

interface BackgroundDotProps {
    readonly children: React.ReactNode;
}

export function BackgroundDot({ children }: BackgroundDotProps) {
    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden">
            {/* Dot Grid Pattern */}
            <div
                className={cn(
                    'fixed inset-0 z-0 opacity-[0.15] dark:opacity-[0.12]',
                    '[background-size:30px_30px]',
                    '[background-image:radial-gradient(circle_at_15px_15px,hsl(var(--muted-foreground))_2px,transparent_2px)]'
                )}
            />

            {/* Line Grid Pattern */}
            <div
                className={cn(
                    'fixed inset-0 z-0 opacity-[0.08] dark:opacity-[0.06]',
                    '[background-size:60px_60px]',
                    '[background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]'
                )}
            />

            {/* Larger Grid Pattern */}
            <div
                className={cn(
                    'fixed inset-0 z-0 opacity-[0.05] dark:opacity-[0.04]',
                    '[background-size:120px_120px]',
                    '[background-image:linear-gradient(to_right,hsl(var(--muted-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground))_1px,transparent_1px)]'
                )}
            />

            {/* Floating Security Icons */}
            <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
                <Shield className="absolute text-primary/[0.03] dark:text-primary/[0.05] w-96 h-96 -top-20 -left-20 rotate-12" />
                <Lock className="absolute text-primary/[0.03] dark:text-primary/[0.05] w-72 h-72 bottom-10 right-10 -rotate-12" />
                <KeyRound className="absolute text-primary/[0.03] dark:text-primary/[0.05] w-64 h-64 top-1/3 left-1/4 rotate-45" />
            </div>

            {/* Content Layer */}
            <div className="relative z-20">{children}</div>
        </div>
    );
}
