import { X, Calendar, Bell, ShieldCheck } from 'lucide-react';
import { ComplaintDto } from '@/app/errors/listingsApi';
import { formatDate, getComplaintTypeInfo, getComplaintStatusInfo } from './utils';

export function ComplaintDetailModal({
    complaint,
    onClose,
}: {
    complaint: ComplaintDto;
    onClose:   () => void;
}) {
    const typeInfo   = getComplaintTypeInfo(complaint.type);
    const statusInfo = getComplaintStatusInfo(complaint.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
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
                        <div>
                            <p className="text-xs text-muted-foreground">Description</p>
                            <p className="text-sm leading-relaxed">{complaint.description}</p>
                        </div>
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
