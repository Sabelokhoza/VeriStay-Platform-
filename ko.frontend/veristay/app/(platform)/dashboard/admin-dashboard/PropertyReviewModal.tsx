'use client';

import { useState } from 'react';
import { X, MapPin, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { AdminPropertyDto, useGetListingByIdQuery } from '@/app/errors/listingsApi';
import { formatRent, formatDate, safeBeds } from './utils';
import { PropertyImageCarousel } from './PropertyImageCarousel';

export function PropertyReviewModal({
    property,
    onApprove,
    onReject,
    onClose,
    isLoading,
}: {
    property:  AdminPropertyDto;
    onApprove: () => void;
    onReject:  () => void;
    onClose:   () => void;
    isLoading: boolean;
}) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const beds = safeBeds(property.availableBeds);

    const { data: listing } = useGetListingByIdQuery(
        property.id,
        { skip: !property.id }
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl bg-background shadow-xl overflow-hidden my-auto">

                <div className="bg-blue-700 px-6 py-5 text-white">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Review Property Listing</h2>
                    <p className="text-sm text-blue-100 mt-0.5 truncate">
                        {property.title}
                    </p>
                </div>

                <PropertyImageCarousel images={listing?.images ?? []} propertyTitle={property.title} />

                <div className="px-6 py-4 border-b bg-muted/30">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Landlord</p>
                            <p className="font-medium">
                                {property.landlordName}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-medium flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                {property.city}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Monthly Rent</p>
                            <p className="font-bold text-blue-600 text-base">
                                {property.monthlyRent > 0
                                    ? `R ${formatRent(property.monthlyRent)}`
                                    : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Bedrooms</p>
                            <p className="font-medium">
                                {beds ? `${beds} ${beds === 1 ? 'bed' : 'beds'}` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Address</p>
                            <p className="font-medium">
                                {property.address}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Submitted</p>
                            <p className="font-medium">{formatDate(property.createdAt)}</p>
                        </div>
                    </div>

                    {listing?.amenities && listing.amenities.filter(a => a).length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-2">Amenities</p>
                            <div className="flex flex-wrap gap-1.5">
                                {listing.amenities
                                    .filter(a => a)
                                    .map((a, i) => (
                                        <span
                                            key={i}
                                            className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                                        >
                                            {a}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    )}

                    {listing?.description && (
                        <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Description</p>
                            <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                                {listing.description}
                            </p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-b">
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800">
                        <p className="font-semibold mb-0.5 flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Compliance Check
                        </p>
                        <p>
                            Verify that this property meets VeriStay's safety and quality
                            standards before approving. Once approved, students will be
                            able to browse and apply.
                        </p>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-3">
                    <button
                        onClick={() => { setAction('approve'); onApprove(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'approve'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <CheckCircle className="h-4 w-4" />
                        }
                        Approve Listing
                    </button>

                    <button
                        onClick={() => { setAction('reject'); onReject(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'reject'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <XCircle className="h-4 w-4" />
                        }
                        Reject Listing
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
