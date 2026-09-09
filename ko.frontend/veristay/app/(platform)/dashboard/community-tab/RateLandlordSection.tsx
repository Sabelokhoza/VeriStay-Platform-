'use client';

import { useState } from 'react';
import { Star, Loader2, CheckCircle, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAddReviewMutation, TenancyDto, ReviewDto } from '@/app/errors/listingsApi';
import { isPlaceholder } from './utils';
import { StarPicker } from './StarPicker';

export function RateLandlordSection({
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
                    landlordId: tenancy.studentId,
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

            {errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    {errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-700">• {err}</p>
                    ))}
                </div>
            )}

            <div className="flex justify-center">
                <StarPicker value={rating} onChange={setRating} disabled={isLoading} />
            </div>

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
