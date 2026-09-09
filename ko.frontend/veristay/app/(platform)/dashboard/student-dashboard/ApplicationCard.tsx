import { Home, MapPin, ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { ApplicationDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, getStatusLabel } from './utils';
import { StatusBadge } from './StatusBadge';

export function ApplicationCard({
    app,
    onOpenOffer,
}: {
    app: ApplicationDto;
    onOpenOffer: (app: ApplicationDto) => void;
}) {
    const statusLabel = getStatusLabel(app.status);
    const isApproved = statusLabel === 'Approved';

    return (
        <div
            onClick={isApproved ? () => onOpenOffer(app) : undefined}
            className={`rounded-xl border bg-background p-4 shadow-sm transition-all
                ${
                    isApproved
                        ? 'cursor-pointer hover:shadow-md hover:border-green-300 ring-1 ring-green-200'
                        : ''
                }`}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                    <div className="flex items-start gap-3">
                        <div
                            className={`rounded-lg p-2 shrink-0 ${isApproved ? 'bg-green-50' : 'bg-blue-50'}`}
                        >
                            <Home
                                className={`h-5 w-5 ${isApproved ? 'text-green-600' : 'text-blue-600'}`}
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold truncate">
                                {app.propertyTitle !== 'string'
                                    ? app.propertyTitle
                                    : 'Property'}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {app.propertyLocation !== 'string - string'
                                    ? app.propertyLocation
                                    : 'Location not specified'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Applied on {formatDate(app.appliedAt)}
                            </p>
                            <p className="text-sm font-bold text-blue-600 mt-0.5">
                                R {formatRent(app.price)} / month
                            </p>
                            {app.landlordName && app.landlordName !== 'string' && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Landlord: {app.landlordName}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={statusLabel} />
                    {isApproved && (
                        <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                            Tap to respond
                        </span>
                    )}
                </div>
            </div>

            {statusLabel === 'Pending' && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Your application is being reviewed by the landlord.
                </div>
            )}
            {statusLabel === 'Approved' && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        Congratulations! Tap this card to accept or decline the offer.
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                </div>
            )}
            {statusLabel === 'Rejected' && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                    <XCircle className="h-4 w-4 shrink-0" />
                    Unfortunately your application was not successful.
                    {app.landlordNotes && (
                        <span className="ml-1">Reason: {app.landlordNotes}</span>
                    )}
                </div>
            )}
        </div>
    );
}
