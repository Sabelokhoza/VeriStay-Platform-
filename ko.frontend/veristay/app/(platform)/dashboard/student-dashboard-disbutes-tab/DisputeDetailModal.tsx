import { X, Calendar, CheckCircle } from 'lucide-react';
import { DisputeDto } from '@/app/errors/listingsApi';
import { formatDate, getStatusInfo } from './utils';

export function DisputeDetailModal({
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
                        <div>
                            <p className="text-xs text-muted-foreground">Description</p>
                            <p className="text-sm leading-relaxed">{dispute.description}</p>
                        </div>
                    </div>

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
