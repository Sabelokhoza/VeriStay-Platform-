// =============================================
// TenancyTab Component
// =============================================

import { useGetTenancyInfoQuery } from "@/app/errors/listingsApi";
import {
    Home,
    ClipboardList,
    Clock,
    CheckCircle,
    XCircle,
    Wrench,
    CreditCard,
    FileText,
    Bell,
    Users,
    Search,
    ChevronRight,
    AlertCircle,
    Calendar,
    MapPin,
    Star,
    X,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    Link,
} from 'lucide-react';
import { Section } from "./student-dashboard";

function TenancySkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 w-40 rounded bg-muted" />
            <div className="h-52 rounded-xl bg-muted" />
            <div className="h-24 rounded-xl bg-muted" />
        </div>
    );
}

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function getTenancyStatusLabel(status: number): string {
    switch (status) {
        case 0: return 'Active';
        case 1: return 'Ended';
        case 2: return 'Terminated';
        default: return 'Unknown';
    }
}

function getTenancyStatusStyle(status: number): string {
    switch (status) {
        case 0: return 'bg-green-100 text-green-800 border-green-200';
        case 1: return 'bg-gray-100  text-gray-700  border-gray-200';
        case 2: return 'bg-red-100   text-red-800   border-red-200';
        default: return 'bg-gray-100 text-gray-700  border-gray-200';
    }
}

export  function TenancyTab({ studentId }: { studentId: string }) {
    const {
        data: tenancy,
        isLoading,
        isError,
        isFetching,
    } = useGetTenancyInfoQuery(studentId, {
        skip: !studentId,
    });

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
                        your details will appear here.
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

    const statusLabel = getTenancyStatusLabel(tenancy.status);
    const statusStyle = getTenancyStatusStyle(tenancy.status);

    // Days remaining on lease
    const today     = new Date();
    const leaseEnd  = new Date(tenancy.leaseEndDate);
    const daysLeft  = Math.max(0, Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const leaseProgress = (() => {
        const start = new Date(tenancy.leaseStartDate).getTime();
        const end   = leaseEnd.getTime();
        const now   = today.getTime();
        return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
    })();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">My Tenancy</h2>

            {/* Main Tenancy Card */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-50 p-3 shrink-0">
                        <Home className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold truncate">
                            { tenancy.propertyTitle
                              }
                        </p>
                        {tenancy.location && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                {tenancy.location}
                            </p>
                        )}
                        {tenancy.landlordName &&  (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                <Star className="h-3.5 w-3.5 text-blue-600" />
                                Landlord: <span className="font-medium text-foreground ml-1">{tenancy.landlordName}</span>
                            </p>
                        )}
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0 ${statusStyle}`}>
                        {statusLabel}
                    </span>
                </div>

                {/* Key stats */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Monthly Rent</p>
                        <p className="text-lg font-bold text-blue-600">
                            R {formatRent(tenancy.monthlyRent)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Lease Start</p>
                        <p className="text-sm font-semibold">{formatDate(tenancy.leaseStartDate)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Lease End</p>
                        <p className="text-sm font-semibold">{formatDate(tenancy.leaseEndDate)}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Days Remaining</p>
                        <p className={`text-lg font-bold ${daysLeft <= 30 ? 'text-red-600' : 'text-foreground'}`}>
                            {daysLeft}
                        </p>
                    </div>
                </div>

                {/* Lease progress bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Lease Progress</span>
                        <span>{leaseProgress}% complete</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${
                                leaseProgress >= 80 ? 'bg-red-500' :
                                leaseProgress >= 50 ? 'bg-yellow-500' :
                                'bg-blue-600'
                            }`}
                            style={{ width: `${leaseProgress}%` }}
                        />
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                        <span>{formatDate(tenancy.leaseStartDate)}</span>
                        <span>{formatDate(tenancy.leaseEndDate)}</span>
                    </div>
                </div>

                {/* Expiry warning */}
                {daysLeft <= 30 && daysLeft > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Your lease expires in <strong className="mx-1">{daysLeft} days</strong>.
                        Please contact your landlord about renewal.
                    </div>
                )}
                {daysLeft === 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Your lease has ended. Please contact your landlord or browse new properties.
                    </div>
                )}
            </div>

            {/* Lease Documents */}
            <Section title="Lease Documents" icon={FileText}>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">
                                Lease Agreement —{' '}
                                {
                                     tenancy.propertyTitle
                                    }
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {statusLabel} · Valid until {formatDate(tenancy.leaseEndDate)}
                            </p>
                        </div>
                    </div>
                    <button className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                        Download
                    </button>
                </div>
            </Section>

            {/* Tenancy Summary */}
            <Section title="Tenancy Summary" icon={ClipboardList}>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Tenant</span>
                        <span className="font-medium">{tenancy.studentName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Property ID</span>
                        <span className="font-medium">#{tenancy.propertyId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span className="font-bold text-blue-600">R {formatRent(tenancy.monthlyRent)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Lease Duration</span>
                        <span className="font-medium">
                            {formatDate(tenancy.leaseStartDate)} → {formatDate(tenancy.leaseEndDate)}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyle}`}>
                            {statusLabel}
                        </span>
                    </div>
                </div>
            </Section>
        </div>
    );
}