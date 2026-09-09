import { Wrench } from 'lucide-react';
import { MaintenanceRequestDto } from '@/app/errors/listingsApi';
import { formatDate, getMaintenanceStatusLabel, getPriorityLabel, priorityStyles } from './utils';
import { StatusBadge } from './StatusBadge';

export function MaintenanceTab({
    maintenanceRequests,
    isLoading,
    isError,
    onNewRequest,
}: {
    maintenanceRequests: MaintenanceRequestDto[];
    isLoading:           boolean;
    isError:             boolean;
    onNewRequest:        () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Maintenance Requests</h2>
                <button
                    onClick={onNewRequest}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Wrench className="h-4 w-4" /> New Request
                </button>
            </div>
            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-xl bg-muted" />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                    Failed to load maintenance requests.
                </div>
            ) : maintenanceRequests.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                    <Wrench className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    You haven't submitted any maintenance requests yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {maintenanceRequests.map((req: MaintenanceRequestDto) => {
                        const statusLabel = getMaintenanceStatusLabel(req.status);
                        const priorityLabel = getPriorityLabel(req.priority);
                        return (
                            <div
                                key={req.id}
                                className="rounded-xl border bg-background p-4 shadow-sm"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-orange-50 p-2">
                                            <Wrench className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {req.title}
                                            </p>
                                            {req.description && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {req.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Submitted: {formatDate(req.submittedAt)}
                                            </p>
                                            <p
                                                className={`text-xs font-medium mt-0.5 ${priorityStyles[priorityLabel]}`}
                                            >
                                                {priorityLabel} Priority
                                            </p>
                                            {req.landlordResponse && (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    Landlord: {req.landlordResponse}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <StatusBadge status={statusLabel} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
