export function Section({
    title,
    icon: Icon,
    children,
}: {
    title:    string;
    icon:     React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                <Icon className="h-4 w-4 text-blue-600" />
                {title}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
