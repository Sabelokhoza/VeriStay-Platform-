import { ChevronRight, Home, Calendar } from 'lucide-react';
import { DisputeDto } from '@/app/errors/listingsApi';
import { formatDate, getStatusInfo } from './utils';

export function DisputeListItem({
    dispute,
    onSelect,
}: {
    dispute:  DisputeDto;
    onSelect: (dispute: DisputeDto) => void;
}) {
    const statusInfo = getStatusInfo(dispute.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div
            onClick={() => onSelect(dispute)}
            className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{dispute.title}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {dispute.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {dispute.landlordName && (
                            <span>Landlord: <strong>{dispute.landlordName}</strong></span>
                        )}
                        {dispute.propertyTitle && (
                            <span className="flex items-center gap-0.5">
                                <Home className="h-3 w-3" />
                                {dispute.propertyTitle}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(dispute.createdAt)}
                        </span>
                    </div>
                    {dispute.resolution && (
                        <div className="mt-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs text-green-800">
                            <strong>Resolution:</strong> {dispute.resolution}
                        </div>
                    )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </div>
        </div>
    );
}
