'use client';

import { Star, MessageSquare } from 'lucide-react';
import { useGetLandlordDashboardQuery } from '@/app/errors/listingsApi';
import { StarRating } from './StarRating';

export default function ReputationSection({ landlordId }: { landlordId: string }) {
    const { data } = useGetLandlordDashboardQuery(landlordId, { skip: !landlordId });

    const score = data?.score ?? 0;

    const breakdown = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: star === 5 ? 3 : star === 4 ? 1 : 0,
        pct:   star === 5 ? 75 : star === 4 ? 25 : 0,
    }));

    const totalReviews = breakdown.reduce((sum, b) => sum + b.count, 0);

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                Reputation Score
            </div>
            <div className="p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex flex-col items-center justify-center shrink-0 sm:w-40">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 border-4 border-yellow-400">
                            <span className="text-3xl font-black text-yellow-600">
                                {score.toFixed(1)}
                            </span>
                        </div>
                        <StarRating rating={score} />
                        <p className="mt-1 text-xs text-muted-foreground">
                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                        </p>
                        <div className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            score >= 4 ? 'bg-green-100 text-green-800 border-green-200' :
                            score >= 3 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                        }`}>
                            {score >= 4.5 ? '⭐ Excellent' :
                             score >= 4   ? '✓ Very Good' :
                             score >= 3   ? 'Good'        :
                             score >= 2   ? 'Fair'        :
                             'Needs Improvement'}
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Rating Breakdown
                        </p>
                        {breakdown.map(({ star, count, pct }) => (
                            <div key={star} className="flex items-center gap-2">
                                <span className="w-2 text-right text-xs text-muted-foreground">{star}</span>
                                <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-yellow-400 transition-all"
                                        style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-4 text-right text-xs text-muted-foreground">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {totalReviews === 0 && (
                    <div className="mt-4 rounded-lg bg-muted/30 border border-dashed py-6 text-center">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm text-muted-foreground">No reviews yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Students will leave reviews after their tenancy.
                        </p>
                    </div>
                )}

                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800 space-y-1">
                    <p className="font-semibold">💡 How to improve your score</p>
                    <ul className="space-y-0.5 list-disc list-inside">
                        <li>Respond to maintenance requests promptly</li>
                        <li>Keep the property in good condition</li>
                        <li>Communicate clearly with tenants</li>
                        <li>Send payment reminders politely and on time</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
