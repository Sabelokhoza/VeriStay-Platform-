import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Item = {
    name: string;
    description: string;
    icon?: ReactNode;
    color?: string;
    time?: string;
};

export const Notification = ({ name, description, icon, color, time }: Item) => {
    return (
        <figure
            className={cn(
                'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
                'transition-all duration-200 ease-in-out hover:scale-[103%]',
                'bg-neutral-100 shadow-lg dark:bg-transparent dark:backdrop-blur-md dark:border dark:border-gray-800'
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl"
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <span className="text-lg">{icon}</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
                        <span className="text-sm sm:text-lg">{name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </figcaption>
                    <p className="text-sm font-normal text-gray-700 dark:text-white/60">
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    );
};
