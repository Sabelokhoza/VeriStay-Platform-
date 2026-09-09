import { ChevronRight } from 'lucide-react';

export function StatCard({
    icon: Icon, label, value, sub, color, onClick, alert,
}: {
    icon: React.ElementType; label: string; value: string | number;
    sub?: string; color: string; onClick?: () => void; alert?: boolean;
}) {
    return (
        <div onClick={onClick}
            className={`relative flex items-start gap-4 rounded-xl border bg-background p-4 shadow-sm transition-shadow
                ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
                ${alert ? 'ring-2 ring-orange-400' : ''}`}>
            <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
                {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
            </div>
            {alert && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">!</span>
            )}
            {onClick && <ChevronRight className="h-4 w-4 text-muted-foreground self-center shrink-0" />}
        </div>
    );
}
