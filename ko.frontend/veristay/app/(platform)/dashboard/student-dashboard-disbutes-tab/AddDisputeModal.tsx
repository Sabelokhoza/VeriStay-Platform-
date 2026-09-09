'use client';

import { useState } from 'react';
import { AlertTriangle, X, Loader2, CheckCircle, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAddDisputeMutation } from '@/app/errors/listingsApi';
import { ActiveTenancyRef } from './utils';

export function AddDisputeModal({
    studentId,
    activeTenancy,
    onClose,
    onSuccess,
}: {
    studentId:      string;
    activeTenancy:  ActiveTenancyRef | null;
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

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {errors.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 space-y-1">
                            {errors.map((e, i) => (
                                <p key={i} className="text-sm text-red-700">• {e}</p>
                            ))}
                        </div>
                    )}

                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800">
                        <p className="font-semibold mb-0.5">📋 Before filing a dispute</p>
                        <ul className="space-y-0.5 list-disc list-inside">
                            <li>Try to resolve the issue directly with your landlord first</li>
                            <li>Both parties will be notified of the dispute</li>
                            <li>The VeriStay admin team will review and mediate</li>
                        </ul>
                    </div>

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
                            placeholder="Describe the issue in detail — include dates, what happened, and what resolution you expect..."
                            disabled={isLoading}
                            maxLength={1000}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 resize-none"
                        />
                        <p className={`text-right text-xs ${form.description.length > 900 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {form.description.length}/1000
                        </p>
                    </div>

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
