'use client';

import { useState } from 'react';
import { X, Calendar, Bell, MessageSquare, ShieldCheck, Pencil, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { ComplaintDto, useUpdateComplaintMutation } from '@/app/errors/listingsApi';
import { formatDate, getComplaintTypeInfo, getComplaintStatusInfo } from './utils';

const COMPLAINT_TYPES = [0, 1, 2, 3];

export function ComplaintDetailModal({
    complaint,
    userId,
    onClose,
    onUpdated,
}: {
    complaint: ComplaintDto;
    userId:    string;
    onClose:   () => void;
    onUpdated: (updated: ComplaintDto) => void;
}) {
    const typeInfo   = getComplaintTypeInfo(complaint.type);
    const statusInfo = getComplaintStatusInfo(complaint.status);
    const StatusIcon = statusInfo.icon;

    // Only open complaints can be edited; once admin starts reviewing, the record is locked.
    const canEdit = complaint.status === 0 && complaint.submittedById === userId;
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        type: complaint.type, title: complaint.title, description: complaint.description,
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [updateComplaint, { isLoading: isSaving }] = useUpdateComplaintMutation();

    function startEditing() {
        setForm({ type: complaint.type, title: complaint.title, description: complaint.description });
        setErrors([]);
        setIsEditing(true);
    }

    async function handleSave() {
        const errs: string[] = [];
        if (form.title.trim().length < 5)        errs.push('Title must be at least 5 characters.');
        if (form.description.trim().length < 20) errs.push('Description must be at least 20 characters.');
        if (errs.length) { setErrors(errs); return; }

        const changes = { type: form.type, title: form.title.trim(), description: form.description.trim() };
        try {
            const res = await updateComplaint({
                id: complaint.id, submittedById: userId, ...changes,
            }).unwrap();
            toast.success('Complaint updated.');
            setIsEditing(false);
            onUpdated(res.data ?? { ...complaint, ...changes });
        } catch (err: any) {
            setErrors([err?.data?.Message ?? err?.data?.message ?? 'Failed to update complaint.']);
        }
    }

    const inputClass =
        'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Complaint Details</h2>
                    <p className="text-sm text-orange-100 mt-0.5 truncate">{complaint.title}</p>
                </div>

                <div className="px-6 py-4 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeInfo.style}`}>
                            {typeInfo.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </span>
                    </div>

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
                                    <label className="text-xs text-muted-foreground">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={e => setForm(f => ({ ...f, type: Number(e.target.value) }))}
                                        disabled={isSaving}
                                        className={`h-10 ${inputClass}`}
                                    >
                                        {COMPLAINT_TYPES.map(t => (
                                            <option key={t} value={t}>{getComplaintTypeInfo(t).label}</option>
                                        ))}
                                    </select>
                                </div>
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
                                <p className="text-sm leading-relaxed">{complaint.description}</p>
                            </div>
                        )}
                    </div>

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

                    {complaint.landlordResponse && (
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                            <p className="text-xs font-semibold text-indigo-700 mb-1.5 flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Landlord Response
                            </p>
                            <p className="text-sm text-indigo-900 whitespace-pre-line">{complaint.landlordResponse}</p>
                            {complaint.landlordRespondedAt && (
                                <p className="text-xs text-indigo-600 mt-1">
                                    Responded on {formatDate(complaint.landlordRespondedAt)}
                                </p>
                            )}
                        </div>
                    )}

                    {complaint.adminNotes && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-xs font-semibold text-blue-700 mb-1.5 flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Admin Notes
                            </p>
                            <p className="text-sm text-blue-800">{complaint.adminNotes}</p>
                        </div>
                    )}

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

                <div className="border-t px-6 py-4 flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} disabled={isSaving}
                                className="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={isSaving}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors disabled:opacity-50">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            {canEdit && (
                                <button onClick={startEditing}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-orange-300 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
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
