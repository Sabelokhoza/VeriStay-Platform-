'use client';

import { Role, useUser } from '@/hooks/use-user';
import { notFound } from 'next/navigation';

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
    const user = useUser();
    if (user.role === Role.Student) return notFound();
    return (
        <div>
            <main>{children}</main>
        </div>
    );
}
