// components/dashboard/admin-dashboard.tsx

'use client';

import { useState } from 'react';
import {
    Users, Home, ClipboardList, ShieldCheck, ShieldX,
    AlertTriangle, BarChart3, CheckCircle, XCircle,
    Clock, ChevronRight, MapPin, Tag, BedDouble,
    Loader2, X, AlertCircle, Eye, Flag, FileText,
    TrendingUp, Building2, UserCheck, UserX,
} from 'lucide-react';
import {
    useGetAdminDashboardQuery,
    useApproveLandlordMutation,
    useRejectLandlordMutation,
    useAdminApprovePropertyMutation,
    useAdminRejectPropertyMutation,
    AdminLandlordDto,
    AdminPropertyDto,
} from '@/app/errors/listingsApi';

// =============================================
// Helpers
// =============================================

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function isPlaceholder(value: string | null | undefined) {
    if (!value) return true;
    const v = value.trim().toLowerCase();
    return v === 'string' || v === 'string - string' || v === '';
}

function safeBeds(count: number) {
    if (!Number.isFinite(count) || count > 100 || count <= 0) return null;
    return count;
}

function getLandlordStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Pending',   style: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        case 1: return { label: 'Approved',  style: 'bg-green-100  text-green-800  border-green-200'  };
        case 2: return { label: 'Rejected',  style: 'bg-red-100    text-red-800    border-red-200'    };
        case 3: return { label: 'Suspended', style: 'bg-gray-100   text-gray-700   border-gray-200'   };
        default: return { label: 'Unknown',  style: 'bg-gray-100   text-gray-700   border-gray-200'   };
    }
}

function getPropertyStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Pending Approval', style: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        case 1: return { label: 'Approved',          style: 'bg-green-100  text-green-800  border-green-200'  };
        case 2: return { label: 'Rejected',          style: 'bg-red-100    text-red-800    border-red-200'    };
        case 3: return { label: 'Delisted',          style: 'bg-gray-100   text-gray-700   border-gray-200'   };
        default: return { label: 'Unknown',          style: 'bg-gray-100   text-gray-700   border-gray-200'   };
    }
}

// =============================================
// Reusable UI
// =============================================

function StatusBadge({ label, style }: { label: string; style: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
            {label}
        </span>
    );
}

function StatCard({
    icon: Icon, label, value, sub, color, onClick, alert,
}: {
    icon: React.ElementType; label: string; value: string | number;
    sub?: string; color: string; onClick?: () => void; alert?: boolean;
}) {
    return (
        <div onClick={onClick}
            className={`relative flex items-start gap-4 rounded-xl border bg-background p-4 shadow-sm transition-shadow
                ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
                ${alert ? 'ring-2 ring-orange-400' : ''}`}>
            <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
                {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
            </div>
            {alert && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">!</span>
            )}
            {onClick && <ChevronRight className="h-4 w-4 text-muted-foreground self-center shrink-0" />}
        </div>
    );
}

function Section({
    title, icon: Icon, action, badge, children,
}: {
    title: string; icon: React.ElementType;
    action?: { label: string; onClick: () => void };
    badge?: number;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-blue-600" />
                    {title}
                    {badge !== undefined && badge > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {badge}
                        </span>
                    )}
                </div>
                {action && (
                    <button onClick={action.onClick} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        {action.label} <ChevronRight className="h-3 w-3" />
                    </button>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-80 rounded-xl bg-muted" />
                <div className="h-80 rounded-xl bg-muted" />
            </div>
        </div>
    );
}

// =============================================
// Landlord Review Modal
// =============================================

function LandlordReviewModal({
    landlord, onApprove, onReject, onClose, isLoading,
}: {
    landlord:  AdminLandlordDto;
    onApprove: () => void;
    onReject:  () => void;
    onClose:   () => void;
    isLoading: boolean;
}) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-blue-700 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                            {landlord.fullName?.charAt(0)?.toUpperCase() ?? 'L'}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{landlord.fullName ?? 'Landlord'}</h2>
                            <p className="text-sm text-blue-100">{landlord.email}</p>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="px-6 py-4 border-b bg-muted/30 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="font-medium">{landlord.phoneNumber || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Registered</p>
                            <p className="font-medium">{formatDate(landlord.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Properties</p>
                            <p className="font-medium">{landlord.propertiesCount}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <StatusBadge
                                label={getLandlordStatusLabel(landlord.verificationStatus).label}
                                style={getLandlordStatusLabel(landlord.verificationStatus).style}
                            />
                        </div>
                    </div>

                    {landlord.documentsUrl && (
                        <a href={landlord.documentsUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                            <FileText className="h-3.5 w-3.5" />
                            View Identification Document
                        </a>
                    )}
                </div>

                {/* Info */}
                <div className="px-6 py-4 border-b">
                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                        <p className="font-semibold mb-1">Admin Review Required</p>
                        <p>
                            Review the landlord's identification document and personal details.
                            Approving will give them full access to list properties. Rejecting
                            will notify them via email with instructions to reapply.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-5 space-y-3">
                    <button
                        onClick={() => { setAction('approve'); onApprove(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'approve'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <UserCheck className="h-4 w-4" />
                        }
                        Approve Landlord
                    </button>
                    <button
                        onClick={() => { setAction('reject'); onReject(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'reject'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <UserX className="h-4 w-4" />
                        }
                        Reject Application
                    </button>
                    <button onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Property Review Modal
// =============================================

function PropertyReviewModal({
    property, onApprove, onReject, onClose, isLoading,
}: {
    property:  AdminPropertyDto;
    onApprove: () => void;
    onReject:  () => void;
    onClose:   () => void;
    isLoading: boolean;
}) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const beds = safeBeds(property.availableBeds);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">

                <div className="bg-blue-700 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Review Property Listing</h2>
                    <p className="text-sm text-blue-100 mt-0.5">
                        {isPlaceholder(property.title) ? `Property #${property.id}` : property.title}
                    </p>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Landlord</p>
                            <p className="font-medium">{isPlaceholder(property.landlordName) ? '—' : property.landlordName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-blue-600" />
                                {isPlaceholder(property.city) ? '—' : property.city}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Monthly Rent</p>
                            <p className="font-bold text-blue-600">
                                {property.monthlyRent > 0 ? `R ${formatRent(property.monthlyRent)}` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Bedrooms</p>
                            <p className="font-medium">{beds ? `${beds} bed${beds === 1 ? '' : 's'}` : '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Address</p>
                            <p className="font-medium">{isPlaceholder(property.address) ? '—' : property.address}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Submitted</p>
                            <p className="font-medium">{formatDate(property.createdAt)}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-b">
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800">
                        <p className="font-semibold mb-1">⚠️ Compliance Check</p>
                        <p>
                            Verify that this property meets VeriStay's safety and quality standards
                            before approving. Once approved, students will be able to browse and apply.
                        </p>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-3">
                    <button
                        onClick={() => { setAction('approve'); onApprove(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'approve'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <CheckCircle className="h-4 w-4" />
                        }
                        Approve Listing
                    </button>
                    <button
                        onClick={() => { setAction('reject'); onReject(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'reject'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <XCircle className="h-4 w-4" />
                        }
                        Reject Listing
                    </button>
                    <button onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// City Distribution Chart
// =============================================

function CityDistributionChart({ data }: { data: { city: string; propertyCount: number; tenancyCount: number }[] }) {
    const max = Math.max(...data.map(d => d.propertyCount), 1);

    return (
        <div className="space-y-3">
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No distribution data yet.</p>
            ) : (
                data.slice(0, 8).map((item) => (
                    <div key={item.city}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">{item.city}</span>
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                                <span className="text-xs text-blue-600 font-semibold">{item.propertyCount} properties</span>
                                <span className="text-xs text-green-600 font-semibold">{item.tenancyCount} tenants</span>
                            </div>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all"
                                style={{ width: `${(item.propertyCount / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// =============================================
// Tabs
// =============================================

type Tab = 'overview' | 'landlords' | 'properties' | 'analytics';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',    label: 'Overview',    icon: BarChart3    },
    { id: 'landlords',   label: 'Landlords',   icon: Users        },
    { id: 'properties',  label: 'Properties',  icon: Home         },
    { id: 'analytics',   label: 'Analytics',   icon: TrendingUp   },
];

// =============================================
// Main Admin Dashboard
// =============================================

export function AdminDashboard() {
    const [activeTab, setActiveTab]               = useState<Tab>('overview');
    const [selectedLandlord, setSelectedLandlord] = useState<AdminLandlordDto | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<AdminPropertyDto | null>(null);
    const [actionLoading, setActionLoading]       = useState(false);

    const { data, isLoading, isError, isFetching, refetch } = useGetAdminDashboardQuery();

    const [approveLandlord] = useApproveLandlordMutation();
    const [rejectLandlord]  = useRejectLandlordMutation();
    const [approveProperty] = useAdminApprovePropertyMutation();
    const [rejectProperty]  = useAdminRejectPropertyMutation();

    const pendingLandlords  = data?.pendingLandlordsList  ?? [];
    const pendingProperties = data?.pendingPropertiesList ?? [];
    const cityDistribution  = data?.cityDistribution      ?? [];

    // ── Landlord actions ─────────────────────────────────────────────────
    async function handleApproveLandlord() {
        if (!selectedLandlord) return;
        setActionLoading(true);
        try {
            await approveLandlord(selectedLandlord.id).unwrap();
            setSelectedLandlord(null);
            refetch();
        } catch {
            // toast handled globally
        } finally {
            setActionLoading(false);
        }
    }

    async function handleRejectLandlord() {
        if (!selectedLandlord) return;
        setActionLoading(true);
        try {
            await rejectLandlord(selectedLandlord.id).unwrap();
            setSelectedLandlord(null);
            refetch();
        } catch {
            // toast handled globally
        } finally {
            setActionLoading(false);
        }
    }

    // ── Property actions ──────────────────────────────────────────────────
    async function handleApproveProperty() {
        if (!selectedProperty) return;
        setActionLoading(true);
        try {
            await approveProperty(selectedProperty.id).unwrap();
            setSelectedProperty(null);
            refetch();
        } catch {
            // toast handled globally
        } finally {
            setActionLoading(false);
        }
    }

    async function handleRejectProperty() {
        if (!selectedProperty) return;
        setActionLoading(true);
        try {
            await rejectProperty(selectedProperty.id).unwrap();
            setSelectedProperty(null);
            refetch();
        } catch {
            // toast handled globally
        } finally {
            setActionLoading(false);
        }
    }

    // ── Loading / Error ───────────────────────────────────────────────────
    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen w-full bg-muted/30">
                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="container mx-auto px-4 py-6 sm:px-8">
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen w-full bg-muted/30 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <AlertCircle className="h-10 w-10 mx-auto text-red-500" />
                    <p className="font-medium">Failed to load admin dashboard</p>
                    <button onClick={refetch}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const hasUrgentItems = pendingLandlords.length > 0 || pendingProperties.length > 0;

    return (
        <>
            <div className="min-h-screen w-full bg-muted/30">

                {/* ── Top bar ───────────────────────────────────────── */}
                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="container mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold sm:text-2xl">Admin Dashboard</h1>
                                <span className="inline-flex items-center gap-1 rounded-full border bg-blue-50 border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                    <ShieldCheck className="h-3 w-3" /> VeriStay Admin
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Platform oversight · Landlord verification · Property compliance
                            </p>
                        </div>
                        <button onClick={refetch}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors sm:mt-0">
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* ── Urgent alert bar ──────────────────────────────── */}
                {hasUrgentItems && (
                    <div className="border-b bg-red-50 px-4 py-3 sm:px-8">
                        <div className="container mx-auto flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                            <p className="text-sm text-red-800 flex-1">
                                <span className="font-semibold">Action required — </span>
                                {pendingLandlords.length > 0 && `${pendingLandlords.length} landlord${pendingLandlords.length > 1 ? 's' : ''} awaiting verification`}
                                {pendingLandlords.length > 0 && pendingProperties.length > 0 && ' · '}
                                {pendingProperties.length > 0 && `${pendingProperties.length} propert${pendingProperties.length > 1 ? 'ies' : 'y'} awaiting approval`}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Tabs ──────────────────────────────────────────── */}
                <div className="border-b bg-background">
                    <div className="container mx-auto overflow-x-auto px-4 sm:px-8">
                        <div className="flex gap-1 py-2">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {tab.id === 'landlords' && pendingLandlords.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            {pendingLandlords.length}
                                        </span>
                                    )}
                                    {tab.id === 'properties' && pendingProperties.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                            {pendingProperties.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Content ───────────────────────────────────────── */}
                <div className="container mx-auto px-4 py-6 sm:px-8">

                    {/* ======== OVERVIEW ======== */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <StatCard icon={Users}         label="Total Students"    value={data.totalStudents}      color="bg-blue-600"   />
                                <StatCard icon={Building2}     label="Total Landlords"   value={data.totalLandlords}     color="bg-purple-600" sub={`${data.pendingLandlords} pending`} alert={data.pendingLandlords > 0} onClick={() => setActiveTab('landlords')} />
                                <StatCard icon={Home}          label="Total Properties"  value={data.totalProperties}    color="bg-green-600"  sub={`${data.pendingProperties} pending`} alert={data.pendingProperties > 0} onClick={() => setActiveTab('properties')} />
                                <StatCard icon={ClipboardList} label="Applications"      value={data.totalApplications}  color="bg-orange-500" />
                                <StatCard icon={CheckCircle}   label="Active Tenancies"  value={data.totalTenancies}     color="bg-teal-600"   />
                                <StatCard icon={AlertTriangle} label="Open Maintenance"  value={data.openMaintenanceCount} color="bg-red-500"  />
                                <StatCard icon={ShieldCheck}   label="Verified Landlords" value={data.totalLandlords - data.pendingLandlords} color="bg-emerald-600" />
                                <StatCard icon={Flag}          label="Pending Review"    value={data.pendingLandlords + data.pendingProperties} color="bg-yellow-500" alert={(data.pendingLandlords + data.pendingProperties) > 0} />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">

                                {/* Pending Landlords */}
                                <Section title="Landlords Awaiting Verification" icon={Users}
                                    badge={pendingLandlords.length}
                                    action={{ label: 'View all', onClick: () => setActiveTab('landlords') }}>
                                    {pendingLandlords.length === 0 ? (
                                        <div className="text-center py-6 text-sm text-muted-foreground">
                                            <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-60" />
                                            <p>All landlords are verified! ✓</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pendingLandlords.slice(0, 4).map(l => (
                                                <div key={l.id}
                                                    onClick={() => setSelectedLandlord(l)}
                                                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 ring-1 ring-yellow-100 transition-all">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                                        {l.fullName?.charAt(0)?.toUpperCase() ?? 'L'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold truncate">{l.fullName ?? 'Landlord'}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{l.email}</p>
                                                        <p className="text-xs text-muted-foreground">Registered {formatDate(l.createdAt)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <StatusBadge label="Pending" style="bg-yellow-100 text-yellow-800 border-yellow-200" />
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Section>

                                {/* Pending Properties */}
                                <Section title="Properties Awaiting Approval" icon={Home}
                                    badge={pendingProperties.length}
                                    action={{ label: 'View all', onClick: () => setActiveTab('properties') }}>
                                    {pendingProperties.length === 0 ? (
                                        <div className="text-center py-6 text-sm text-muted-foreground">
                                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-60" />
                                            <p>No properties pending approval ✓</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pendingProperties.slice(0, 4).map(p => {
                                                const beds = safeBeds(p.availableBeds);
                                                return (
                                                    <div key={p.id}
                                                        onClick={() => setSelectedProperty(p)}
                                                        className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 ring-1 ring-yellow-100 transition-all">
                                                        <div className="rounded-lg bg-blue-50 p-2 shrink-0">
                                                            <Home className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold truncate">
                                                                {isPlaceholder(p.title) ? `Property #${p.id}` : p.title}
                                                            </p>
                                                            {!isPlaceholder(p.city) && (
                                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <MapPin className="h-3 w-3" /> {p.city}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {p.monthlyRent > 0 && (
                                                                    <span className="text-xs font-bold text-blue-600">R {formatRent(p.monthlyRent)}</span>
                                                                )}
                                                                {beds && (
                                                                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                                        <BedDouble className="h-3 w-3" /> {beds}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <StatusBadge label="Pending" style="bg-yellow-100 text-yellow-800 border-yellow-200" />
                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Section>
                            </div>

                            {/* City Distribution preview */}
                            <Section title="Accommodation Distribution by City" icon={TrendingUp}>
                                <CityDistributionChart data={cityDistribution} />
                            </Section>
                        </div>
                    )}

                    {/* ======== LANDLORDS ======== */}
                    {activeTab === 'landlords' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Landlord Verification ({pendingLandlords.length} pending)
                                </h2>
                                {pendingLandlords.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        {pendingLandlords.length} require review
                                    </span>
                                )}
                            </div>

                            {pendingLandlords.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center">
                                    <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-60" />
                                    <p className="font-medium">All landlords verified</p>
                                    <p className="text-sm text-muted-foreground mt-1">No pending applications to review.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingLandlords.map(l => (
                                        <div key={l.id}
                                            onClick={() => setSelectedLandlord(l)}
                                            className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 ring-1 ring-yellow-100 transition-all">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white shrink-0">
                                                        {l.fullName?.charAt(0)?.toUpperCase() ?? 'L'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold">{l.fullName ?? 'Landlord'}</p>
                                                        <p className="text-sm text-muted-foreground">{l.email}</p>
                                                        {l.phoneNumber && (
                                                            <p className="text-xs text-muted-foreground">{l.phoneNumber}</p>
                                                        )}
                                                        <div className="mt-1 flex items-center gap-3 flex-wrap">
                                                            <span className="text-xs text-muted-foreground">
                                                                Registered {formatDate(l.createdAt)}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {l.propertiesCount} {l.propertiesCount === 1 ? 'property' : 'properties'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <StatusBadge
                                                        label={getLandlordStatusLabel(l.verificationStatus).label}
                                                        style={getLandlordStatusLabel(l.verificationStatus).style}
                                                    />
                                                    {l.documentsUrl && (
                                                        <a href={l.documentsUrl} target="_blank" rel="noopener noreferrer"
                                                            onClick={e => e.stopPropagation()}
                                                            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors">
                                                            <Eye className="h-3.5 w-3.5" /> ID Doc
                                                        </a>
                                                    )}
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                                                <Clock className="h-4 w-4 shrink-0" />
                                                Awaiting identity verification. Tap to approve or reject this landlord.
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======== PROPERTIES ======== */}
                    {activeTab === 'properties' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Property Approvals ({pendingProperties.length} pending)
                                </h2>
                                {pendingProperties.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-800">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        {pendingProperties.length} pending
                                    </span>
                                )}
                            </div>

                            {pendingProperties.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-60" />
                                    <p className="font-medium">No properties pending approval</p>
                                    <p className="text-sm text-muted-foreground mt-1">All submitted listings have been reviewed.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingProperties.map(p => {
                                        const beds = safeBeds(p.availableBeds);
                                        return (
                                            <div key={p.id}
                                                onClick={() => setSelectedProperty(p)}
                                                className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 ring-1 ring-yellow-100 transition-all">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-lg bg-blue-50 p-2.5 shrink-0">
                                                            <Home className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold">
                                                                {isPlaceholder(p.title) ? `Property #${p.id}` : p.title}
                                                            </p>
                                                            {!isPlaceholder(p.landlordName) && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    Listed by {p.landlordName}
                                                                </p>
                                                            )}
                                                            {!isPlaceholder(p.address) && !isPlaceholder(p.city) && (
                                                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                                    {p.address}, {p.city}
                                                                </p>
                                                            )}
                                                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm">
                                                                {p.monthlyRent > 0 && (
                                                                    <span className="flex items-center gap-1 font-bold text-blue-600">
                                                                        <Tag className="h-3.5 w-3.5" />
                                                                        R {formatRent(p.monthlyRent)} / month
                                                                    </span>
                                                                )}
                                                                {beds && (
                                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                                        <BedDouble className="h-3.5 w-3.5" />
                                                                        {beds} {beds === 1 ? 'bedroom' : 'bedrooms'}
                                                                    </span>
                                                                )}
                                                                <span className="text-xs text-muted-foreground">
                                                                    Submitted {formatDate(p.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <StatusBadge
                                                            label={getPropertyStatusLabel(p.status).label}
                                                            style={getPropertyStatusLabel(p.status).style}
                                                        />
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                                                    <ShieldX className="h-4 w-4 shrink-0" />
                                                    This listing is hidden from students until approved. Tap to review.
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======== ANALYTICS ======== */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold">Accommodation Distribution Analytics</h2>

                            {/* Summary cards */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                                    <p className="text-xs text-muted-foreground">Platform Coverage</p>
                                    <p className="text-2xl font-bold text-blue-600">{cityDistribution.length}</p>
                                    <p className="text-xs text-muted-foreground">cities</p>
                                </div>
                                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                                    <p className="text-xs text-muted-foreground">Avg Properties/City</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {cityDistribution.length > 0
                                            ? Math.round(data.totalProperties / cityDistribution.length)
                                            : 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">properties</p>
                                </div>
                                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                                    <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {data.totalProperties > 0
                                            ? Math.round((data.totalTenancies / data.totalProperties) * 100)
                                            : 0}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">tenancies/properties</p>
                                </div>
                                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                                    <p className="text-xs text-muted-foreground">Application Rate</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {data.totalProperties > 0
                                            ? Math.round(data.totalApplications / data.totalProperties)
                                            : 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">apps per property</p>
                                </div>
                            </div>

                            {/* Distribution chart */}
                            <Section title="Properties & Tenancies by City" icon={BarChart3}>
                                <div className="mb-4 flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                                        <span className="text-muted-foreground">Properties</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-green-600" />
                                        <span className="text-muted-foreground">Active Tenancies</span>
                                    </div>
                                </div>
                                <CityDistributionChart data={cityDistribution} />
                            </Section>

                            {/* Platform health */}
                            <Section title="Platform Health" icon={ShieldCheck}>
                                <div className="space-y-3">
                                    {[
                                        {
                                            label: 'Landlord Verification Rate',
                                            value: data.totalLandlords > 0
                                                ? Math.round(((data.totalLandlords - data.pendingLandlords) / data.totalLandlords) * 100)
                                                : 0,
                                            color: 'bg-blue-600',
                                            sub: `${data.totalLandlords - data.pendingLandlords} of ${data.totalLandlords} verified`,
                                        },
                                        {
                                            label: 'Property Approval Rate',
                                            value: data.totalProperties > 0
                                                ? Math.round(((data.totalProperties - data.pendingProperties) / data.totalProperties) * 100)
                                                : 0,
                                            color: 'bg-green-600',
                                            sub: `${data.totalProperties - data.pendingProperties} of ${data.totalProperties} approved`,
                                        },
                                        {
                                            label: 'Student Housing Coverage',
                                            value: data.totalStudents > 0
                                                ? Math.round((data.totalTenancies / data.totalStudents) * 100)
                                                : 0,
                                            color: 'bg-purple-600',
                                            sub: `${data.totalTenancies} of ${data.totalStudents} students housed`,
                                        },
                                    ].map(metric => (
                                        <div key={metric.label}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium">{metric.label}</span>
                                                <span className="text-sm font-bold">{metric.value}%</span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                                <div className={`h-full rounded-full ${metric.color} transition-all`}
                                                    style={{ width: `${metric.value}%` }} />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{metric.sub}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modals ──────────────────────────────────────────── */}
            {selectedLandlord && (
                <LandlordReviewModal
                    landlord={selectedLandlord}
                    onApprove={handleApproveLandlord}
                    onReject={handleRejectLandlord}
                    onClose={() => setSelectedLandlord(null)}
                    isLoading={actionLoading}
                />
            )}
            {selectedProperty && (
                <PropertyReviewModal
                    property={selectedProperty}
                    onApprove={handleApproveProperty}
                    onReject={handleRejectProperty}
                    onClose={() => setSelectedProperty(null)}
                    isLoading={actionLoading}
                />
            )}
        </>
    );
}