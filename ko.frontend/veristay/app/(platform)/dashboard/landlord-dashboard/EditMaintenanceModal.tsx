'use client';

import { useState } from 'react';
import { X, Loader2, Save, AlertCircle } from 'lucide-react';
import {
    LandlordMaintenanceDto,
    MaintenanceStatus,
    useLandlordUpdateMaintenanceMutation,
} from '@/app/errors/listingsApi';
import { isPlaceholder } from './utils';

const statusOptions: { value: MaintenanceStatus; label: string }[] = [
    { value: MaintenanceStatus.Open,       label: 'Open'        },
    { value: MaintenanceStatus.InProgress, label: 'In Progress' },
    { value: MaintenanceStatus.Resolved,   label: 'Resolved'    },
];

export function EditMaintenanceModal({
    item, landlordId, onClose, onSuccess,
}: {
    item:       LandlordMaintenanceDto;
    landlordId: string;
    onClose:    () => void;
    onSuccess:  () => void;
}) {
    const [status,   setStatus]   = useState<MaintenanceStatus>(item.status);
    const [response, setResponse] = useState(isPlaceholder(item.landlordResponse) ? '' : item.landlordResponse);
    const [error,    setError]    = useState<string | null>(null);
    const [updateMaintenance, { isLoading }] = useLandlordUpdateMaintenanceMutation();

    async function handleSave() {
        setError(null);
        try {
            await updateMaintenance({
                id: item.id,
                landlordId,
                status,
                landlordResponse: response.trim(),
            }).unwrap();
            onSuccess();
        } catch (err: any) {
            setError(err?.data?.message ?? err?.data?.Message ?? 'Failed to update request.');
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Edit Maintenance Request</h2>
                    <p className="text-sm text-orange-100 mt-0.5 truncate">
                        {isPlaceholder(item.title) ? 'Maintenance Issue' : item.title}
                    </p>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {error && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <div className="mt-1.5 grid grid-cols-3 gap-2">
                            {statusOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setStatus(opt.value)}
                                    disabled={isLoading}
                                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                                        status === opt.value
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-background hover:bg-muted'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            The tenant is notified when the status changes.
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Your Response</label>
                        <textarea
                            rows={4}
                            value={response}
                            onChange={e => setResponse(e.target.value)}
                            maxLength={1000}
                            disabled={isLoading}
                            placeholder="Describe the action taken or planned response..."
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        />
                    </div>

                    <button onClick={handleSave} disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
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
