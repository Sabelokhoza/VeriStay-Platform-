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
    Calendar,
    MapPin,
    Star,
} from 'lucide-react';

// =============================================
// Mock data — replace with RTK Query hooks
// =============================================

const mockStudent = {
    fullName: 'Sipho Tshabalala',
    studentNumber: '2021001234',
    email: 'sipho@university.ac.za',
    budget: 4500,
};

const mockApplications = [
    { id: 1, propertyTitle: '2 Bedroom Apartment - Bellville', city: 'Bellville', status: 'Pending',  appliedAt: '2026-06-01' },
    { id: 2, propertyTitle: 'Student Room - Rondebosch',      city: 'Rondebosch', status: 'Approved', appliedAt: '2026-05-20' },
    { id: 3, propertyTitle: 'Shared House - Mowbray',         city: 'Mowbray',    status: 'Rejected', appliedAt: '2026-05-10' },
];

const mockTenancy = {
    id: 1,
    propertyTitle: 'Student Room - Rondebosch',
    address: '14 Main Road, Rondebosch, Cape Town',
    landlordName: 'Mr. Petrus Van Wyk',
    leaseStart: '2026-02-01',
    leaseEnd:   '2026-11-30',
    monthlyRent: 3800,
};

const mockPayments = [
    { id: 1, month: 'June 2026',     amount: 3800, status: 'Paid',    paidAt: '2026-06-01' },
    { id: 2, month: 'July 2026',     amount: 3800, status: 'Pending', paidAt: null },
    { id: 3, month: 'August 2026',   amount: 3800, status: 'Pending', paidAt: null },
];

const mockMaintenance = [
    { id: 1, title: 'Leaking tap in bathroom', status: 'Open',       submittedAt: '2026-06-05', priority: 'Medium' },
    { id: 2, title: 'Broken window latch',      status: 'InProgress', submittedAt: '2026-05-28', priority: 'High'   },
    { id: 3, title: 'Geyser not heating',       status: 'Resolved',  submittedAt: '2026-05-10', priority: 'High'   },
];

const mockAnnouncements = [
    { id: 1, message: 'Scheduled water outage on 15 July from 9am–1pm.', postedAt: '2026-07-10', landlordName: 'Mr. Petrus Van Wyk' },
    { id: 2, message: 'Pest control inspection on 20 July. Please ensure access to all rooms.', postedAt: '2026-07-08', landlordName: 'Mr. Petrus Van Wyk' },
];

const mockWaitingList = [
    { id: 1, propertyTitle: '1 Bedroom Flat - Observatory', position: 2, city: 'Observatory' },
];

// =============================================
// Helpers
// =============================================

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusStyles: Record<string, string> = {
    Pending:    'bg-yellow-100 text-yellow-800 border-yellow-200',
    Approved:   'bg-green-100  text-green-800  border-green-200',
    Rejected:   'bg-red-100    text-red-800    border-red-200',
    Open:       'bg-blue-100   text-blue-800   border-blue-200',
    InProgress: 'bg-orange-100 text-orange-800 border-orange-200',
    Resolved:   'bg-green-100  text-green-800  border-green-200',
    Paid:       'bg-green-100  text-green-800  border-green-200',
    Overdue:    'bg-red-100    text-red-800    border-red-200',
};

const priorityStyles: Record<string, string> = {
    Low:       'text-green-600',
    Medium:    'text-yellow-600',
    High:      'text-red-600',
    Emergency: 'text-red-800 font-bold',
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] ?? 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}

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

function Section({
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
                    <Link href={href} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        View all <ChevronRight className="h-3 w-3" />
                    </Link>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

// =============================================
// Tabs
// =============================================

type Tab = 'overview' | 'applications' | 'tenancy' | 'payments' | 'maintenance' | 'community';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',     label: 'Overview',     icon: Home         },
    { id: 'applications', label: 'Applications', icon: ClipboardList },
    { id: 'tenancy',      label: 'My Tenancy',   icon: FileText     },
    { id: 'payments',     label: 'Payments',     icon: CreditCard   },
    { id: 'maintenance',  label: 'Maintenance',  icon: Wrench       },
    { id: 'community',    label: 'Community',    icon: Users        },
];

// =============================================
// Dashboard
// =============================================

export function StudentDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const approved   = mockApplications.filter(a => a.status === 'Approved').length;
    const pending    = mockApplications.filter(a => a.status === 'Pending').length;
    const paidCount  = mockPayments.filter(p => p.status === 'Paid').length;
    const openMaint  = mockMaintenance.filter(m => m.status !== 'Resolved').length;

    return (
        <div className="min-h-screen w-full bg-muted/30">
            {/* Top bar */}
            <div className="border-b bg-background px-4 py-4 sm:px-8">
                <div className="container mx-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold sm:text-2xl">
                            Welcome back, {mockStudent.fullName.split(' ')[0]} 👋
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mockStudent.studentNumber} · {mockStudent.email}
                        </p>
                    </div>
                    <Link
                        href="/listings"
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
                                    ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6 sm:px-8">

                {/* ===================== OVERVIEW ===================== */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <StatCard icon={ClipboardList} label="Applications"    value={mockApplications.length} sub={`${pending} pending`}            color="bg-blue-600"   />
                            <StatCard icon={CheckCircle}   label="Approved"         value={approved}                sub="accommodations"                    color="bg-green-600"  />
                            <StatCard icon={CreditCard}    label="Payments Made"    value={paidCount}               sub={`of ${mockPayments.length} months`} color="bg-purple-600" />
                            <StatCard icon={Wrench}        label="Open Requests"    value={openMaint}               sub="maintenance"                       color="bg-orange-600" />
                        </div>

                        {/* Budget */}
                        <div className="rounded-xl border bg-background p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                    Monthly Budget
                                </p>
                                <span className="text-sm text-muted-foreground">
                                    R {formatRent(mockStudent.budget)} / month
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{ width: `${Math.min((mockTenancy.monthlyRent / mockStudent.budget) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                <span>Rent: R {formatRent(mockTenancy.monthlyRent)}</span>
                                <span>{Math.round((mockTenancy.monthlyRent / mockStudent.budget) * 100)}% of budget used</span>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Recent Applications */}
                            <Section title="Recent Applications" icon={ClipboardList} href="#">
                                <div className="space-y-3">
                                    {mockApplications.slice(0, 3).map(app => (
                                        <div key={app.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                                            <div>
                                                <p className="text-sm font-medium">{app.propertyTitle}</p>
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                    <MapPin className="h-3 w-3" /> {app.city}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Applied: {formatDate(app.appliedAt)}
                                                </p>
                                            </div>
                                            <StatusBadge status={app.status} />
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* Announcements */}
                            <Section title="Landlord Announcements" icon={Bell} href="#">
                                {mockAnnouncements.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No announcements yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {mockAnnouncements.map(a => (
                                            <div key={a.id} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                                                <p className="text-sm">{a.message}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {a.landlordName} · {formatDate(a.postedAt)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Section>
                        </div>

                        {/* Waiting List */}
                        {mockWaitingList.length > 0 && (
                            <Section title="Waiting List" icon={Clock}>
                                <div className="space-y-3">
                                    {mockWaitingList.map(w => (
                                        <div key={w.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div>
                                                <p className="text-sm font-medium">{w.propertyTitle}</p>
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" /> {w.city}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-blue-600">#{w.position}</p>
                                                <p className="text-xs text-muted-foreground">in queue</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>
                )}

                {/* ===================== APPLICATIONS ===================== */}
                {activeTab === 'applications' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">My Applications</h2>
                            <Link
                                href="/listings"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Search className="h-4 w-4" /> Find Properties
                            </Link>
                        </div>

                        {mockApplications.length === 0 ? (
                            <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                                You haven't applied to any properties yet.{' '}
                                <Link href="/listings" className="text-blue-600 hover:underline">Browse listings</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {mockApplications.map(app => (
                                    <div key={app.id} className="rounded-xl border bg-background p-4 shadow-sm">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-lg bg-blue-50 p-2">
                                                        <Home className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{app.propertyTitle}</p>
                                                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <MapPin className="h-3.5 w-3.5" /> {app.city}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Applied on {formatDate(app.appliedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={app.status} />
                                                {app.status === 'Rejected' && (
                                                    <p className="text-xs text-muted-foreground">You may reapply elsewhere.</p>
                                                )}
                                            </div>
                                        </div>

                                        {app.status === 'Pending' && (
                                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                                                <AlertCircle className="h-4 w-4 shrink-0" />
                                                Your application is being reviewed by the landlord.
                                            </div>
                                        )}
                                        {app.status === 'Approved' && (
                                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800">
                                                <CheckCircle className="h-4 w-4 shrink-0" />
                                                Congratulations! Your application was approved.
                                            </div>
                                        )}
                                        {app.status === 'Rejected' && (
                                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                                                <XCircle className="h-4 w-4 shrink-0" />
                                                Unfortunately your application was not successful.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===================== TENANCY ===================== */}
                {activeTab === 'tenancy' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">My Tenancy</h2>

                        <div className="rounded-xl border bg-background p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-blue-50 p-3">
                                    <Home className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-bold">{mockTenancy.propertyTitle}</p>
                                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" /> {mockTenancy.address}
                                    </p>
                                    <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                        <Star className="h-3.5 w-3.5 text-blue-600" />
                                        Landlord: {mockTenancy.landlordName}
                                    </p>
                                </div>
                                <StatusBadge status="Approved" />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="rounded-lg bg-muted/50 p-3 text-center">
                                    <p className="text-xs text-muted-foreground">Monthly Rent</p>
                                    <p className="text-lg font-bold text-blue-600">R {formatRent(mockTenancy.monthlyRent)}</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-3 text-center">
                                    <p className="text-xs text-muted-foreground">Lease Start</p>
                                    <p className="text-sm font-semibold">{formatDate(mockTenancy.leaseStart)}</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-3 text-center col-span-2 sm:col-span-1">
                                    <p className="text-xs text-muted-foreground">Lease End</p>
                                    <p className="text-sm font-semibold">{formatDate(mockTenancy.leaseEnd)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lease Document */}
                        <Section title="Lease Documents" icon={FileText}>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium">Lease Agreement — {mockTenancy.propertyTitle}</p>
                                        <p className="text-xs text-muted-foreground">Signed · Valid until {formatDate(mockTenancy.leaseEnd)}</p>
                                    </div>
                                </div>
                                <button className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                                    Download
                                </button>
                            </div>
                        </Section>
                    </div>
                )}

                {/* ===================== PAYMENTS ===================== */}
                {activeTab === 'payments' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Rent Payments</h2>

                        <div className="grid grid-cols-3 gap-4">
                            <StatCard icon={CheckCircle} label="Paid"    value={mockPayments.filter(p => p.status === 'Paid').length}    sub="months"  color="bg-green-600"  />
                            <StatCard icon={Clock}       label="Pending" value={mockPayments.filter(p => p.status === 'Pending').length} sub="months"  color="bg-yellow-500" />
                            <StatCard icon={AlertCircle} label="Overdue" value={mockPayments.filter(p => p.status === 'Overdue').length} sub="months"  color="bg-red-600"    />
                        </div>

                        <div className="space-y-3">
                            {mockPayments.map(payment => (
                                <div key={payment.id} className="flex items-center justify-between rounded-xl border bg-background p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-lg p-2 ${payment.status === 'Paid' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                            <CreditCard className={`h-5 w-5 ${payment.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{payment.month}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {payment.paidAt ? `Paid on ${formatDate(payment.paidAt)}` : 'Not yet paid'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold">R {formatRent(payment.amount)}</p>
                                        <StatusBadge status={payment.status} />
                                        {payment.status === 'Pending' && (
                                            <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                                                Mark as Paid
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===================== MAINTENANCE ===================== */}
                {activeTab === 'maintenance' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Maintenance Requests</h2>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                                <Wrench className="h-4 w-4" /> New Request
                            </button>
                        </div>

                        <div className="space-y-3">
                            {mockMaintenance.map(req => (
                                <div key={req.id} className="rounded-xl border bg-background p-4 shadow-sm">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-lg bg-orange-50 p-2">
                                                <Wrench className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{req.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Submitted: {formatDate(req.submittedAt)}
                                                </p>
                                                <p className={`text-xs font-medium mt-0.5 ${priorityStyles[req.priority]}`}>
                                                    {req.priority} Priority
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={req.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===================== COMMUNITY ===================== */}
                {activeTab === 'community' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Property Community</h2>

                        {/* Announcements */}
                        <Section title="Landlord Announcements" icon={Bell}>
                            {mockAnnouncements.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No announcements yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {mockAnnouncements.map(a => (
                                        <div key={a.id} className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                            <p className="text-sm">{a.message}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">{a.landlordName}</p>
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" /> {formatDate(a.postedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* Housemates */}
                        <Section title="Housemates" icon={Users}>
                            <div className="space-y-3">
                                {['Amahle Dube', 'Keanu Petersen', 'Fatima Osman'].map((name) => (
                                    <div key={name} className="flex items-center gap-3 rounded-lg border p-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                            {name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{name}</p>
                                            <p className="text-xs text-muted-foreground">Tenant · Room {Math.floor(Math.random() * 5) + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Rate Landlord */}
                        <Section title="Rate Your Landlord" icon={Star}>
                            <div className="text-center space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    How has your experience been with <strong>{mockTenancy.landlordName}</strong>?
                                </p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} className="text-2xl text-yellow-400 hover:scale-110 transition-transform">
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    rows={3}
                                    placeholder="Leave a review for your landlord..."
                                    className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                                    Submit Review
                                </button>
                            </div>
                        </Section>
                    </div>
                )}
            </div>
        </div>
    );
}