// =============================================
// components/dashboard/student-complaints-tab.tsx
// =============================================

'use client';

import { useState } from 'react';
import {
    Flag, X, Loader2, CheckCircle, Clock,
    AlertCircle, ChevronRight, Home, Calendar,
    ShieldCheck, MessageSquare, Bell,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    useGetComplaintsQuery,
    useAddComplaintMutation,
    ComplaintDto,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';

// =============================================
// Helpers
// =============================================

function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function getComplaintTypeInfo(type: number) {
    switch (type) {
        case 0: return { label: 'Vacancy',             style: 'bg-blue-100   text-blue-800   border-blue-200'   };
        case 1: return { label: 'Property Condition',  style: 'bg-orange-100 text-orange-800 border-orange-200' };
        case 2: return { label: 'Landlord Behaviour',  style: 'bg-red-100    text-red-800    border-red-200'    };
        case 3: return { label: 'Other',               style: 'bg-gray-100   text-gray-700   border-gray-200'   };
        default: return { label: 'Unknown',            style: 'bg-gray-100   text-gray-700   border-gray-200'   };
    }
}

function getComplaintStatusInfo(status: number) {
    switch (status) {
        case 0: return { label: 'Open',         style: 'bg-red-100    text-red-800    border-red-200',    icon: AlertCircle };
        case 1: return { label: 'Under Review',  style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock       };
        case 2: return { label: 'Resolved',      style: 'bg-green-100  text-green-800  border-green-200',  icon: CheckCircle };
        case 3: return { label: 'Dismissed',     style: 'bg-gray-100   text-gray-700   border-gray-200',   icon: X           };
        default: return { label: 'Unknown',      style: 'bg-gray-100   text-gray-700   border-gray-200',   icon: AlertCircle };
    }
}

// =============================================
// Add Complaint Modal
// =============================================

function AddComplaintModal({
    studentId,
    activeTenancy,
    onClose,
    onSuccess,
}: {
    studentId:     string;
    activeTenancy: {
        landlordId?:    string;
        propertyId?:    number;
        propertyTitle?: string;
    } | null;
    onClose:   () => void;
    onSuccess: () => void;
}) {
    const [form, setForm] = useState({
        type:        '0',
        title:       '',
        description: '',
        landlordId:  activeTenancy?.landlordId ?? '',
        propertyId:  activeTenancy?.propertyId?.toString() ?? '',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [addComplaint, { isLoading }] = useAddComplaintMutation();

    function update(key: keyof typeof form, value: string) {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors([]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors([]);

        const errs: string[] = [];
        if (!form.title.trim())       errs.push('Title is required.');
        if (form.title.trim().length < 5) errs.push('Title must be at least 5 characters.');
        if (!form.description.trim()) errs.push('Description is required.');
        if (form.description.trim().length < 20) errs.push('Description must be at least 20 characters.');
        if (errs.length) { setErrors(errs); return; }

        try {
            await addComplaint({
                submittedById: studentId,
                landlordId:    form.landlordId.trim() || undefined,
                propertyId:    form.propertyId ? Number(form.propertyId) : undefined,
                type:          Number(form.type),
                title:         form.title.trim(),
                description:   form.description.trim(),
            }).unwrap();
            toast.success('Complaint submitted! The admin team will review it shortly.');
            onSuccess();
        } catch (err: any) {
            const msg = err?.data?.Message ?? err?.data?.message ?? 'Failed to submit complaint.';
            setErrors([msg]);
        }
    }

    const inputClass =
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50';

    const complaintTypes = [
        { value: '0', label: '🏠 Vacancy — Property listed as available but isn\'t' },
        { value: '1', label: '🔧 Property Condition — Maintenance or safety concerns' },
        { value: '2', label: '👤 Landlord Behaviour — Unprofessional or abusive conduct' },
        { value: '3', label: '📝 Other — Any other complaint' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden my-auto">

                {/* Header */}
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                            <Flag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Submit a Complaint</h2>
                            <p className="text-sm text-orange-100 mt-0.5">
                                Report a property or landlord issue
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pre-filled property hint */}
                {activeTenancy?.propertyTitle && (
                    <div className="border-b bg-muted/30 px-6 py-3 flex items-center gap-2 text-sm">
                        <Home className="h-4 w-4 text-orange-500 shrink-0" />
                        <span className="text-muted-foreground">
                            Reporting for:{' '}
                            <strong className="text-foreground">
                                {activeTenancy.propertyTitle}
                            </strong>
                        </span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 space-y-1">
                            {errors.map((e, i) => (
                                <p key={i} className="text-sm text-red-700">• {e}</p>
                            ))}
                        </div>
                    )}

                    {/* Complaint type */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Complaint Type <span className="text-destructive">*</span>
                        </label>
                        <div className="space-y-2">
                            {complaintTypes.map(ct => (
                                <label key={ct.value}
                                    className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                                        form.type === ct.value
                                            ? 'border-orange-400 bg-orange-50'
                                            : 'hover:border-orange-200 hover:bg-muted/30'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value={ct.value}
                                        checked={form.type === ct.value}
                                        onChange={e => update('type', e.target.value)}
                                        className="mt-0.5 accent-orange-500"
                                    />
                                    <span className="text-sm">{ct.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Title <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => update('title', e.target.value)}
                            placeholder="Brief summary of your complaint"
                            disabled={isLoading}
                            maxLength={120}
                            className={inputClass}
                        />
                        <p className={`text-right text-xs ${form.title.length > 100 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {form.title.length}/120
                        </p>
                    </div>

                    {/* Landlord ID (optional) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Landlord ID
                            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={form.landlordId}
                            onChange={e => update('landlordId', e.target.value)}
                            placeholder="Your landlord's user ID"
                            disabled={isLoading}
                            className={inputClass}
                        />
                        {activeTenancy?.landlordId && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Auto-filled from your active tenancy
                            </p>
                        )}
                    </div>

                    {/* Property ID (optional) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Property ID
                            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                        </label>
                        <input
                            type="number"
                            value={form.propertyId}
                            onChange={e => update('propertyId', e.target.value)}
                            placeholder="e.g. 5"
                            disabled={isLoading}
                            className={inputClass}
                        />
                        {activeTenancy?.propertyId && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Auto-filled from your active tenancy
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Description <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={form.description}
                            onChange={e => update('description', e.target.value)}
                            placeholder="Describe the issue in detail — include dates, what happened, and what outcome you expect..."
                            disabled={isLoading}
                            maxLength={1000}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 resize-none"
                        />
                        <p className={`text-right text-xs ${form.description.length > 900 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {form.description.length}/1000
                        </p>
                    </div>

                    {/* Info note */}
                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                        <p className="font-semibold mb-0.5">📋 What happens next?</p>
                        <ul className="space-y-0.5 list-disc list-inside">
                            <li>Your complaint is reviewed by the VeriStay admin team</li>
                            <li>The landlord will be notified if applicable</li>
                            <li>You'll receive updates on the complaint status</li>
                        </ul>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                            : <><Flag className="h-4 w-4" /> Submit Complaint</>
                        }
                    </button>

                    <button type="button" onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

// =============================================
// Complaint Detail Modal
// =============================================

function ComplaintDetailModal({
    complaint,
    onClose,
}: {
    complaint: ComplaintDto;
    onClose:   () => void;
}) {
    const typeInfo   = getComplaintTypeInfo(complaint.type);
    const statusInfo = getComplaintStatusInfo(complaint.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Complaint Details</h2>
                    <p className="text-sm text-orange-100 mt-0.5 truncate">{complaint.title}</p>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* Type + Status */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeInfo.style}`}>
                            {typeInfo.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 rounded-xl border bg-muted/30 p-4 text-sm">
                        {complaint.landlordName && (
                            <div>
                                <p className="text-xs text-muted-foreground">Against Landlord</p>
                                <p className="font-medium">{complaint.landlordName}</p>
                            </div>
                        )}
                        {complaint.propertyTitle && (
                            <div>
                                <p className="text-xs text-muted-foreground">Property</p>
                                <p className="font-medium">{complaint.propertyTitle}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-muted-foreground">Submitted On</p>
                            <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                {formatDate(complaint.createdAt)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Description</p>
                            <p className="text-sm leading-relaxed">{complaint.description}</p>
                        </div>
                    </div>

                    {/* Notification status */}
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                        complaint.isNotified
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-muted/30 border text-muted-foreground'
                    }`}>
                        <Bell className="h-3.5 w-3.5 shrink-0" />
                        {complaint.isNotified
                            ? 'Landlord has been notified of this complaint'
                            : 'Landlord has not yet been notified'
                        }
                    </div>

                    {/* Admin notes */}
                    {complaint.adminNotes && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-xs font-semibold text-blue-700 mb-1.5 flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Admin Notes
                            </p>
                            <p className="text-sm text-blue-800">{complaint.adminNotes}</p>
                        </div>
                    )}

                    {/* Status specific notes */}
                    {complaint.status === 0 && (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800">
                            <p className="font-semibold mb-0.5">⏳ Awaiting Review</p>
                            <p>Your complaint has been received and is in the review queue.</p>
                        </div>
                    )}
                    {complaint.status === 1 && (
                        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                            <p className="font-semibold mb-0.5">🔍 Under Review</p>
                            <p>The admin team is actively reviewing your complaint.</p>
                        </div>
                    )}
                </div>

                <div className="border-t px-6 py-4">
                    <button onClick={onClose}
                        className="w-full rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Main StudentComplaintsTab
// =============================================

export function StudentComplaintsTab({
    activeTenancy,
}: {
    activeTenancy: {
        landlordId?:    string;
        propertyId?:    number;
        propertyTitle?: string;
    } | null;
}) {
    const [showAddModal,       setShowAddModal]       = useState(false);
    const [selectedComplaint,  setSelectedComplaint]  = useState<ComplaintDto | null>(null);

    const userId = useAppSelector((state: any) => state.userAuthStore?.id ?? '');

    const { data: allComplaints = [], isLoading, refetch } = useGetComplaintsQuery();

    // Only show student's own complaints
    const myComplaints = allComplaints.filter(c => c.submittedById === userId);

    const openCount     = myComplaints.filter(c => c.status === 0).length;
    const reviewCount   = myComplaints.filter(c => c.status === 1).length;
    const resolvedCount = myComplaints.filter(c => c.status === 2).length;

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 rounded bg-muted" />
                <div className="h-32 rounded-xl bg-muted" />
                <div className="h-24 rounded-xl bg-muted" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        My Complaints {myComplaints.length > 0 && `(${myComplaints.length})`}
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                    >
                        <Flag className="h-4 w-4" />
                        File Complaint
                    </button>
                </div>

                {/* Stats */}
                {myComplaints.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl border bg-background p-3 text-center shadow-sm">
                            <p className="text-xl font-bold text-red-600">{openCount}</p>
                            <p className="text-xs text-muted-foreground">Open</p>
                        </div>
                        <div className="rounded-xl border bg-background p-3 text-center shadow-sm">
                            <p className="text-xl font-bold text-yellow-600">{reviewCount}</p>
                            <p className="text-xs text-muted-foreground">Under Review</p>
                        </div>
                        <div className="rounded-xl border bg-background p-3 text-center shadow-sm">
                            <p className="text-xl font-bold text-green-600">{resolvedCount}</p>
                            <p className="text-xs text-muted-foreground">Resolved</p>
                        </div>
                    </div>
                )}

                {/* Info banner */}
                <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <Flag className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-orange-800">
                        <p className="font-semibold mb-0.5">About Complaints</p>
                        <p>
                            Use complaints to report issues like vacant properties being
                            falsely listed, poor property conditions, or unprofessional
                            landlord behaviour. The admin team reviews all complaints and
                            notifies relevant parties.
                        </p>
                    </div>
                </div>

                {/* Complaints list */}
                {myComplaints.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No complaints filed
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            If you've experienced issues with a property or landlord,
                            you can submit a complaint for admin review.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                        >
                            <Flag className="h-4 w-4" />
                            File Your First Complaint
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myComplaints.map(complaint => {
                            const typeInfo   = getComplaintTypeInfo(complaint.type);
                            const statusInfo = getComplaintStatusInfo(complaint.status);
                            const StatusIcon = statusInfo.icon;
                            return (
                                <div key={complaint.id}
                                    onClick={() => setSelectedComplaint(complaint)}
                                    className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold truncate">{complaint.title}</p>
                                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${typeInfo.style}`}>
                                                    {typeInfo.label}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {complaint.description}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                {complaint.landlordName && (
                                                    <span>Against: <strong>{complaint.landlordName}</strong></span>
                                                )}
                                                {complaint.propertyTitle && (
                                                    <span className="flex items-center gap-0.5">
                                                        <Home className="h-3 w-3" />
                                                        {complaint.propertyTitle}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(complaint.createdAt)}
                                                </span>
                                                {complaint.isNotified && (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <Bell className="h-3 w-3" />
                                                        Landlord notified
                                                    </span>
                                                )}
                                            </div>
                                            {complaint.adminNotes && (
                                                <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
                                                    <strong>Admin:</strong> {complaint.adminNotes}
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Complaint Modal */}
            {showAddModal && (
                <AddComplaintModal
                    studentId={userId}
                    activeTenancy={activeTenancy}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        refetch();
                    }}
                />
            )}

            {/* Detail Modal */}
            {selectedComplaint && (
                <ComplaintDetailModal
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                />
            )}
        </>
    );
}