export function PaymentsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 w-40 rounded bg-muted" />
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="h-32 rounded-xl bg-muted" />
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-muted" />
                ))}
            </div>
        </div>
    );
}
