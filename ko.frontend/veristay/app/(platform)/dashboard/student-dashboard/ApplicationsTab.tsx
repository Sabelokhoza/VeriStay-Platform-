import Link from 'next/link';
import { Search, CheckCircle } from 'lucide-react';
import { ApplicationDto } from '@/app/errors/listingsApi';
import { ApplicationCard } from './ApplicationCard';

export function ApplicationsTab({
    applications,
    isLoading,
    onOpenOffer,
}: {
    applications: ApplicationDto[];
    isLoading:    boolean;
    onOpenOffer:  (app: ApplicationDto) => void;
}) {
    const approvedCount = applications.filter(a => a.status === 1).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Applications</h2>
                <Link
                    href="/listing"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Search className="h-4 w-4" /> Find Properties
                </Link>
            </div>

            {approvedCount > 0 && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-800">
                        <span className="font-semibold">Action required:</span> You
                        have approved offers below. Tap on them to respond.
                    </p>
                </div>
            )}

            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-muted" />
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                    You haven't applied to any properties yet.{' '}
                    <Link
                        href="/listing"
                        className="text-blue-600 hover:underline"
                    >
                        Browse listings
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map((app: ApplicationDto) => (
                        <ApplicationCard key={app.id} app={app} onOpenOffer={onOpenOffer} />
                    ))}
                </div>
            )}
        </div>
    );
}
