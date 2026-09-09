import { ClipboardList, AlertCircle, MapPin, Calendar } from 'lucide-react';
import { ApplicationDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, isPlaceholder, getAppStatusLabel, getAppStatusStyle } from './utils';
import { StatusBadge } from './StatusBadge';

export function ApplicationsList({
    title,
    applications,
    pendingCount,
    onSelectApp,
}: {
    title:        string;
    applications: ApplicationDto[];
    pendingCount: number;
    onSelectApp:  (app: ApplicationDto) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title} ({applications.length})</h2>
                {pendingCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-800">
                        <AlertCircle className="h-3.5 w-3.5" /> {pendingCount} pending
                    </span>
                )}
            </div>

            {applications.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No applications yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map(app => (
                        <div key={app.id}
                            onClick={app.status === 0 ? () => onSelectApp(app) : undefined}
                            className={`rounded-xl border bg-background p-4 shadow-sm transition-all
                                ${app.status === 0 ? 'cursor-pointer hover:shadow-md hover:border-orange-300 ring-1 ring-orange-100' : ''}`}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                        {(app.studentName ?? app.studentId).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold">{app.studentName ?? `Student #${app.studentId.slice(0, 8)}...`}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {isPlaceholder(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                                        </p>
                                        {!isPlaceholder(app.propertyLocation) && (
                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3 shrink-0" /> {app.propertyLocation}
                                            </p>
                                        )}
                                        {app.price > 0 && (
                                            <p className="text-sm font-bold text-blue-600 mt-0.5">R {formatRent(app.price)} / month</p>
                                        )}
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <Calendar className="h-3 w-3" /> Applied {formatDate(app.appliedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap shrink-0">
                                    <StatusBadge label={getAppStatusLabel(app.status)} style={getAppStatusStyle(app.status)} />
                                    {app.status === 0 && (
                                        <span className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                                            Tap to review
                                        </span>
                                    )}
                                </div>
                            </div>
                            {app.status === 0 && (
                                <div className="mt-3 flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-800">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    This application is awaiting your review. Tap to approve or reject.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
