import Link from 'next/link';
import {
    ClipboardList, CheckCircle, CreditCard, Wrench,
    Home, MapPin, FileText, Clock,
} from 'lucide-react';
import { ApplicationDto, StudentDashboardDataDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, getStatusLabel } from './utils';
import { StatCard } from './StatCard';
import { Section } from './Section';
import { OverviewSkeleton } from './OverviewSkeleton';
import { StatusBadge } from './StatusBadge';

export function OverviewTab({
    dashboardData,
    isLoading,
    isFetching,
    isError,
    applications,
    waitingList,
    onOpenOffer,
    onSwitchTab,
}: {
    dashboardData: StudentDashboardDataDto | undefined;
    isLoading:     boolean;
    isFetching:    boolean;
    isError:       boolean;
    applications:  ApplicationDto[];
    waitingList:   ApplicationDto[];
    onOpenOffer:   (app: ApplicationDto) => void;
    onSwitchTab:   (tab: 'applications' | 'tenancy') => void;
}) {
    if (isLoading || isFetching) return <OverviewSkeleton />;

    if (isError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                Failed to load dashboard data. Please try again later.
            </div>
        );
    }

    if (!dashboardData) return null;

    const student = dashboardData.student;
    const approvedApplications = applications.filter(a => a.status === 1);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard
                    icon={ClipboardList}
                    label="Applications"
                    value={dashboardData.applicationsCount}
                    sub={`${applications.filter(a => a.status === 0).length} pending`}
                    color="bg-blue-600"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved"
                    value={dashboardData.approvedCount}
                    sub="accommodations"
                    color="bg-green-600"
                />
                <StatCard
                    icon={CreditCard}
                    label="Payments Made"
                    value={dashboardData.paymentsCount}
                    sub="confirmed"
                    color="bg-purple-600"
                />
                <StatCard
                    icon={Wrench}
                    label="Open Requests"
                    value={dashboardData.requestsCount}
                    sub="maintenance"
                    color="bg-orange-600"
                />
            </div>

            {dashboardData.activeTenancy ? (
                <div className="rounded-xl border bg-background p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold flex items-center gap-2">
                            <Home className="h-4 w-4 text-blue-600" />
                            Active Tenancy
                        </p>
                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            ✓ Active
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-blue-50 p-2.5 shrink-0">
                            <Home className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                                {(dashboardData.activeTenancy.propertyTitle)
                                    ? `Property #${dashboardData.activeTenancy.propertyId}`
                                    : dashboardData.activeTenancy.propertyTitle}
                            </p>
                            {(dashboardData.activeTenancy.location) && (
                                <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                    {dashboardData.activeTenancy.location}
                                </p>
                            )}
                            {(dashboardData.activeTenancy.landlordName) && (
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Landlord:{' '}
                                    <span className="font-medium text-foreground">
                                        {dashboardData.activeTenancy.landlordName}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xs text-muted-foreground">Monthly Rent</p>
                            <p className="text-base font-bold text-blue-600">
                                R {formatRent(dashboardData.activeTenancy.monthlyRent)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xs text-muted-foreground">Lease End</p>
                            <p className="text-sm font-semibold">
                                {formatDate(dashboardData.activeTenancy.leaseEndDate)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xs text-muted-foreground">Days Left</p>
                            <p className={`text-base font-bold ${
                                Math.ceil((new Date(dashboardData.activeTenancy.leaseEndDate).getTime() - Date.now()) / 86400000) <= 30
                                    ? 'text-red-600'
                                    : 'text-foreground'
                            }`}>
                                {Math.max(0, Math.ceil(
                                    (new Date(dashboardData.activeTenancy.leaseEndDate).getTime() - Date.now()) / 86400000
                                ))}
                            </p>
                        </div>
                    </div>

                    {dashboardData.activeTenancy.leaseDocument &&
                     dashboardData.activeTenancy.leaseDocument !== '' && (
                        <div className="mt-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
                            <div className="flex items-center gap-2 text-sm text-green-800">
                                <FileText className="h-4 w-4 shrink-0" />
                                <span className="font-medium">Lease document available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={dashboardData.activeTenancy.leaseDocument}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-green-700 underline underline-offset-2 hover:text-green-900"
                                >
                                    View
                                </a>
                                <span className="text-green-400">·</span>
                                <a
                                    href={dashboardData.activeTenancy.leaseDocument}
                                    download={`lease-${dashboardData.activeTenancy.id}.pdf`}
                                    className="text-xs font-medium text-green-700 underline underline-offset-2 hover:text-green-900"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => onSwitchTab('tenancy')}
                        className="mt-3 w-full rounded-lg border py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                        Manage Tenancy →
                    </button>
                </div>
            ) : (
                student && student.budget > 0 && (
                    <div className="rounded-xl border bg-background p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                                Monthly Budget
                            </p>
                            <span className="text-sm text-muted-foreground">
                                R {formatRent(student.budget)} / month
                            </span>
                        </div>
                        <div className="rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30 py-4 text-center">
                            <Home className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground opacity-40" />
                            <p className="text-sm text-muted-foreground">
                                No active tenancy yet.
                            </p>
                            <button
                                onClick={() => onSwitchTab('applications')}
                                className="mt-2 text-xs text-blue-600 hover:underline"
                            >
                                View your applications →
                            </button>
                        </div>
                    </div>
                )
            )}

            {approvedApplications.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800">
                            You have {approvedApplications.length} approved{' '}
                            {approvedApplications.length === 1 ? 'offer' : 'offers'}!
                        </p>
                        <p className="text-xs text-green-700 mt-0.5">
                            Tap on the approved application to accept or decline the offer.
                        </p>
                    </div>
                    <button
                        onClick={() => onSwitchTab('applications')}
                        className="text-xs font-medium text-green-700 underline shrink-0"
                    >
                        View
                    </button>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Section title="Recent Applications" icon={ClipboardList} href="#">
                    {applications.length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>No applications yet.</p>
                            <Link href="/listing" className="mt-1 inline-block text-blue-600 hover:underline text-xs">
                                Browse properties →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {applications.slice(0, 3).map((app: ApplicationDto) => (
                                <div key={app.id}
                                    onClick={app.status === 1 ? () => onOpenOffer(app) : undefined}
                                    className={`flex items-start justify-between gap-3 rounded-lg border p-3 transition-all
                                        ${app.status === 1 ? 'cursor-pointer hover:border-green-300 hover:bg-green-50 ring-1 ring-green-100' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                                        </p>
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <MapPin className="h-3 w-3" />
                                            {(app.propertyLocation) ? 'Location not specified' : app.propertyLocation}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Applied: {formatDate(app.appliedAt)}
                                        </p>
                                        {app.price > 0 && (
                                            <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                                R {formatRent(app.price)} / month
                                            </p>
                                        )}
                                    </div>
                                    <StatusBadge status={getStatusLabel(app.status)} />
                                </div>
                            ))}
                        </div>
                    )}
                </Section>
            </div>

            {waitingList.length > 0 && (
                <Section title="Waiting List" icon={Clock}>
                    <div className="space-y-3">
                        {waitingList.map((w: ApplicationDto, idx: number) => (
                            <div key={w.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {(w.propertyTitle) ? `Property #${w.propertyId}` : w.propertyTitle}
                                    </p>
                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {(w.propertyLocation) ? 'Location not specified' : w.propertyLocation}
                                    </p>
                                    {w.price > 0 && (
                                        <p className="text-xs text-blue-600 font-semibold mt-0.5">
                                            R {formatRent(w.price)} / month
                                        </p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-blue-600">#{idx + 1}</p>
                                    <p className="text-xs text-muted-foreground">in queue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
}
