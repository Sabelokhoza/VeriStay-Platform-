export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-64 rounded-xl bg-muted" />
                <div className="h-64 rounded-xl bg-muted" />
            </div>
            <div className="h-48 rounded-xl bg-muted" />
        </div>
    );
}
