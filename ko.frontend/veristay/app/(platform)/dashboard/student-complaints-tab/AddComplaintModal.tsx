'use client';

import { useState } from 'react';
import { Flag, X, Loader2, CheckCircle, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAddComplaintMutation } from '@/app/errors/listingsApi';
import { ActiveTenancyRef } from './utils';

export function AddComplaintModal({
    studentId,
    activeTenancy,
    onClose,
    onSuccess,
}: {
    studentId:     string;
    activeTenancy: ActiveTenancyRef | null;
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

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {errors.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 space-y-1">
                            {errors.map((e, i) => (
                                <p key={i} className="text-sm text-red-700">• {e}</p>
                            ))}
                        </div>
                    )}

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

                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                        <p className="font-semibold mb-0.5">📋 What happens next?</p>
                        <ul className="space-y-0.5 list-disc list-inside">
                            <li>Your complaint is reviewed by the VeriStay admin team</li>
                            <li>The landlord will be notified if applicable</li>
                            <li>You'll receive updates on the complaint status</li>
                        </ul>
                    </div>

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
