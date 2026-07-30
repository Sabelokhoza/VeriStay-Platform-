// =============================================
// components/dashboard/student-disputes-tab.tsx
// =============================================

'use client';

import { useState } from 'react';
import {
    AlertTriangle, X, Loader2, CheckCircle,
    Clock, ChevronRight, Home, Calendar,
    ShieldCheck, MessageSquare,BarChart3     
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    useGetDisputesQuery,
    useAddDisputeMutation,
    DisputeDto,
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

function getStatusInfo(status: number) {
    switch (status) {
        case 0: return { label: 'Open',         style: 'bg-red-100    text-red-800    border-red-200',    icon: AlertTriangle };
        case 1: return { label: 'Under Review',  style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock         };
        case 2: return { label: 'Resolved',      style: 'bg-green-100  text-green-800  border-green-200',  icon: CheckCircle   };
        case 3: return { label: 'Closed',        style: 'bg-gray-100   text-gray-700   border-gray-200',   icon: X             };
        default: return { label: 'Unknown',      style: 'bg-gray-100   text-gray-700   border-gray-200',   icon: AlertTriangle };
    }
}

// =============================================
// Add Dispute Modal
// =============================================

function AddDisputeModal({
    studentId,
    activeTenancy,
    onClose,
    onSuccess,
}: {
    studentId:      string;
    activeTenancy:  { landlordId?: string; propertyId?: number; propertyTitle?: string } | null;
    onClose:        () => void;
    onSuccess:      () => void;
}) {
    const [form, setForm] = useState({
        landlordId:  activeTenancy?.landlordId  ?? '',
        propertyId:  activeTenancy?.propertyId?.toString() ?? '',
        title:       '',
        description: '',
    });
    const [errors,  setErrors]  = useState<string[]>([]);
    const [addDispute, { isLoading }] = useAddDisputeMutation();

    function update(key: keyof typeof form, value: string) {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors([]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors([]);

        const errs: string[] = [];
        if (!form.landlordId.trim()) errs.push('Landlord ID is required.');
        if (!form.title.trim())      errs.push('Title is required.');
        if (form.title.trim().length < 5) errs.push('Title must be at least 5 characters.');
        if (!form.description.trim()) errs.push('Description is required.');
        if (form.description.trim().length < 20) errs.push('Description must be at least 20 characters.');
        if (errs.length) { setErrors(errs); return; }

        try {
            await addDispute({
                studentId,
                landlordId:  form.landlordId.trim(),
                propertyId:  form.propertyId ? Number(form.propertyId) : undefined,
                title:       form.title.trim(),
                description: form.description.trim(),
            }).unwrap();
            toast.success('Dispute filed successfully! The admin team will review it shortly.');
            onSuccess();
        } catch (err: any) {
            const msg = err?.data?.Message ?? err?.data?.message ?? 'Failed to file dispute.';
            setErrors([msg]);
        }
    }

    const inputClass =
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden my-auto">

                {/* Header */}
                <div className="bg-red-600 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">File a Dispute</h2>
                            <p className="text-sm text-red-100 mt-0.5">
                                Report an issue with your landlord
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pre-filled tenancy hint */}
                {activeTenancy?.propertyTitle && (
                    <div className="border-b bg-muted/30 px-6 py-3 flex items-center gap-2 text-sm">
                        <Home className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="text-muted-foreground">
                            Filing for: <strong className="text-foreground">
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

                    {/* Info note */}
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800">
                        <p className="font-semibold mb-0.5">📋 Before filing a dispute</p>
                        <ul className="space-y-0.5 list-disc list-inside">
                            <li>Try to resolve the issue directly with your landlord first</li>
                            <li>Both parties will be notified of the dispute</li>
                            <li>The VeriStay admin team will review and mediate</li>
                        </ul>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Dispute Title <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => update('title', e.target.value)}
                            placeholder="e.g. Landlord refusing to fix broken heater"
                            disabled={isLoading}
                            maxLength={120}
                            className={inputClass}
                        />
                        <p className={`text-right text-xs ${form.title.length > 100 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {form.title.length}/120
                        </p>
                    </div>

                    {/* Landlord ID */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Landlord ID <span className="text-destructive">*</span>
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
                        {!activeTenancy?.landlordId && (
                            <p className="text-xs text-muted-foreground">
                                Find your landlord's ID in the My Tenancy tab.
                            </p>
                        )}
                    </div>

                    {/* Property ID */}
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
                            placeholder="Describe the issue in detail — include dates, what happened, and what resolution you expect..."
                            disabled={isLoading}
                            maxLength={1000}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 resize-none"
                        />
                        <p className={`text-right text-xs ${form.description.length > 900 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {form.description.length}/1000
                        </p>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                            : <><AlertTriangle className="h-4 w-4" /> Submit Dispute</>
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
// Dispute Detail Modal (view own dispute)
// =============================================

function DisputeDetailModal({
    dispute,
    onClose,
}: {
    dispute: DisputeDto;
    onClose: () => void;
}) {
    const statusInfo = getStatusInfo(dispute.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-slate-700 px-6 py-5 text-white">
                    <button onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Dispute Details</h2>
                    <p className="text-sm text-slate-300 mt-0.5 truncate">{dispute.title}</p>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 rounded-xl border bg-muted/30 p-4 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Landlord</p>
                            <p className="font-medium">{dispute.landlordName || '—'}</p>
                        </div>
                        {dispute.propertyTitle && (
                            <div>
                                <p className="text-xs text-muted-foreground">Property</p>
                                <p className="font-medium">{dispute.propertyTitle}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-muted-foreground">Filed On</p>
                            <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                {formatDate(dispute.createdAt)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Description</p>
                            <p className="text-sm leading-relaxed">{dispute.description}</p>
                        </div>
                    </div>

                    {/* Resolution (if resolved) */}
                    {dispute.resolution && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                            <p className="text-xs font-semibold text-green-700 mb-1.5 flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Admin Resolution
                            </p>
                            <p className="text-sm text-green-800">{dispute.resolution}</p>
                            {dispute.resolvedAt && (
                                <p className="text-xs text-green-600 mt-1">
                                    Resolved on {formatDate(dispute.resolvedAt)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Pending note */}
                    {dispute.status === 0 && (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800">
                            <p className="font-semibold mb-0.5">⏳ Pending Review</p>
                            <p>Your dispute is in the queue. The admin team will review
                            it and both parties will be notified of the outcome.</p>
                        </div>
                    )}
                    {dispute.status === 1 && (
                        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                            <p className="font-semibold mb-0.5">🔍 Under Review</p>
                            <p>The admin team is actively reviewing your dispute.
                            You will be notified when a resolution is reached.</p>
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
// Main StudentDisputesTab
// =============================================

export function StudentDisputesTab({
    activeTenancy,
}: {
    activeTenancy: {
        landlordId?:    string;
        propertyId?:    number;
        propertyTitle?: string;
    } | null;
}) {
    const [showAddModal,    setShowAddModal]    = useState(false);
    const [selectedDispute, setSelectedDispute] = useState<DisputeDto | null>(null);

    const userId = useAppSelector((state: any) => state.userAuthStore?.id ?? '');

    const { data: allDisputes = [], isLoading, refetch } = useGetDisputesQuery();

    // Filter to only show the student's own disputes
    const myDisputes = allDisputes.filter(d => d.studentId === userId);

    const openCount     = myDisputes.filter(d => d.status === 0).length;
    const reviewCount   = myDisputes.filter(d => d.status === 1).length;
    const resolvedCount = myDisputes.filter(d => d.status === 2).length;

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
                        My Disputes {myDisputes.length > 0 && `(${myDisputes.length})`}
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        File Dispute
                    </button>
                </div>

                {/* Stats */}
                {myDisputes.length > 0 && (
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
                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-0.5">Dispute Resolution Process</p>
                        <p>
                            VeriStay mediates disputes between students and landlords.
                            File a dispute if your landlord is not meeting their obligations.
                            Our admin team will review and notify both parties of the outcome.
                        </p>
                    </div>
                </div>

                {/* Disputes list */}
                {myDisputes.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No disputes filed
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            If you're experiencing issues with your landlord or property,
                            you can file a dispute for admin review.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            File Your First Dispute
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myDisputes.map(dispute => {
                            const statusInfo = getStatusInfo(dispute.status);
                            const StatusIcon = statusInfo.icon;
                            return (
                                <div key={dispute.id}
                                    onClick={() => setSelectedDispute(dispute)}
                                    className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold truncate">{dispute.title}</p>
                                                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {dispute.description}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                {dispute.landlordName && (
                                                    <span>Landlord: <strong>{dispute.landlordName}</strong></span>
                                                )}
                                                {dispute.propertyTitle && (
                                                    <span className="flex items-center gap-0.5">
                                                        <Home className="h-3 w-3" />
                                                        {dispute.propertyTitle}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(dispute.createdAt)}
                                                </span>
                                            </div>
                                            {dispute.resolution && (
                                                <div className="mt-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs text-green-800">
                                                    <strong>Resolution:</strong> {dispute.resolution}
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

            {/* Add Dispute Modal */}
            {showAddModal && (
                <AddDisputeModal
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
            {selectedDispute && (
                <DisputeDetailModal
                    dispute={selectedDispute}
                    onClose={() => setSelectedDispute(null)}
                />
            )}
        </>
    );
}