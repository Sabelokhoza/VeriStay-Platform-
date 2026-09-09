import { ChevronRight } from 'lucide-react';

export function Section({
    title, icon: Icon, action, badge, children,
}: {
    title: string; icon: React.ElementType;
    action?: { label: string; onClick: () => void };
    badge?: number;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-blue-600" />
                    {title}
                    {badge !== undefined && badge > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {badge}
                        </span>
                    )}
                </div>
                {action && (
                    <button onClick={action.onClick} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        {action.label} <ChevronRight className="h-3 w-3" />
                    </button>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
