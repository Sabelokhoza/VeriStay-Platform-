'use client';

import { useState } from 'react';
import { Star, Calendar, MessageSquare } from 'lucide-react';
import { ReviewDto } from '@/app/errors/listingsApi';
import { formatDate } from './utils';
import { StarRating } from './StarRating';

export function ReviewsList({ reviews }: { reviews: ReviewDto[] }) {
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
