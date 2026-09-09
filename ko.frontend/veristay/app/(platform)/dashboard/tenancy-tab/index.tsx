'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { useGetTenancyInfoQuery } from '@/app/errors/listingsApi';
import { TenancyCard } from './TenancyCard';
import { TenancySkeleton } from './TenancySkeleton';

export function TenancyTab({ studentId }: { studentId: string }) {
    const {
        data:      tenancy,
        isLoading,
        isError,
        isFetching,
    } = useGetTenancyInfoQuery(studentId, { skip: !studentId });

    if (isLoading || isFetching) return <TenancySkeleton />;

    if (isError || !tenancy) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">My Tenancy</h2>
                <div className="rounded-xl border bg-background p-10 text-center">
                    <Home className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm font-medium text-muted-foreground">
                        No active tenancy found.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Once your application is approved and a tenancy is created,
                        your lease details will appear here.
                    </p>
                    <Link
                        href="/listings"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <Search className="h-4 w-4" />
                        Browse Properties
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">My Tenancy</h2>
            <TenancyCard tenancy={tenancy} />
        </div>
    );
}
