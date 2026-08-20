// =============================================
// components/dashboard/community-tab.tsx
// =============================================

'use client';

import { useState } from 'react';
import {
    Bell, Users, Star, Calendar, MessageSquare,
    Loader2, CheckCircle, AlertCircle, Home, MapPin,
    X, User,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
    useAddReviewMutation,
    useGetListingByIdQuery,
    AnnouncementDto,
    TenancyDto,
    ReviewDto,
} from '@/app/errors/listingsApi';

// =============================================
// Helpers
// =============================================

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function isPlaceholder(v: string | null | undefined) {
    if (!v) return true;
    const l = v.trim().toLowerCase();
    return l === 'string' || l === 'string - string' || l === '';
}

// =============================================
// Star Rating Display
// =============================================

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
    const cls = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={star}
                    className={`${cls} shrink-0 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                />
            ))}
        </div>
    );
}

// =============================================
// Interactive Star Picker
// =============================================

function StarPicker({ value, onChange, disabled }: {
    value: number; onChange: (r: number) => void; disabled: boolean;
}) {
    const [hovered, setHovered] = useState<number>(0);
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" disabled={disabled}
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="rounded transition-transform hover:scale-110 disabled:cursor-not-allowed"
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                        <Star className={`h-8 w-8 transition-colors ${
                            star <= (hovered || value)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                        }`} />
                    </button>
                ))}
            </div>
            {(hovered || value) > 0 && (
                <span className={`text-sm font-semibold ${
                    (hovered || value) >= 4 ? 'text-green-600' :
                    (hovered || value) === 3 ? 'text-yellow-600' :
                    'text-red-600'
                }`}>
                    {labels[hovered || value]}
                </span>
            )}
        </div>
    );
}

// =============================================
// Reviews List (reusable)
// =============================================

function ReviewsList({ reviews }: { reviews: ReviewDto[] }) {
    const [showAll, setShowAll] = useState(false);

    if (reviews.length === 0) {
        return (
            <div className="rounded-xl border bg-muted/30 py-8 text-center text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No reviews yet for this property.</p>
            </div>
        );
    }

    const avgRating  = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const breakdown  = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct:   Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100),
    }));
    const displayed  = showAll ? reviews : reviews.slice(0, 3);

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex flex-col items-center justify-center shrink-0 sm:w-32">
                        <p className="text-4xl font-bold">{avgRating.toFixed(1)}</p>
                        <StarRating rating={Math.round(avgRating)} size="sm" />
                        <p className="mt-1 text-xs text-muted-foreground">
                            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {breakdown.map(({ star, count, pct }) => (
                            <div key={star} className="flex items-center gap-2">
                                <span className="w-2 text-right text-xs text-muted-foreground">{star}</span>
                                <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-4 text-right text-xs text-muted-foreground">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-3">
                {displayed.map(review => (
                    <div key={review.id} className="rounded-xl border bg-background p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                {review.studentName?.charAt(0)?.toUpperCase() ?? 'S'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                    <div>
                                        <p className="text-sm font-semibold">{review.studentName ?? 'Student'}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <StarRating rating={review.rating} size="sm" />
                                            <span className={`text-xs font-medium ${
                                                review.rating >= 4 ? 'text-green-600' :
                                                review.rating === 3 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][review.rating]}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(review.createdAt)}
                                    </p>
                                </div>
                                {review.comment && (
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        "{review.comment}"
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length > 3 && (
                <button onClick={() => setShowAll(s => !s)}
                    className="w-full rounded-xl border py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                    {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
                </button>
            )}
        </div>
    );
}

// =============================================
// Rate Landlord Form
// =============================================

function RateLandlordSection({
    studentId,
    tenancy,
    existingReviews,
}: {
    studentId:       string;
    tenancy:         TenancyDto;
    existingReviews: ReviewDto[];
}) {
    const [rating,  setRating]  = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errors,  setErrors]  = useState<string[]>([]);

    const [addReview, { isLoading }] = useAddReviewMutation();

    // Check if student already reviewed this property
    const alreadyReviewed = existingReviews.some(r => r.studentId === studentId);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors([]);

        if (rating < 1 || rating > 5) {
            setErrors(['Please select a rating between 1 and 5 stars.']);
            return;
        }

        try {
            const response = await addReview({
                studentId,
                dto: {
                    landlordId: tenancy.studentId, // will be the landlord's id from tenancy
                    propertyId: tenancy.propertyId,
                    rating,
                    comment: comment.trim(),
                },
            });

            if ('data' in response && response.data?.success) {
                setSubmitted(true);
                toast.success('Review submitted successfully!');
            } else if ('error' in response) {
                const err     = response.error as any;
                const details = err?.data?.Details ?? err?.data?.details ?? [];
                const message = err?.data?.Message ?? err?.data?.message ?? 'Failed to submit review.';
                setErrors(details.length > 0 ? details : [message]);
            }
        } catch {
            setErrors(['An unexpected error occurred. Please try again.']);
        }
    }

    if (submitted) {
        return (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <p className="font-semibold text-green-800">Review Submitted! ⭐</p>
                <p className="text-sm text-green-700 mt-1">
                    Thank you for your feedback. It helps future students make informed decisions.
                </p>
            </div>
        );
    }

    if (alreadyReviewed) {
        return (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">You have already reviewed this property.</p>
                <p className="text-xs text-blue-600 mt-1">Thank you for your feedback!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Landlord info */}
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {isPlaceholder(tenancy.landlordName)
                        ? <User className="h-5 w-5" />
                        : tenancy.landlordName.charAt(0).toUpperCase()
                    }
                </div>
                <div>
                    <p className="text-sm font-semibold">
                        {isPlaceholder(tenancy.landlordName) ? 'Your Landlord' : tenancy.landlordName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isPlaceholder(tenancy.propertyTitle)
                            ? `Property #${tenancy.propertyId}`
                            : tenancy.propertyTitle}
                    </p>
                </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
                How has your experience been at{' '}
                <strong>
                    {isPlaceholder(tenancy.propertyTitle)
                        ? `Property #${tenancy.propertyId}`
                        : tenancy.propertyTitle}
                </strong>?
            </p>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    {errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-700">• {err}</p>
                    ))}
                </div>
            )}

            {/* Star picker */}
            <div className="flex justify-center">
                <StarPicker value={rating} onChange={setRating} disabled={isLoading} />
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium">
                    Comment
                    <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    disabled={isLoading}
                    placeholder="Share your experience with this property and landlord..."
                    maxLength={1000}
                    className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 resize-none"
                />
                <p className={`text-right text-xs ${comment.length > 900 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                    {comment.length}/1000
                </p>
            </div>

            <button type="submit" disabled={isLoading || rating === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-sm font-semibold text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                    : <><Star className="h-4 w-4 fill-white" /> Submit Review</>
                }
            </button>
        </form>
    );
}

// =============================================
// Main CommunityTab
// =============================================

export function CommunityTab({
    studentId,
    activeTenancy,
    announcements,
}: {
    studentId:     string;
    activeTenancy: TenancyDto | null;
    announcements: AnnouncementDto[];
}) {
    // Fetch full listing details to get real reviews
    const { data: listing } = useGetListingByIdQuery(
        activeTenancy?.propertyId ?? 0,
        { skip: !activeTenancy?.propertyId }
    );

    const reviews = listing?.reviews ?? [];

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-semibold">Property Community</h2>

          

            {/* ── Property Reviews ────────────────────────────── */}
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

            {/* ── Rate Your Landlord ──────────────────────────── */}
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