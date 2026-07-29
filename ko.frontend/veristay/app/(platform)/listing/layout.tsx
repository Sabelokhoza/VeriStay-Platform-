'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <header className="bg-transparent sticky top-0 z-50">
            </header>
            <main className="flex-1">{children}</main>
        </div>
    );
}
