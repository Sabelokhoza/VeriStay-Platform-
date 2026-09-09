import { ChevronRight, Home, Calendar, Bell } from 'lucide-react';
import { ComplaintDto } from '@/app/errors/listingsApi';
import { formatDate, getComplaintTypeInfo, getComplaintStatusInfo } from './utils';

export function ComplaintListItem({
    complaint,
    onSelect,
}: {
    complaint: ComplaintDto;
    onSelect:  (complaint: ComplaintDto) => void;
}) {
    const typeInfo   = getComplaintTypeInfo(complaint.type);
    const statusInfo = getComplaintStatusInfo(complaint.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div
            onClick={() => onSelect(complaint)}
            className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{complaint.title}</p>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${typeInfo.style}`}>
                            {typeInfo.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {complaint.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {complaint.landlordName && (
                            <span>Against: <strong>{complaint.landlordName}</strong></span>
                        )}
                        {complaint.propertyTitle && (
                            <span className="flex items-center gap-0.5">
                                <Home className="h-3 w-3" />
                                {complaint.propertyTitle}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(complaint.createdAt)}
                        </span>
                        {complaint.isNotified && (
                            <span className="flex items-center gap-1 text-green-600">
                                <Bell className="h-3 w-3" />
                                Landlord notified
                            </span>
                        )}
                    </div>
                    {complaint.adminNotes && (
                        <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
                            <strong>Admin:</strong> {complaint.adminNotes}
                        </div>
                    )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </div>
        </div>
    );
}
