'use client';

import { useState } from 'react';
import { X, Calendar, CheckCircle, MessageSquare, Pencil, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { DisputeDto, useUpdateDisputeMutation } from '@/app/errors/listingsApi';
import { formatDate, getStatusInfo } from './utils';

export function DisputeDetailModal({
    dispute,
    studentId,
    onClose,
    onUpdated,
}: {
    dispute:   DisputeDto;
    studentId: string;
    onClose:   () => void;
    onUpdated: (updated: DisputeDto) => void;
}) {
    const statusInfo = getStatusInfo(dispute.status);
    const StatusIcon = statusInfo.icon;

    // Only open disputes can be edited; once admin starts reviewing, the record is locked.
    const canEdit = dispute.status === 0 && dispute.studentId === studentId;
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm]           = useState({ title: dispute.title, description: dispute.description });
    const [errors, setErrors]       = useState<string[]>([]);
    const [updateDispute, { isLoading: isSaving }] = useUpdateDisputeMutation();

    function startEditing() {
        setForm({ title: dispute.title, description: dispute.description });
        setErrors([]);
        setIsEditing(true);
    }

    async function handleSave() {
        const errs: string[] = [];
        if (form.title.trim().length < 5)        errs.push('Title must be at least 5 characters.');
        if (form.description.trim().length < 20) errs.push('Description must be at least 20 characters.');
        if (errs.length) { setErrors(errs); return; }

        try {
            const res = await updateDispute({
                id:          dispute.id,
                studentId,
                title:       form.title.trim(),
                description: form.description.trim(),
            }).unwrap();
            toast.success('Dispute updated.');
            setIsEditing(false);
            onUpdated(res.data ?? { ...dispute, title: form.title.trim(), description: form.description.trim() });
        } catch (err: any) {
            setErrors([err?.data?.Message ?? err?.data?.message ?? 'Failed to update dispute.']);
        }
    }

    const inputClass =
        'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:opacity-50';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="bg-slate-700 px-6 py-5 text-white">
                    <button onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Dispute Details</h2>
                    <p className="text-sm text-slate-300 mt-0.5 truncate">{dispute.title}</p>
                </div>

                <div className="px-6 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                        </span>
                    </div>

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
                        {isEditing ? (
                            <div className="space-y-3">
                                {errors.length > 0 && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 space-y-0.5">
                                        {errors.map((e, i) => (
                                            <p key={i} className="text-xs text-red-700">• {e}</p>
                                        ))}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        maxLength={120}
                                        disabled={isSaving}
                                        className={`h-10 ${inputClass}`}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Description</label>
                                    <textarea
                                        rows={4}
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        maxLength={1000}
                                        disabled={isSaving}
                                        className={`resize-none ${inputClass}`}
                                    />
                                    <p className="text-right text-xs text-muted-foreground">{form.description.length}/1000</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs text-muted-foreground">Description</p>
                                <p className="text-sm leading-relaxed">{dispute.description}</p>
                            </div>
                        )}
                    </div>

                    {dispute.landlordResponse && (
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                            <p className="text-xs font-semibold text-indigo-700 mb-1.5 flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Landlord Response
                            </p>
                            <p className="text-sm text-indigo-900 whitespace-pre-line">{dispute.landlordResponse}</p>
                            {dispute.landlordRespondedAt && (
                                <p className="text-xs text-indigo-600 mt-1">
                                    Responded on {formatDate(dispute.landlordRespondedAt)}
                                </p>
                            )}
                        </div>
                    )}

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

                <div className="border-t px-6 py-4 flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} disabled={isSaving}
                                className="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={isSaving}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-700 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            {canEdit && (
                                <button onClick={startEditing}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </button>
                            )}
                            <button onClick={onClose}
                                className="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                                Close
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
