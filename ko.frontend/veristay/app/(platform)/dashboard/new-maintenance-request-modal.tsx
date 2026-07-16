'use client';

import { useState } from 'react';
import { X, Wrench, Loader2, AlertCircle } from 'lucide-react';
import {
    useAddMaintenanceRequestMutation,
    MaintenancePriority,
} from '@/app/errors/listingsApi';

const priorityOptions: { value: MaintenancePriority; label: string }[] = [
    { value: MaintenancePriority.Low, label: 'Low' },
    { value: MaintenancePriority.Medium, label: 'Medium' },
    { value: MaintenancePriority.High, label: 'High' },
    { value: MaintenancePriority.Emergency, label: 'Emergency' },
];

export function NewMaintenanceRequestModal({
    studentId,
    propertyId,
    onClose,
    onSuccess,
}: {
    studentId: string;
    propertyId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<MaintenancePriority>(MaintenancePriority.Low);
    const [formError, setFormError] = useState<string | null>(null);

    const [addMaintenanceRequest, { isLoading }] = useAddMaintenanceRequestMutation();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        if (!propertyId) {
            setFormError('No active tenancy was found, so we could not link this request to a property.');
            return;
        }
        if (!title.trim() || !description.trim()) {
            setFormError('Please fill in both a title and a description.');
            return;
        }

        try {
            const result = await addMaintenanceRequest({
                studentId,
                dto: {
                    propertyId,
                    title: title.trim(),
                    description: description.trim(),
                    priority,
                },
            });

            if ('data' in result) {
                onSuccess();
            } else if ('error' in result) {
                const err = result.error as any;
                setFormError(
                    err?.data?.Message || err?.data?.message || 'Something went wrong. Please try again.'
                );
            }
        } catch {
            setFormError('An unexpected error occurred. Please try again.');
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-orange-600 px-6 py-5 text-white">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                            <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-orange-100 font-medium uppercase tracking-wide">
                                Maintenance
                            </p>
                            <h2 className="text-lg font-bold">New Request</h2>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {formError && (
                        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            {formError}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Leaking tap in bathroom"
                            maxLength={100}
                            className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue in as much detail as possible..."
                            maxLength={1000}
                            className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Priority</label>
                        <div className="grid grid-cols-4 gap-2">
                            {priorityOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setPriority(opt.value)}
                                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors
                                        ${
                                            priority === opt.value
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-background hover:bg-muted'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}