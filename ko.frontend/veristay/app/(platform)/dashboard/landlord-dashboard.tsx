'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Home,
    ClipboardList,
    Wrench,
    Users,
    Plus,
    ChevronRight,
    MapPin,
    BedDouble,
    Tag,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    BarChart3,
    ShieldCheck,
    Calendar,
    Loader2,
    X,
    Search,
    FileText,
    Download,
    CreditCard,
    Megaphone,
    Star,
} from 'lucide-react';
import {
    useGetLandlordDashboardQuery,
    useAddPropertyMutation,
    useGetStudentApplicationQuery,
    useMarkMaintenanceResolvedMutation,
    MaintenanceStatus,
    ApplicationDto,
    useAddAnnouncementMutation,
    useGetLandlordAnnouncementsQuery,
    AnnouncementDto,
    LandlordPropertyDto,
    LandlordMaintenanceDto,
    useAcceptDeclineOfferMutation,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import ReputationSection, { LandlordPaymentsTab } from './landlord-payments-tab';
import AnnouncementsTab from './announcement-tab';

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

function safeBeds(count: number) {
    if (!Number.isFinite(count) || count > 100 || count <= 0) return null;
    return count;
}

function isPlaceholder(value: string | null | undefined) {
    if (!value) return true;
    const v = value.trim().toLowerCase();
    return v === 'n/a' || v === 'none' || v === 'unknown' || v === 'tbd' || v === 'tba';
}

function getPropertyStatusLabel(status: number) {
    switch (status) {
        case 0: return 'Pending Approval';
        case 1: return 'Approved';
        case 2: return 'Rejected';
        case 3: return 'Delisted';
        default: return 'Unknown';
    }
}

function getPropertyStatusStyle(status: number) {
    switch (status) {
        case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 1: return 'bg-green-100  text-green-800  border-green-200';
        case 2: return 'bg-red-100    text-red-800    border-red-200';
        case 3: return 'bg-gray-100   text-gray-700   border-gray-200';
        default: return 'bg-gray-100  text-gray-700   border-gray-200';
    }
}

function getAppStatusLabel(status: number) {
    switch (status) {
        case 0: return 'Pending';
        case 1: return 'Approved';
        case 2: return 'Rejected';
        case 4: return 'Accepted';
        default: return 'Unknown';
    }
}

function getAppStatusStyle(status: number) {
    switch (status) {
        case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 1: return 'bg-green-100  text-green-800  border-green-200';
        case 2: return 'bg-red-100    text-red-800    border-red-200';
        case 4: return 'bg-gray-100   text-gray-700   border-gray-200';
        default: return 'bg-gray-100  text-gray-700   border-gray-200';
    }
}

function getMaintPriorityLabel(priority: number) {
    switch (priority) {
        case 0: return { label: 'Low',       style: 'text-green-600'       };
        case 1: return { label: 'Medium',    style: 'text-yellow-600'      };
        case 2: return { label: 'High',      style: 'text-red-600'         };
        case 3: return { label: 'Emergency', style: 'text-red-800 font-bold' };
        default: return { label: 'Unknown',  style: 'text-gray-500'        };
    }
}

function getMaintStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Open',       style: 'bg-blue-100   text-blue-800   border-blue-200'   };
        case 1: return { label: 'In Progress', style: 'bg-orange-100 text-orange-800 border-orange-200' };
        case 2: return { label: 'Resolved',    style: 'bg-green-100  text-green-800  border-green-200'  };
        default: return { label: 'Unknown',    style: 'bg-gray-100   text-gray-700   border-gray-200'   };
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
    icon: Icon, label, value, sub, color, onClick,
}: {
    icon: React.ElementType; label: string; value: string | number;
    sub?: string; color: string; onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`flex items-start gap-4 rounded-xl border bg-background p-4 shadow-sm transition-shadow ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
        >
            <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
                {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
            </div>
            {onClick && <ChevronRight className="h-4 w-4 text-muted-foreground self-center shrink-0" />}
        </div>
    );
}

function Section({
    title, icon: Icon, action, children,
}: {
    title: string; icon: React.ElementType;
    action?: { label: string; onClick: () => void }; children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-blue-600" />
                    {title}
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
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-64 rounded-xl bg-muted" />
                <div className="h-64 rounded-xl bg-muted" />
            </div>
            <div className="h-48 rounded-xl bg-muted" />
        </div>
    );
}

// =============================================
// Add Property Modal
// =============================================

interface AddPropertyForm {
    title: string; description: string; address: string; city: string;
    monthlyRent: string; availableBeds: string; amenities: string; availableFrom: string;
}

const emptyForm: AddPropertyForm = {
    title: '', description: '', address: '', city: '',
    monthlyRent: '', availableBeds: '', amenities: '', availableFrom: '',
};

function AddPropertyModal({
    landlordId, onClose, onSuccess,
}: {
    landlordId: string; onClose: () => void; onSuccess: (id: number) => void;
}) {
    const [form, setForm]           = useState<AddPropertyForm>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [addProperty, { isLoading: isSubmitting, error: mutationError }] = useAddPropertyMutation();

    function update<K extends keyof AddPropertyForm>(key: K, value: AddPropertyForm[K]) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    const apiError = mutationError
        ? (mutationError as any)?.data?.message ?? 'Something went wrong.'
        : null;
    const error = formError ?? apiError;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        if (!form.title.trim() || !form.address.trim() || !form.city.trim()) {
            setFormError('Title, address, and city are required.');
            return;
        }

        const payload = {
            landlordId,
            title:         form.title.trim(),
            description:   form.description.trim(),
            address:       form.address.trim(),
            city:          form.city.trim(),
            monthlyRent:   Number(form.monthlyRent) || 0,
            availableBeds: Number(form.availableBeds) || 0,
            amenities:     form.amenities.split(',').map(a => a.trim()).filter(Boolean),
            availableFrom: form.availableFrom
                ? new Date(form.availableFrom).toISOString()
                : new Date().toISOString(),
        };

        try {
            const result = await addProperty(payload).unwrap();
            onSuccess(result.id);
        } catch {
            // surfaced via mutationError
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl bg-background shadow-xl overflow-hidden my-auto">
                <div className="bg-blue-600 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isSubmitting}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Add Property</h2>
                    <p className="text-sm text-blue-100 mt-0.5">List a new property for students to apply to.</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
                        <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
                            placeholder="e.g. Sunny 2-bed near campus"
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
                            placeholder="Describe the property..."
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Address <span className="text-destructive">*</span></label>
                            <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
                                placeholder="Street address"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium">City <span className="text-destructive">*</span></label>
                            <input type="text" value={form.city} onChange={e => update('city', e.target.value)}
                                placeholder="City"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Monthly Rent (R)</label>
                            <input type="number" min={0} value={form.monthlyRent}
                                onChange={e => update('monthlyRent', e.target.value)}
                                placeholder="e.g. 3500"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Available Beds</label>
                            <input type="number" min={1} max={20} value={form.availableBeds}
                                onChange={e => update('availableBeds', e.target.value)}
                                placeholder="e.g. 2"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Amenities</label>
                        <input type="text" value={form.amenities} onChange={e => update('amenities', e.target.value)}
                            placeholder="Comma-separated e.g. WiFi, Parking, Water"
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                        <p className="mt-1 text-xs text-muted-foreground">Separate each amenity with a comma.</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Available From</label>
                        <input type="date" value={form.availableFrom}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => update('availableFrom', e.target.value)}
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>

                    <div className="pt-2 space-y-3">
                        <button type="submit" disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create Property
                        </button>
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// =============================================
// Application Review Modal
// =============================================

function ApplicationReviewModal({
    app, onApprove, onReject, onClose, isLoading,
}: {
    app: ApplicationDto; onApprove: () => void; onReject: () => void;
    onClose: () => void; isLoading: boolean;
}) {
    const {
        data: details,
        isLoading: isLoadingDetails,
        isError: isDetailsError,
    } = useGetStudentApplicationQuery(app.id, { skip: !app.id });
    const [acceptDeclineOffer, { isLoading: isLoadingAcceptDecline }] = useAcceptDeclineOfferMutation();
    const [pending, setPending] = useState<'accept' | 'decline' | null>(null);

     async function handleApprove() {
        setPending('accept');
        try {
            const result = await acceptDeclineOffer({ applicationId: app.id, isAccepted: true });
            if ('data' in result) {
            }
        } finally {
            setPending(null);
        }
    }

    async function handleReject() {
        setPending('decline');
        try {
            const result = await acceptDeclineOffer({ applicationId: app.id, isAccepted: false });
            if ('data' in result) {
            }
        } finally {
            setPending(null);
        }
    }

    const studentName = details?.studentName ?? app.studentName;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
                <div className="bg-blue-600 px-6 py-5 text-white shrink-0">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Review Application</h2>
                    <p className="text-sm text-blue-100 mt-0.5">
                        {isPlaceholder(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                    </p>
                </div>

                <div className="overflow-y-auto">
                    <div className="px-6 py-4 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                {(studentName ?? app.studentId)?.charAt(0).toUpperCase() ?? 'S'}
                            </div>
                            <div>
                                <p className="font-semibold">{studentName ?? `Student #${app.studentId.slice(0, 8)}`}</p>
                                <p className="text-sm text-muted-foreground">Applied {formatDate(app.appliedAt)}</p>
                                {app.price > 0 && (
                                    <p className="text-sm font-bold text-blue-600">R {formatRent(app.price)} / month</p>
                                )}
                            </div>
                        </div>
                        {!isPlaceholder(app.propertyLocation) && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                {app.propertyLocation}
                            </p>
                        )}
                        {!isPlaceholder(app.supportingDocumentUrl) && (
                            <a href={app.supportingDocumentUrl} target="_blank" rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <FileText className="h-3.5 w-3.5" /> View Supporting Document
                            </a>
                        )}
                    </div>

                    {/* ── Documents ─────────────────────────────────── */}
                    <div className="px-6 py-4 border-b">
                        <p className="text-sm font-medium mb-2">Documents</p>

                        {isLoadingDetails ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading documents...
                            </div>
                        ) : isDetailsError ? (
                            <p className="text-sm text-red-600">Couldn't load this application's documents.</p>
                        ) : (
                            <div className="space-y-2">
                                {details && !isPlaceholder(details.proofOfRegistrationUrl) ? (
                                    <a
                                        href={details.proofOfRegistrationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            Proof of Registration
                                        </span>
                                        <Download className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No proof of registration uploaded.</p>
                                )}

                                {details && !isPlaceholder(details.proofOfIncomeUrl) ? (
                                    <a
                                        href={details.proofOfIncomeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            Proof of Income
                                        </span>
                                        <Download className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No proof of income uploaded.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-5 space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Review this application and choose to approve or reject it.
                            The student will be notified of your decision via email.
                        </p>
                        <button onClick={handleApprove} disabled={isLoading || pending === 'accept'}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                            {isLoading || pending === 'accept' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            Approve Application
                        </button>
                        <button onClick={handleReject} disabled={isLoading || pending === 'decline'}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50">
                            {isLoading || pending === 'decline' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                            Reject Application
                        </button>
                        <button onClick={onClose} disabled={isLoading}
                            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Maintenance Response Modal
// =============================================

function MaintenanceResponseModal({
    item, onClose, onResolve, isLoading,
}: {
    item: LandlordMaintenanceDto; onClose: () => void;
    onResolve: (response: string) => void; isLoading: boolean;
}) {
    const [response, setResponse] = useState('');
    const priority = getMaintPriorityLabel(item.priority);
    const status   = getMaintStatusLabel(item.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Maintenance Request</h2>
                    <p className="text-sm text-orange-100 mt-0.5">
                        {isPlaceholder(item.propertyTitle) ? `Property #${item.propertyId}` : item.propertyTitle}
                    </p>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30 space-y-2">
                    <p className="font-semibold">{isPlaceholder(item.title) ? 'Maintenance Issue' : item.title}</p>
                    {!isPlaceholder(item.description) && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs font-semibold ${priority.style}`}>{priority.label} Priority</span>
                        <StatusBadge label={status.label} style={status.style} />
                        <span className="text-xs text-muted-foreground">Submitted {formatDate(item.submittedAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Student ID: {item.studentId.slice(0, 8)}...</p>
                </div>

                <div className="px-6 py-5 space-y-3">
                    <label className="text-sm font-medium">Response / Resolution Note</label>
                    <textarea rows={3} value={response} onChange={e => setResponse(e.target.value)}
                        placeholder="Describe the action taken or planned response..."
                        className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
                    <button onClick={() => onResolve(response)} disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Mark as Resolved
                    </button>
                    <button onClick={onClose}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Tabs
// =============================================

type Tab = 'overview' | 'properties' | 'applications' | 'pending' |'tenants' | 'payments' | 'maintenance' | 'announcements' | 'reputation' ;

const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'overview',       label: 'Overview',       icon: BarChart3   },
    { id: 'properties',     label: 'Properties',     icon: Home        },
    { id: 'applications',   label: 'Applications',   icon: ClipboardList },
     {id: 'pending', label: 'Pending Applications', icon: ClipboardList },
    { id: 'tenants',        label: 'Tenants',        icon: Users       },
    { id: 'payments',       label: 'Payments',       icon: CreditCard  },
    { id: 'maintenance',    label: 'Maintenance',    icon: Wrench      },
    { id: 'announcements',  label: 'Announcements',  icon: Megaphone   }, 
    { id: 'reputation',     label: 'Reputation Score',     icon: Star        },
   
];


// =============================================
// Main Dashboard
// =============================================

export function LandlordDashboard() {
    const router = useRouter();  // ✅ correct import from next/navigation

    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [selectedApp, setSelectedApp]                   = useState<ApplicationDto | null>(null);
    const [selectedMaint, setSelectedMaint]               = useState<LandlordMaintenanceDto | null>(null);
    const [actionLoading, setActionLoading]               = useState(false);
    const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

    const userId = useAppSelector((state: any) => state.userAuthStore?.id ?? '');

    const { data, isLoading, isError, isFetching, refetch } =
        useGetLandlordDashboardQuery(userId, { skip: !userId });

    const landlord     = data?.landlord;
    const properties   = data?.propertiesDto       ?? [];
    const applications = data?.recentApplications  ?? [];
    const maintenance  = data?.openMantainances     ?? [];

    // De-duped in case the API repeats a tenant per active lease
    const tenants = Array.from(
        new Map((data?.tenants ?? []).map(t => [t.id, t])).values()
    );

    const pendingApps = applications.filter(a => a.status === 0);
    const openMaint   = maintenance.filter(m => m.status === 0 || m.status === 1);

    // ── Navigate to property manage page ─────────────────────────────────
    function goToProperty(id: number) {
        router.push(`/dashboard/property/${id}`);
    }

    // ── Application actions ───────────────────────────────────────────────
    async function handleApprove() {
        if (!selectedApp) return;
        setActionLoading(true);
        try {
            // TODO: await approveApplication(selectedApp.id)
            await new Promise(r => setTimeout(r, 800));
            setSelectedApp(null);
            refetch();
        } finally {
            setActionLoading(false);
        }
    }

    async function handleReject() {
        if (!selectedApp) return;
        setActionLoading(true);
        try {
            // TODO: await rejectApplication(selectedApp.id)
            await new Promise(r => setTimeout(r, 800));
            setSelectedApp(null);
            refetch();
        } finally {
            setActionLoading(false);
        }
    }

    const [markMaintenanceResolved] = useMarkMaintenanceResolvedMutation();

    async function handleResolve(response: string) {
        if (!selectedMaint) return;
        setActionLoading(true);
        try {
            await markMaintenanceResolved({
                id: selectedMaint.id,
                status: MaintenanceStatus.Resolved,
                landlordResponse: response,
            }).unwrap();
            setSelectedMaint(null);
            refetch();
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
                    <p className="font-medium">Failed to load dashboard</p>
                    <button onClick={refetch}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen w-full bg-muted/30">

                {/* ── Top bar ───────────────────────────────────────── */}
                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="container mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold sm:text-2xl">
                                    Welcome, {isPlaceholder(landlord?.fullName) ? 'Landlord' : landlord?.fullName?.split(' ')[0]} 👋
                                </h1>
                                <span className="inline-flex items-center gap-1 rounded-full border bg-blue-50 border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                    <ShieldCheck className="h-3 w-3" /> Landlord
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {landlord?.email}{landlord?.phoneNumber && ` · ${landlord.phoneNumber}`}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddPropertyModal(true)}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors sm:mt-0"
                        >
                            <Plus className="h-4 w-4" /> Add Property
                        </button>
                    </div>
                </div>

                {/* ── Pending alert bar ─────────────────────────────── */}
                {pendingApps.length > 0 && (
                    <div
                        className="border-b bg-orange-50 px-4 py-3 sm:px-8 cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setActiveTab('applications')}
                    >
                        <div className="container mx-auto flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                            <p className="text-sm text-orange-800 flex-1">
                                <span className="font-semibold">Action required —</span>{' '}
                                {pendingApps.length} student {pendingApps.length === 1 ? 'application is' : 'applications are'} waiting.
                            </p>
                            <ChevronRight className="h-4 w-4 text-orange-600 shrink-0" />
                        </div>
                    </div>
                )}

                {/* ── Tabs ──────────────────────────────────────────── */}
                <div className="border-b bg-background">
                    <div className="container mx-auto overflow-x-auto px-4 sm:px-8">
                        <div className="flex gap-1 py-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {tab.id === 'applications' && pendingApps.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            {pendingApps.length}
                                        </span>
                                    )}
                                    {tab.id === 'maintenance' && openMaint.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                            {openMaint.length}
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
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <StatCard icon={Home}          label="Properties"      value={data.propertiesCount}   sub={`${properties.filter(p => p.status === 0).length} pending`}     color="bg-blue-600"   onClick={() => setActiveTab('properties')}   />
                                <StatCard icon={ClipboardList} label="Applications"    value={data.applicationsCount} sub={`${pendingApps.length} pending review`}                           color="bg-orange-500" onClick={() => setActiveTab('applications')} />
                                <StatCard icon={Users}         label="Tenants"         value={tenants.length}         sub="active tenancies"                                                  color="bg-green-600"  onClick={() => setActiveTab('tenants')}      />
                                <StatCard icon={Wrench}        label="Open Maintenance" value={data.requestsCount}    sub="requests"                                                          color="bg-red-500"    onClick={() => setActiveTab('maintenance')}  />
                            </div>

                            {pendingApps.length > 0 && (
                                <div onClick={() => setActiveTab('applications')}
                                    className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 cursor-pointer hover:bg-orange-100 transition-colors">
                                    <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-orange-800">
                                            {pendingApps.length} pending {pendingApps.length === 1 ? 'application' : 'applications'} need your response
                                        </p>
                                        <p className="text-xs text-orange-700 mt-0.5">Students are waiting. Tap to review.</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-orange-600 shrink-0" />
                                </div>
                            )}

                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Recent Applications */}
                                <Section title="Recent Applications" icon={ClipboardList}
                                    action={{ label: 'View all', onClick: () => setActiveTab('applications') }}>
                                    {applications.length === 0 ? (
                                        <div className="text-center py-6 text-sm text-muted-foreground">
                                            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            <p>No applications yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {applications.slice(0, 4).map(app => (
                                                <div key={app.id}
                                                    onClick={app.status === 0 ? () => setSelectedApp(app) : undefined}
                                                    className={`flex items-center gap-3 rounded-lg border p-3 transition-all
                                                        ${app.status === 0 ? 'cursor-pointer hover:border-orange-300 hover:bg-orange-50 ring-1 ring-orange-100' : ''}`}>
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shrink-0">
                                                        {(app.studentName ?? app.studentId).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {app.studentName ?? `Student #${app.studentId.slice(0, 8)}`}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {isPlaceholder(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                                                        </p>
                                                        {app.price > 0 && (
                                                            <p className="text-xs font-bold text-blue-600">R {formatRent(app.price)} / month</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <StatusBadge label={getAppStatusLabel(app.status)} style={getAppStatusStyle(app.status)} />
                                                        {app.status === 0 && <ChevronRight className="h-4 w-4 text-orange-500" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Section>

                                {/* Properties */}
                                <Section title="My Properties" icon={Home}
                                    action={{ label: 'View all', onClick: () => setActiveTab('properties') }}>
                                    {properties.length === 0 ? (
                                        <div className="text-center py-6 text-sm text-muted-foreground">
                                            <Home className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            <p>No properties yet.</p>
                                            <button onClick={() => setShowAddPropertyModal(true)}
                                                className="mt-1 inline-block text-blue-600 hover:underline text-xs">
                                                Add your first property →
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {properties.slice(0, 3).map(p => {
                                                const beds = safeBeds(p.availableBeds);
                                                return (
                                                    <div key={p.id}
                                                        onClick={() => goToProperty(p.id)}
                                                        className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 hover:border-blue-300 transition-all">
                                                        <div className="rounded-lg bg-blue-50 p-2 shrink-0">
                                                            <Home className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {isPlaceholder(p.title) ? `Property #${p.id}` : p.title}
                                                            </p>
                                                            {!isPlaceholder(p.city) && (
                                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <MapPin className="h-3 w-3" /> {p.city}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {p.monthlyRent > 0 && (
                                                                    <span className="text-xs font-bold text-blue-600">R {formatRent(p.monthlyRent)} / month</span>
                                                                )}
                                                                {beds && (
                                                                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                                        <BedDouble className="h-3 w-3" /> {beds}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <StatusBadge label={getPropertyStatusLabel(p.status)} style={getPropertyStatusStyle(p.status)} />
                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Section>
                            </div>

                            {/* Maintenance */}
                            {maintenance.length > 0 && (
                                <Section title="Open Maintenance Requests" icon={Wrench}
                                    action={{ label: 'View all', onClick: () => setActiveTab('maintenance') }}>
                                    <div className="space-y-3">
                                        {maintenance.slice(0, 3).map(req => {
                                            const priority = getMaintPriorityLabel(req.priority);
                                            const status   = getMaintStatusLabel(req.status);
                                            return (
                                                <div key={req.id} onClick={() => setSelectedMaint(req)}
                                                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
                                                    <div className="rounded-lg bg-orange-50 p-2 shrink-0">
                                                        <Wrench className="h-4 w-4 text-orange-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {isPlaceholder(req.title) ? 'Maintenance Issue' : req.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {isPlaceholder(req.propertyTitle) ? `Property #${req.propertyId}` : req.propertyTitle}
                                                        </p>
                                                        <p className={`text-xs font-semibold ${priority.style}`}>{priority.label} Priority</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <StatusBadge label={status.label} style={status.style} />
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Section>
                            )}
                        </div>
                    )}

                    {/* ======== PROPERTIES ======== */}
                    {activeTab === 'properties' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">My Properties ({properties.length})</h2>
                                <button onClick={() => setShowAddPropertyModal(true)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                                    <Plus className="h-4 w-4" /> Add Property
                                </button>
                            </div>

                            {properties.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                                    <Home className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">No properties yet</p>
                                    <button onClick={() => setShowAddPropertyModal(true)}
                                        className="mt-2 inline-block text-blue-600 hover:underline text-sm">
                                        List your first property →
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {properties.map(p => {
                                        const beds = safeBeds(p.availableBeds);
                                        return (
                                            <div key={p.id} className="rounded-xl border bg-background shadow-sm overflow-hidden">
                                                {/* Clickable body */}
                                                <div onClick={() => goToProperty(p.id)}
                                                    className="flex flex-col gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-lg bg-blue-50 p-2.5 shrink-0">
                                                            <Home className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold">
                                                                {isPlaceholder(p.title) ? `Property #${p.id}` : p.title}
                                                            </p>
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
                                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                                    <Calendar className="h-3.5 w-3.5" />
                                                                    From {formatDate(p.availableFrom)}
                                                                </span>
                                                            </div>
                                                            {p.amenities.filter(a => !isPlaceholder(a)).length > 0 && (
                                                                <div className="mt-2 flex flex-wrap gap-1">
                                                                    {p.amenities.filter(a => !isPlaceholder(a)).slice(0, 4).map((a, i) => (
                                                                        <span key={i} className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs text-blue-700">{a}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-wrap sm:flex-col sm:items-end shrink-0">
                                                        <StatusBadge label={getPropertyStatusLabel(p.status)} style={getPropertyStatusStyle(p.status)} />
                                                        <StatusBadge
                                                            label={p.isAvailable ? 'Available' : 'Occupied'}
                                                            style={p.isAvailable ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Action bar */}
                                                <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
                                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                                        Tap card to manage details and images
                                                    </p>
                                                    <button onClick={() => goToProperty(p.id)}
                                                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                                                        <Search className="h-3.5 w-3.5" /> Manage Property
                                                    </button>
                                                </div>

                                                {p.status === 0 && (
                                                    <div className="flex items-center gap-2 border-t bg-yellow-50 px-4 py-2.5 text-xs text-yellow-800">
                                                        <Clock className="h-4 w-4 shrink-0" />
                                                        Awaiting admin approval. Students cannot see this listing yet.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======== APPLICATIONS ======== */}
                    {activeTab === 'applications' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Student Applications ({applications.length})</h2>
                                {pendingApps.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-800">
                                        <AlertCircle className="h-3.5 w-3.5" /> {pendingApps.length} pending
                                    </span>
                                )}
                            </div>

                            {applications.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p>No applications yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {applications.map(app => (
                                        <div key={app.id}
                                            onClick={app.status === 0 ? () => setSelectedApp(app) : undefined}
                                            className={`rounded-xl border bg-background p-4 shadow-sm transition-all
                                                ${app.status === 0 ? 'cursor-pointer hover:shadow-md hover:border-orange-300 ring-1 ring-orange-100' : ''}`}>
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                                        {(app.studentName ?? app.studentId).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold">{app.studentName ?? `Student #${app.studentId.slice(0, 8)}...`}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {isPlaceholder(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                                                        </p>
                                                        {!isPlaceholder(app.propertyLocation) && (
                                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <MapPin className="h-3 w-3 shrink-0" /> {app.propertyLocation}
                                                            </p>
                                                        )}
                                                        {app.price > 0 && (
                                                            <p className="text-sm font-bold text-blue-600 mt-0.5">R {formatRent(app.price)} / month</p>
                                                        )}
                                                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                            <Calendar className="h-3 w-3" /> Applied {formatDate(app.appliedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap shrink-0">
                                                    <StatusBadge label={getAppStatusLabel(app.status)} style={getAppStatusStyle(app.status)} />
                                                    {app.status === 0 && (
                                                        <span className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                                                            Tap to review
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {app.status === 0 && (
                                                <div className="mt-3 flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-800">
                                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                                    This application is awaiting your review. Tap to approve or reject.
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======== Pending APPLICATIONS ======== */}
                    {activeTab === 'pending' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Student Applications ({applications.length})</h2>
                                {pendingApps.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-800">
                                        <AlertCircle className="h-3.5 w-3.5" /> {pendingApps.length} pending
                                    </span>
                                )}
                            </div>

                            {applications.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p>No applications yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {applications.filter(app => app.status === 0).map(app => (
                                        <div key={app.id}
                                            onClick={app.status === 0 ? () => setSelectedApp(app) : undefined}
                                            className={`rounded-xl border bg-background p-4 shadow-sm transition-all
                                                ${app.status === 0 ? 'cursor-pointer hover:shadow-md hover:border-orange-300 ring-1 ring-orange-100' : ''}`}>
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                                        {(app.studentName ?? app.studentId).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold">{app.studentName ?? `Student #${app.studentId.slice(0, 8)}...`}</p>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {isPlaceholder(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                                                        </p>
                                                        {!isPlaceholder(app.propertyLocation) && (
                                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <MapPin className="h-3 w-3 shrink-0" /> {app.propertyLocation}
                                                            </p>
                                                        )}
                                                        {app.price > 0 && (
                                                            <p className="text-sm font-bold text-blue-600 mt-0.5">R {formatRent(app.price)} / month</p>
                                                        )}
                                                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                            <Calendar className="h-3 w-3" /> Applied {formatDate(app.appliedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap shrink-0">
                                                    <StatusBadge label={getAppStatusLabel(app.status)} style={getAppStatusStyle(app.status)} />
                                                    {app.status === 0 && (
                                                        <span className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                                                            Tap to review
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {app.status === 0 && (
                                                <div className="mt-3 flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-800">
                                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                                    This application is awaiting your review. Tap to approve or reject.
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    {/* ======== TENANTS ======== */}
                    {activeTab === 'tenants' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Active Tenants ({tenants.length})</h2>
                            {tenants.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p>No active tenants yet.</p>
                                    <p className="text-xs mt-1">Approve student applications to create tenancies.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tenants.map(tenant => (
                                        <div key={tenant.id} className="rounded-xl border bg-background p-4 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white shrink-0">
                                                    {(isPlaceholder(tenant.fullName) ? tenant.id : tenant.fullName).charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold">
                                                        {isPlaceholder(tenant.fullName) ? `Tenant #${tenant.id.slice(0, 8)}` : tenant.fullName}
                                                    </p>
                                                    {!isPlaceholder(tenant.email) && (
                                                        <p className="text-sm text-muted-foreground truncate">{tenant.email}</p>
                                                    )}
                                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                        {!isPlaceholder(tenant.phoneNumber) && <span>{tenant.phoneNumber}</span>}
                                                        {!isPlaceholder(tenant.university) && <span>{tenant.university}</span>}
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <StatusBadge label="Active Tenant" style="bg-green-100 text-green-800 border-green-200" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======== MAINTENANCE ======== */}
                    {activeTab === 'maintenance' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Maintenance Requests ({maintenance.length})</h2>
                                {openMaint.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                                        <AlertCircle className="h-3.5 w-3.5" /> {openMaint.length} open
                                    </span>
                                )}
                            </div>

                            {maintenance.length === 0 ? (
                                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                                    <Wrench className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p>No maintenance requests.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {maintenance.map(req => {
                                        const priority = getMaintPriorityLabel(req.priority);
                                        const status   = getMaintStatusLabel(req.status);
                                        return (
                                            <div key={req.id} onClick={() => setSelectedMaint(req)}
                                                className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-orange-300 transition-all">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`rounded-lg p-2 shrink-0 ${req.priority === 3 ? 'bg-red-50' : req.priority === 2 ? 'bg-orange-50' : 'bg-yellow-50'}`}>
                                                            <Wrench className={`h-5 w-5 ${req.priority === 3 ? 'text-red-600' : req.priority === 2 ? 'text-orange-600' : 'text-yellow-600'}`} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold">{isPlaceholder(req.title) ? 'Maintenance Issue' : req.title}</p>
                                                            {!isPlaceholder(req.description) && (
                                                                <p className="text-sm text-muted-foreground truncate">{req.description}</p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {isPlaceholder(req.propertyTitle) ? `Property #${req.propertyId}` : req.propertyTitle}
                                                            </p>
                                                            <div className="mt-1 flex items-center gap-3 flex-wrap">
                                                                <span className={`text-xs font-semibold ${priority.style}`}>{priority.label} Priority</span>
                                                                <span className="text-xs text-muted-foreground">Submitted {formatDate(req.submittedAt)}</span>
                                                                {req.photoUrls.filter(u => !isPlaceholder(u)).length > 0 && (
                                                                    <span className="text-xs text-muted-foreground">
                                                                        📷 {req.photoUrls.filter(u => !isPlaceholder(u)).length} photo(s)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <StatusBadge label={status.label} style={status.style} />
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </div>
                                                {req.landlordResponse && !isPlaceholder(req.landlordResponse) && (
                                                    <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
                                                        <span className="font-semibold">Your response: </span>{req.landlordResponse}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <LandlordPaymentsTab landlordId={landlord?.id ?? userId} />
                    )}
                    {activeTab === 'announcements' && (
                    <AnnouncementsTab
                        landlordId={landlord?.id ?? userId}
                        properties={properties}
                    />
                    
                )}

                {activeTab === 'reputation' && (
                        <ReputationSection landlordId={landlord?.id ?? userId} />
                    )}

                </div>
            </div>

            {/* ── Modals ──────────────────────────────────────────── */}
            {selectedApp && (
                <ApplicationReviewModal
                    app={selectedApp}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onClose={() => setSelectedApp(null)}
                    isLoading={actionLoading}
                />
            )}
            {selectedMaint && (
                <MaintenanceResponseModal
                    item={selectedMaint}
                    onClose={() => setSelectedMaint(null)}
                    onResolve={handleResolve}
                    isLoading={actionLoading}
                />
            )}
            {showAddPropertyModal && (
                <AddPropertyModal
                    landlordId={landlord?.id ?? userId}
                    onClose={() => setShowAddPropertyModal(false)}
                    onSuccess={(id) => {
                        setShowAddPropertyModal(false);
                        goToProperty(id);
                    }}
                />
            )}
        </>
    );
}