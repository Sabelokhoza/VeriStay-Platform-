'use client';
import { Role, useUser } from '@/hooks/use-user';

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = useUser();
    if (user.role !== Role.Admin) {
        return null;
    }
    return (
        <div className="flex min-h-screen">
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
