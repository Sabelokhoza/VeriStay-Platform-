import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Section({
    title,
    icon: Icon,
    href,
    children,
}: {
    title: string;
    icon: React.ElementType;
    href?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-blue-600" />
                    {title}
                </div>
                {href && (
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                        View all <ChevronRight className="h-3 w-3" />
                    </Link>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
