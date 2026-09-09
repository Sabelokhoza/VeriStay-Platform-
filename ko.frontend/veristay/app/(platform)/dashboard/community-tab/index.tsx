'use client';

import Link from 'next/link';
import { Star, AlertCircle, Home } from 'lucide-react';
import { useGetListingByIdQuery, AnnouncementDto, TenancyDto } from '@/app/errors/listingsApi';
import { ReviewsList } from './ReviewsList';
import { RateLandlordSection } from './RateLandlordSection';

export function CommunityTab({
    studentId,
    activeTenancy,
    announcements,
}: {
    studentId:     string;
    activeTenancy: TenancyDto | null;
    announcements: AnnouncementDto[];
}) {
    const { data: listing } = useGetListingByIdQuery(
        activeTenancy?.propertyId ?? 0,
        { skip: !activeTenancy?.propertyId }
    );

    const reviews = listing?.reviews ?? [];

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-semibold">Property Community</h2>

            <div className="rounded-xl border bg-background shadow-sm">
                <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                    Property Reviews
                    {reviews.length > 0 && (
                        <span className="ml-1 rounded-full bg-yellow-100 border border-yellow-200 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                            {reviews.length}
                        </span>
                    )}
                </div>
                <div className="p-5">
                    {!activeTenancy ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                            <Home className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>No active tenancy. Enroll in a property to see reviews.</p>
                        </div>
                    ) : (
                        <ReviewsList reviews={reviews} />
                    )}
                </div>
            </div>

            <div className="rounded-xl border bg-background shadow-sm">
                <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                    <Star className="h-4 w-4 text-blue-600" />
                    Rate Your Landlord
                </div>
                <div className="p-5">
                    {!activeTenancy ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>You need an active tenancy to leave a review.</p>
                            <Link href="/listings"
                                className="mt-2 inline-block text-blue-600 hover:underline text-xs">
                                Browse properties →
                            </Link>
                        </div>
                    ) : (
                        <RateLandlordSection
                            studentId={studentId}
                            tenancy={activeTenancy}
                            existingReviews={reviews}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
