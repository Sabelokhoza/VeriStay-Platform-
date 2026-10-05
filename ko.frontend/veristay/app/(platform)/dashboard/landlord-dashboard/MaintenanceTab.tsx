import { useState } from 'react';
import { Wrench, AlertCircle, ChevronRight, Loader2, Pencil, Trash2 } from 'lucide-react';
import { LandlordMaintenanceDto, useLandlordDeleteMaintenanceMutation } from '@/app/errors/listingsApi';
import { formatDate, isPlaceholder, getMaintPriorityLabel, getMaintStatusLabel } from './utils';
import { StatusBadge } from './StatusBadge';

export function MaintenanceTab({
    landlordId,
    maintenance,
    openCount,
    onSelectMaint,
    onEditMaint,
}: {
    landlordId:    string;
    maintenance:   LandlordMaintenanceDto[];
    openCount:     number;
    onSelectMaint: (item: LandlordMaintenanceDto) => void;
    onEditMaint:   (item: LandlordMaintenanceDto) => void;
}) {
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteMaintenance, { isLoading: isDeleting }] = useLandlordDeleteMaintenanceMutation();

    async function handleDelete(id: number) {
        setDeleteError(null);
        try {
            await deleteMaintenance({ id, landlordId }).unwrap();
            setConfirmDeleteId(null);
        } catch (err: any) {
            setDeleteError(err?.data?.message ?? err?.data?.Message ?? 'Failed to delete request.');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Maintenance Requests ({maintenance.length})</h2>
                {openCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                        <AlertCircle className="h-3.5 w-3.5" /> {openCount} open
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
                            <div key={req.id} onClick={() => onSelectMaint(req)}
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
                                    <div className="flex items-center gap-1 shrink-0">
                                        <StatusBadge label={status.label} style={status.style} />
                                        <button
                                            onClick={e => { e.stopPropagation(); onEditMaint(req); }}
                                            title="Edit request"
                                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={e => { e.stopPropagation(); setDeleteError(null); setConfirmDeleteId(req.id); }}
                                            title="Delete request"
                                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                {req.landlordResponse && !isPlaceholder(req.landlordResponse) && (
                                    <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
                                        <span className="font-semibold">Your response: </span>{req.landlordResponse}
                                    </div>
                                )}
                                {confirmDeleteId === req.id && (
                                    <div
                                        onClick={e => e.stopPropagation()}
                                        className="mt-3 cursor-default rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span>Delete this maintenance request? The tenant will no longer see it.</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    disabled={isDeleting}
                                                    className="rounded-md px-2.5 py-1 font-medium hover:bg-red-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(req.id)}
                                                    disabled={isDeleting}
                                                    className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        {deleteError && <p className="mt-1 font-medium">{deleteError}</p>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
