/* eslint-disable react/jsx-no-undef */
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    Flag ,
    Calendar,
    MapPin,
    Star,
    AlertTriangle ,
    BarChart3,
    X,
    ThumbsUp,
    ThumbsDown,
    Loader2,
} from 'lucide-react';
import {
   useGetStudentDashboardQuery,
   useGetHousematesQuery,
   useGetStudentMaintenanceRequestsQuery,
   ApplicationDto,
   AnnouncementDto,
   MaintenanceRequestDto,
   MaintenancePriority,
   MaintenanceStatus,
   useGetTenanciesByStudentIdQuery,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import { TenancyTab } from './tenancy-tab';
import { NewMaintenanceRequestModal } from './new-maintenance-request-modal';
import { CommunityTab } from './community-tab';
import { PaymentsTab } from './payments-tab';
import { StudentDisputesTab } from './student-dashboard-disbutes-tab';
import { StudentComplaintsTab } from './student-complaints-tab';

// =============================================
// Helpers
// =============================================

function getMaintenanceStatusLabel(status: MaintenanceStatus): string {
    switch (status) {
        case MaintenanceStatus.Open:
            return 'Open';
        case MaintenanceStatus.InProgress:
            return 'InProgress';
        case MaintenanceStatus.Resolved:
            return 'Resolved';
        case MaintenanceStatus.Rejected:
            return 'Rejected';
        default:
            return 'Unknown';
    }
}

function getPriorityLabel(priority: MaintenancePriority): string {
    switch (priority) {
        case MaintenancePriority.Low:
            return 'Low';
        case MaintenancePriority.Medium:
            return 'Medium';
        case MaintenancePriority.High:
            return 'High';
        case MaintenancePriority.Emergency:
            return 'Emergency';
        default:
            return 'Low';
    }
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

function getStatusLabel(status: number): string {
    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Approved';
        case 2:
            return 'Rejected';
        case 3:
            return 'WaitingList';
        case 4:
            return 'Accepted';
        case 5:
            return 'Declined';
        default:
            return 'Unknown';
    }
}

const statusStyles: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Approved: 'bg-green-100  text-green-800  border-green-200',
    Rejected: 'bg-red-100    text-red-800    border-red-200',
    Open: 'bg-blue-100   text-blue-800   border-blue-200',
    InProgress: 'bg-orange-100 text-orange-800 border-orange-200',
    Resolved: 'bg-green-100  text-green-800  border-green-200',
    Paid: 'bg-green-100  text-green-800  border-green-200',
    Overdue: 'bg-red-100    text-red-800    border-red-200',
};

const priorityStyles: Record<string, string> = {
    Low: 'text-green-600',
    Medium: 'text-yellow-600',
    High: 'text-red-600',
    Emergency: 'text-red-800 font-bold',
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] ?? 'bg-gray-100 text-gray-700'}`}
        >
            {status}
        </span>
    );
}

// =============================================
// Offer Modal
// =============================================

function OfferModal({
    app,
    onAccept,
    onDecline,
    onClose,
    isLoading,
}: {
    app: ApplicationDto;
    onAccept: () => void;
    onDecline: () => void;
    onClose: () => void;
    isLoading: boolean;
}) {
    const [confirming, setConfirming] = useState<'accept' | 'decline' | null>(null);

    function handleAccept() {
        setConfirming('accept');
        onAccept();
    }

    function handleDecline() {
        setConfirming('decline');
        onDecline();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-green-600 px-6 py-5 text-white">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-green-100 font-medium uppercase tracking-wide">
                                Application Approved
                            </p>
                            <h2 className="text-lg font-bold">You Have an Offer! 🎉</h2>
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="px-6 py-4 border-b bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Property</p>
                    <p className="font-semibold text-foreground">
                        {app.propertyTitle !== 'string' ? app.propertyTitle : 'Property'}
                    </p>
                    {app.propertyLocation && app.propertyLocation !== 'string - string' && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                            {app.propertyLocation}
                        </p>
                    )}
                    {app.landlordName && app.landlordName !== 'string' && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Landlord:{' '}
                            <span className="font-medium text-foreground">{app.landlordName}</span>
                        </p>
                    )}
                    <div className="mt-3 inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5">
                        <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-bold text-blue-700">
                            R {formatRent(app.price)} / month
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Congratulations! Your application has been approved by the landlord. Please
                        review the offer and let them know your decision.
                    </p>

                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800 mb-4">
                        <p className="font-semibold mb-1">⏰ Please respond promptly</p>
                        <p>
                            Landlords may offer your spot to another student if you don't respond
                            within a reasonable time. Accepting the offer confirms your intention to
                            move in.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Accept */}
                        <button
                            onClick={handleAccept}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && confirming === 'accept' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ThumbsUp className="h-4 w-4" />
                            )}
                            Accept Offer
                        </button>

                        {/* Decline */}
                        <button
                            onClick={handleDecline}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && confirming === 'decline' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ThumbsDown className="h-4 w-4" />
                            )}
                            Decline Offer
                        </button>

                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                        >
                            Decide later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Offer Result Modal
// =============================================

function OfferResultModal({
    type,
    onClose,
}: {
    type: 'accepted' | 'declined';
    onClose: () => void;
}) {
    const isAccepted = type === 'accepted';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-background p-8 shadow-xl text-center">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex justify-center mb-4">
                    <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${isAccepted ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                        {isAccepted ? (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : (
                            <XCircle className="h-8 w-8 text-red-600" />
                        )}
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-2">
                    {isAccepted ? 'Offer Accepted! 🏠' : 'Offer Declined'}
                </h2>

                <p className="text-sm text-muted-foreground mb-6">
                    {isAccepted
                        ? 'Great! You have accepted the offer. The landlord will be in touch with next steps for your move-in.'
                        : 'You have declined this offer. You can continue browsing other available properties.'}
                </p>

                <div className="flex flex-col gap-3">
                    {isAccepted ? (
                        <Link
                            href="/dashboard"
                            onClick={onClose}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors text-center"
                        >
                            Go to My Tenancy
                        </Link>
                    ) : (
                        <Link
                            href="/listing"
                            onClick={onClose}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors text-center"
                        >
                            Browse Properties
                        </Link>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Modal State
// =============================================

type ModalState =
    | { type: 'none' }
    | { type: 'offer'; app: ApplicationDto }
    | { type: 'result'; outcome: 'accepted' | 'declined' }
    | { type: 'new-maintenance-request' };
// =============================================
// Stat Card
// =============================================

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
    color: string;
}) {
    return (
        <div className="flex items-start gap-4 rounded-xl border bg-background p-4 shadow-sm">
            <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
                {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
            </div>
        </div>
    );
}

// =============================================
// Section wrapper
// =============================================
 
export function Section({
    title,
    icon: Icon,
    href,
    children,
}: {
    title: string;
    icon: React.ElementType;
    href?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-blue-600" />
                    {title}
                </div>
                {href && (
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                        View all <ChevronRight className="h-3 w-3" />
                    </Link>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function OverviewSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="h-20 rounded-xl bg-muted" />
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-48 rounded-xl bg-muted" />
                <div className="h-48 rounded-xl bg-muted" />
            </div>
        </div>
    );
}



type Tab = 'overview' | 'applications' | 'tenancy' |
           'payments' | 'maintenance' | 'community' |
           'disputes' | 'complaints';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',     label: 'Overview',     icon: BarChart3     },
    { id: 'applications', label: 'Applications', icon: ClipboardList },
    { id: 'tenancy',      label: 'My Tenancy',   icon: Home          },
    { id: 'payments',     label: 'Payments',     icon: CreditCard    },
    { id: 'maintenance',  label: 'Maintenance',  icon: Wrench        },
    { id: 'community',    label: 'Community',    icon: Users         },
    { id: 'disputes',     label: 'Disputes',     icon: AlertTriangle }, 
    { id: 'complaints', label: 'Complaints', icon: Flag },
];

const mockTenancy = {
    id: 1,
    propertyTitle: 'Student Room - Rondebosch',
    address: '14 Main Road, Rondebosch, Cape Town',
    landlordName: 'Mr. Petrus Van Wyk',
    leaseStart: '2026-02-01',
    leaseEnd: '2026-11-30',
    monthlyRent: 3800,
};

const mockPayments = [
    { id: 1, month: 'June 2026', amount: 3800, status: 'Paid', paidAt: '2026-06-01' },
    { id: 2, month: 'July 2026', amount: 3800, status: 'Pending', paidAt: null },
    { id: 3, month: 'August 2026', amount: 3800, status: 'Pending', paidAt: null },
];

const mockMaintenance = [
    {
        id: 1,
        title: 'Leaking tap in bathroom',
        status: 'Open',
        submittedAt: '2026-06-05',
        priority: 'Medium',
    },
    {
        id: 2,
        title: 'Broken window latch',
        status: 'InProgress',
        submittedAt: '2026-05-28',
        priority: 'High',
    },
    {
        id: 3,
        title: 'Geyser not heating',
        status: 'Resolved',
        submittedAt: '2026-05-10',
        priority: 'High',
    },
];

// =============================================
// Dashboard
// =============================================

export function StudentDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [modal, setModal] = useState<ModalState>({ type: 'none' });
    const [offerLoading, setOfferLoading] = useState(false);

    const userId = useAppSelector((state) => state.userAuthStore?.id);

   const {
        data: dashboardData,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetStudentDashboardQuery(userId, { skip: !userId });

    const {
        data: housemates = [],
        isLoading: housematesLoading,
        isError: housematesError,
    } = useGetHousematesQuery(userId ?? '', { skip: !userId });

   const {
        data: maintenanceRequests = [],
        isLoading: maintenanceLoading,
        isError: maintenanceError,
        refetch: refetchMaintenanceRequests,
    } = useGetStudentMaintenanceRequestsQuery(userId ?? '', { skip: !userId });

     const {
        data: tenancies = [],
        refetch: refetchMaintenance,
    } = useGetTenanciesByStudentIdQuery(userId ?? '', { skip: !userId });

    const student = dashboardData?.student;
    const applications = dashboardData?.applications ?? [];
    const waitingList = dashboardData?.waitingList ?? [];
    const announcements = dashboardData?.announcementDtos ?? [];

    const activeTenancy = tenancies.find((t) => t.status === 0) ?? tenancies[0] ?? null;
    const activePropertyId = activeTenancy?.propertyId ?? null;

    // ── Offer handlers ────────────────────────────────────────────────────
    function openOfferModal(app: ApplicationDto) {
        setModal({ type: 'offer', app });
    }

    async function handleAcceptOffer() {
        setOfferLoading(true);
        try {
            // TODO: replace with real RTK mutation e.g. await acceptOffer(app.id)
            await new Promise((r) => setTimeout(r, 1000));
            setModal({ type: 'result', outcome: 'accepted' });
            refetch();
        } finally {
            setOfferLoading(false);
        }
    }

    async function handleDeclineOffer() {
        setOfferLoading(true);
        try {
            // TODO: replace with real RTK mutation e.g. await declineOffer(app.id)
            await new Promise((r) => setTimeout(r, 1000));
            setModal({ type: 'result', outcome: 'declined' });
            refetch();
        } finally {
            setOfferLoading(false);
        }
    }

    // ── Application card renderer (shared between overview + applications tab)
    function ApplicationCard({ app }: { app: ApplicationDto }) {
        const statusLabel = getStatusLabel(app.status);
        const isApproved = statusLabel === 'Approved';

        return (
            <div
                key={app.id}
                onClick={isApproved ? () => openOfferModal(app) : undefined}
                className={`rounded-xl border bg-background p-4 shadow-sm transition-all
                    ${
                        isApproved
                            ? 'cursor-pointer hover:shadow-md hover:border-green-300 ring-1 ring-green-200'
                            : ''
                    }`}
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <div className="flex items-start gap-3">
                            <div
                                className={`rounded-lg p-2 shrink-0 ${isApproved ? 'bg-green-50' : 'bg-blue-50'}`}
                            >
                                <Home
                                    className={`h-5 w-5 ${isApproved ? 'text-green-600' : 'text-blue-600'}`}
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold truncate">
                                    {app.propertyTitle !== 'string'
                                        ? app.propertyTitle
                                        : 'Property'}
                                </p>
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    {app.propertyLocation !== 'string - string'
                                        ? app.propertyLocation
                                        : 'Location not specified'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Applied on {formatDate(app.appliedAt)}
                                </p>
                                <p className="text-sm font-bold text-blue-600 mt-0.5">
                                    R {formatRent(app.price)} / month
                                </p>
                                {app.landlordName && app.landlordName !== 'string' && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Landlord: {app.landlordName}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={statusLabel} />
                        {isApproved && (
                            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                                Tap to respond
                            </span>
                        )}
                    </div>
                </div>

                {/* Status banners */}
                {statusLabel === 'Pending' && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Your application is being reviewed by the landlord.
                    </div>
                )}
                {statusLabel === 'Approved' && (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 shrink-0" />
                            Congratulations! Tap this card to accept or decline the offer.
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                    </div>
                )}
                {statusLabel === 'Rejected' && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                        <XCircle className="h-4 w-4 shrink-0" />
                        Unfortunately your application was not successful.
                        {app.landlordNotes && (
                            <span className="ml-1">Reason: {app.landlordNotes}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen w-full bg-muted/30">
                {/* Top bar */}
                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="container mx-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                Welcome back,{' '}
                                {isLoading ? (
                                    <span className="inline-block h-5 w-24 animate-pulse rounded bg-muted align-middle" />
                                ) : (
                                    (student?.fullName?.split(' ')[0] ?? 'Student')
                                )}{' '}
                                👋
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {student?.studentNumber ? `${student.studentNumber} · ` : ''}
                                {student?.email ?? ''}
                            </p>
                        </div>
                        <Link
                            href="/listing"
                            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors sm:mt-0"
                        >
                            <Search className="h-4 w-4" />
                            Browse Properties
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b bg-background">
                    <div className="container mx-auto overflow-x-auto px-4 sm:px-8">
                        <div className="flex gap-1 py-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {/* Badge for approved applications */}
                                    {tab.id === 'applications' &&
                                        applications.filter((a) => a.status === 1).length > 0 && (
                                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                                                {applications.filter((a) => a.status === 1).length}
                                            </span>
                                        )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-6 sm:px-8">
                   {/* ===================== OVERVIEW ===================== */}
{activeTab === 'overview' && (
    <>
        {(isLoading || isFetching) && <OverviewSkeleton />}

        {isError && !isLoading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                Failed to load dashboard data. Please try again later.
            </div>
        )}

        {!isLoading && !isError && dashboardData && (
            <div className="space-y-6">

                {/* Stats */}
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

                {/* ── Active Tenancy Card ─────────────────────── */}
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

                        {/* Tenancy stats */}
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

                        {/* Lease document quick access */}
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
                            onClick={() => setActiveTab('tenancy')}
                            className="mt-3 w-full rounded-lg border py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Manage Tenancy →
                        </button>
                    </div>
                ) : (
                    // ── Budget card (no tenancy) ──────────────────────────
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
                                    onClick={() => setActiveTab('applications')}
                                    className="mt-2 text-xs text-blue-600 hover:underline"
                                >
                                    View your applications →
                                </button>
                            </div>
                        </div>
                    )
                )}

                {/* Approved offer alert */}
                {applications.filter(a => a.status === 1).length > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-green-800">
                                You have {applications.filter(a => a.status === 1).length} approved{' '}
                                {applications.filter(a => a.status === 1).length === 1 ? 'offer' : 'offers'}!
                            </p>
                            <p className="text-xs text-green-700 mt-0.5">
                                Tap on the approved application to accept or decline the offer.
                            </p>
                        </div>
                        <button
                            onClick={() => setActiveTab('applications')}
                            className="text-xs font-medium text-green-700 underline shrink-0"
                        >
                            View
                        </button>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Applications */}
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
                                        onClick={app.status === 1 ? () => openOfferModal(app) : undefined}
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

                    {/* Announcements */}
                    <Section title="Landlord Announcements" icon={Bell}>
                        {announcements.length === 0 ? (
                            <div className="text-center py-6 text-sm text-muted-foreground">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p>No announcements yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {announcements.map((a: AnnouncementDto) => (
                                    <div key={a.id} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                                        <p className="text-sm">{a.message}</p>
                                        <div className="mt-1 flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">{a.landlordName}</p>
                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(a.postedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

                {/* Waiting List */}
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
        )}
    </>
)}

                    {/* ===================== APPLICATIONS ===================== */}
                    {activeTab === 'applications' && (
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

                            {/* Approved banner */}
                            {applications.filter((a) => a.status === 1).length > 0 && (
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
                                        <ApplicationCard key={app.id} app={app} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ===================== TENANCY ===================== */}
                    {activeTab === 'tenancy' && (
                        <TenancyTab studentId={userId ?? ''} />
                    )}

                    {/* ===================== PAYMENTS ===================== */}
                   
                    {activeTab === 'payments' && (
                        <PaymentsTab studentId={userId ?? ''} />
                    )}
                   {/* ===================== MAINTENANCE ===================== */}
                    {activeTab === 'maintenance' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Maintenance Requests</h2>
                                <button
                                    onClick={() => setModal({ type: 'new-maintenance-request' })}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <Wrench className="h-4 w-4" /> New Request
                                </button>
                            </div>
                            {maintenanceLoading ? (
                                <div className="space-y-3 animate-pulse">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-20 rounded-xl bg-muted" />
                                    ))}
                                </div>
                            ) : maintenanceError ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                                    Failed to load maintenance requests.
                                </div>
                            ) : maintenanceRequests.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                                    <Wrench className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                    You haven't submitted any maintenance requests yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {maintenanceRequests.map((req: MaintenanceRequestDto) => {
                                        const statusLabel = getMaintenanceStatusLabel(req.status);
                                        const priorityLabel = getPriorityLabel(req.priority);
                                        return (
                                            <div
                                                key={req.id}
                                                className="rounded-xl border bg-background p-4 shadow-sm"
                                            >
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-lg bg-orange-50 p-2">
                                                            <Wrench className="h-5 w-5 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold">
                                                                {req.title}
                                                            </p>
                                                            {req.description && (
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    {req.description}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Submitted: {formatDate(req.submittedAt)}
                                                            </p>
                                                            <p
                                                                className={`text-xs font-medium mt-0.5 ${priorityStyles[priorityLabel]}`}
                                                            >
                                                                {priorityLabel} Priority
                                                            </p>
                                                            {req.landlordResponse && (
                                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                                    Landlord: {req.landlordResponse}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <StatusBadge status={statusLabel} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                 {/* ===================== COMMUNITY ===================== */}
            {activeTab === 'community' && (
                <CommunityTab
                    studentId={userId ?? ''}
                    activeTenancy={dashboardData?.activeTenancy ?? null}
                    announcements={announcements}
                />
            )}

            {activeTab === 'disputes' && (
    <StudentDisputesTab
        activeTenancy={dashboardData?.activeTenancy
            ? {
                landlordId:    dashboardData.activeTenancy.landlordName, // replace with landlordId when available
                propertyId:    dashboardData.activeTenancy.propertyId,
                propertyTitle: dashboardData.activeTenancy.propertyTitle,
            }
            : null
        }
    />
)}

        {activeTab === 'complaints' && (
            <StudentComplaintsTab
                activeTenancy={dashboardData?.activeTenancy
                    ? {
                        landlordId:    dashboardData.activeTenancy.landlordName,
                        propertyId:    dashboardData.activeTenancy.propertyId,
                        propertyTitle: dashboardData.activeTenancy.propertyTitle,
                    }
                    : null
                }
            />
        )}
                </div>
            </div>

            {/* ── Modals ───────────────────────────────────────────────── */}
            {modal.type === 'new-maintenance-request' && (
                <NewMaintenanceRequestModal
                    studentId={userId ?? ''}
                    propertyId={activePropertyId}
                    onClose={() => setModal({ type: 'none' })}
                    onSuccess={() => {
                        setModal({ type: 'none' });
                        refetchMaintenanceRequests();
                    }}
                />
            )}


            {modal.type === 'offer' && (
                <OfferModal
                    app={modal.app}
                    onAccept={handleAcceptOffer}
                    onDecline={handleDeclineOffer}
                    onClose={() => setModal({ type: 'none' })}
                    isLoading={offerLoading}
                />
            )}
            {modal.type === 'result' && (
                <OfferResultModal type={modal.outcome} onClose={() => setModal({ type: 'none' })} />
            )}
        </>
    );
}
