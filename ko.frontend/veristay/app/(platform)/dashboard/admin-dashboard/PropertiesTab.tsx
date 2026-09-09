import { CheckCircle, AlertCircle, MapPin, Tag, BedDouble, ChevronRight, Clock, XCircle, ShieldX, Home } from 'lucide-react';
import { AdminPropertyDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, safeBeds, getPropertyStatusLabel } from './utils';
import { StatusBadge } from './StatusBadge';

export function PropertiesTab({
    pendingProperties,
    onSelectProperty,
}: {
    pendingProperties: AdminPropertyDto[];
    onSelectProperty:  (property: AdminPropertyDto) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Property Approvals ({pendingProperties.length} pending)
                </h2>
                {pendingProperties.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-800">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {pendingProperties.length} pending
                    </span>
                )}
            </div>

            {pendingProperties.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-60" />
                    <p className="font-medium">No properties pending approval</p>
                    <p className="text-sm text-muted-foreground mt-1">All submitted listings have been reviewed.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pendingProperties.map(p => {
                        const beds = safeBeds(p.availableBeds);
                        return (
                            <div key={p.id}
                                onClick={() => onSelectProperty(p)}
                                className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 ring-1 ring-yellow-100 transition-all">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2.5 shrink-0">
                                            <Home className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold">
                                                {p.title}
                                            </p>
                                            {p.landlordName && (
                                                <p className="text-sm text-muted-foreground">
                                                    Listed by {p.landlordName}
                                                </p>
                                            )}
                                            {(p.address) && p.city && (
                                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                    {p.address}, {p.city}
                                                </p>
                                            )}
                                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm">
                                                {p.monthlyRent > 0 && (
                                                    <span className="flex items-center gap-1 font-bold text-blue-600">
                                                        <Tag className="h-3.5 w-3.5" />
                                                        R {formatRent(p.monthlyRent)} / month
                                                    </span>
                                                )}
                                                {beds && (
                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                        <BedDouble className="h-3.5 w-3.5" />
                                                        {beds} {beds === 1 ? 'bedroom' : 'bedrooms'}
                                                    </span>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    Submitted {formatDate(p.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <StatusBadge
                                            label={getPropertyStatusLabel(p.status).label}
                                            style={getPropertyStatusLabel(p.status).style}
                                        />
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs border ${
                                    p.status === 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                    p.status === 1 ? 'bg-green-50  border-green-200  text-green-800'  :
                                    p.status === 2 ? 'bg-red-50    border-red-200    text-red-800'    :
                                                     'bg-gray-50   border-gray-200   text-gray-700'
                                }`}>
                                    {p.status === 0 && (
                                        <>
                                            <Clock className="h-4 w-4 shrink-0" />
                                            <span>
                                                <strong>Awaiting approval.</strong> This property listing
                                                has been submitted by the landlord and is pending your
                                                review. Tap to approve or reject.
                                            </span>
                                        </>
                                    )}
                                    {p.status === 1 && (
                                        <>
                                            <CheckCircle className="h-4 w-4 shrink-0" />
                                            <span>
                                                <strong>Listing approved. ✅</strong> This property is
                                                live on the platform and visible to students searching
                                                for accommodation.
                                            </span>
                                        </>
                                    )}
                                    {p.status === 2 && (
                                        <>
                                            <XCircle className="h-4 w-4 shrink-0" />
                                            <span>
                                                <strong>Listing rejected.</strong> This property was not
                                                approved and is hidden from students. The landlord has
                                                been notified.
                                            </span>
                                        </>
                                    )}
                                    {p.status === 3 && (
                                        <>
                                            <ShieldX className="h-4 w-4 shrink-0" />
                                            <span>
                                                <strong>Listing delisted.</strong> This property has been
                                                removed from the platform and is no longer visible to
                                                students.
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
