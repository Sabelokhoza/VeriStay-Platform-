'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { montserrat } from '@/lib/fonts';
import {
    ArrowLeft, Heart, BedDouble, ShieldCheck, MapPin,
    Images, LayoutGrid, X, ChevronLeft, ChevronRight,
    Home, Mail, Phone, User, FileText, Loader2,
    CheckCircle, XCircle, Star, MessageSquare,
    Calendar, AlertCircle,
} from 'lucide-react';
import {
    useGetListingByIdQuery,
    useApplyForPropertyMutation,
    useAddReviewMutation,
    ReviewDto,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';

// =============================================
// Helpers
// =============================================

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function formatDisplay(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function bedroomLabel(count: number) {
    return `${count} Bedroom${count === 1 ? '' : 's'}`;
}

function availabilityLabel(availableFrom: string) {
    const date  = new Date(availableFrom);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date <= today) return 'Available now';
    return `Available: ${date.toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    })}`;
}

// =============================================
// Star Rating Display
// =============================================

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
    const cls = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`${cls} shrink-0 ${
                    star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                }`} />
            ))}
        </div>
    );
}

// =============================================
// Modals — Login, Success, Error
// =============================================

function LoginRequiredModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-xl text-center">
                <button onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <ShieldCheck className="h-8 w-8 text-yellow-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    You need to be logged in as a student to apply for accommodation.
                </p>
                <div className="flex flex-col gap-3">
                    <a href="/login"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        Sign In
                    </a>
                    <a href="/register"
                        className="w-full rounded-lg border px-4 py-2.5 text-center text-sm font-medium hover:bg-muted transition-colors">
                        Create Account
                    </a>
                </div>
            </div>
        </div>
    );
}

function SuccessModal({ propertyTitle, onClose }: { propertyTitle: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-xl text-center">
                <button onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Application Sent! 🎉</h2>
                <p className="text-sm text-muted-foreground mb-1">Your application for</p>
                <p className="font-semibold mb-4">{propertyTitle}</p>
                <p className="text-sm text-muted-foreground mb-6">
                    has been submitted. The landlord will review and get back to you.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800 text-left mb-6">
                    <p className="font-semibold mb-1">What happens next?</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>The landlord reviews your application</li>
                        <li>You'll receive a notification on approval or rejection</li>
                        <li>Track your status in the Applications tab</li>
                    </ul>
                </div>
                <button onClick={onClose}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}

function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-xl text-center">
                <button onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Application Failed</h2>
                <p className="text-sm text-muted-foreground mb-4">We couldn't submit your application.</p>
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 mb-6">
                    {message}
                </div>
                <button onClick={onClose}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
}

// =============================================
// Apply Date Modal
// =============================================

function ApplyDateModal({
    propertyTitle, monthlyRent, availableFrom,
    onConfirm, onClose, isLoading,
}: {
    propertyTitle:  string;
    monthlyRent:    number;
    availableFrom:  string;
    onConfirm:      (fromDate: string, toDate: string) => void;
    onClose:        () => void;
    isLoading:      boolean;
}) {
    const today   = new Date().toISOString().split('T')[0];
    const propMin = availableFrom
        ? new Date(availableFrom).toISOString().split('T')[0]
        : today;
    const minFrom = propMin > today ? propMin : today;

    const [fromDate, setFromDate] = useState(minFrom);
    const [toDate,   setToDate]   = useState(() => {
        const d = new Date(minFrom);
        d.setFullYear(d.getFullYear() + 1);
        return d.toISOString().split('T')[0];
    });
    const [error, setError] = useState<string | null>(null);

    const durationMonths = (() => {
        if (!fromDate || !toDate) return 0;
        const from = new Date(fromDate);
        const to   = new Date(toDate);
        return Math.max(0,
            (to.getFullYear() - from.getFullYear()) * 12 +
            (to.getMonth() - from.getMonth()));
    })();

    const totalCost = durationMonths * monthlyRent;

    function handleFromChange(value: string) {
        if (value < today) { setError('Move-in date cannot be in the past.'); return; }
        setFromDate(value);
        setError(null);
        if (toDate <= value) {
            const d = new Date(value);
            d.setMonth(d.getMonth() + 6);
            setToDate(d.toISOString().split('T')[0]);
        }
    }

    function handleToChange(value: string) {
        if (value < today)    { setError('Move-out date cannot be in the past.'); return; }
        if (value <= fromDate) { setError('Move-out date must be after the move-in date.'); return; }
        setToDate(value);
        setError(null);
    }

    function handleConfirm() {
        if (fromDate < today)   { setError('Move-in date cannot be in the past.'); return; }
        if (toDate < today)     { setError('Move-out date cannot be in the past.'); return; }
        if (toDate <= fromDate) { setError('Move-out date must be after the move-in date.'); return; }
        if (durationMonths < 1) { setError('Lease must be at least 1 month.'); return; }
        setError(null);
        onConfirm(new Date(fromDate).toISOString(), new Date(toDate).toISOString());
    }

    const inputClass =
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden my-auto">

                {/* Header */}
                <div className="bg-blue-600 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                            <Home className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Apply for Accommodation</h2>
                            <p className="text-sm text-blue-100 mt-0.5 truncate">{propertyTitle}</p>
                        </div>
                    </div>
                </div>

                {/* Rent */}
                <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-3">
                    <span className="text-sm text-muted-foreground">Monthly Rent</span>
                    <span className="text-lg font-bold text-blue-600">R {formatRent(monthlyRent)}</span>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">
                                Move-in Date <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input type="date" value={fromDate} min={minFrom}
                                    onChange={e => handleFromChange(e.target.value)}
                                    disabled={isLoading}
                                    className={`${inputClass} pl-9`} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Earliest: {formatDisplay(minFrom)}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">
                                Move-out Date <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input type="date" value={toDate}
                                    min={fromDate > today ? fromDate : today}
                                    onChange={e => handleToChange(e.target.value)}
                                    disabled={isLoading}
                                    className={`${inputClass} pl-9`} />
                            </div>
                            <p className="text-xs text-muted-foreground">Must be after move-in</p>
                        </div>
                    </div>

                    {/* Lease summary */}
                    {durationMonths > 0 && (
                        <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Lease Summary
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">Move-in</p>
                                    <p className="font-semibold">{formatDisplay(fromDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Move-out</p>
                                    <p className="font-semibold">{formatDisplay(toDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                    <p className="font-semibold">
                                        {durationMonths} {durationMonths === 1 ? 'month' : 'months'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Est. Total Rent</p>
                                    <p className="font-bold text-blue-600">R {formatRent(totalCost)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                        <p className="font-semibold mb-0.5">📋 What happens next?</p>
                        <ul className="space-y-0.5 list-disc list-inside">
                            <li>Your application is sent to the landlord for review</li>
                            <li>The landlord will approve or reject your application</li>
                            <li>You'll be notified of the decision via email</li>
                        </ul>
                    </div>

                    <button onClick={handleConfirm}
                        disabled={isLoading || durationMonths < 1}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                            : <><FileText className="h-4 w-4" /> Submit Application</>
                        }
                    </button>

                    <button onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Review components (StarPicker, ReviewsSection)
// =============================================

type ReviewModalState = 'none' | 'form' | 'success' | 'login';

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
                        className="rounded transition-transform hover:scale-110 disabled:cursor-not-allowed">
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
                    (hovered || value) === 3 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                    {labels[hovered || value]}
                </span>
            )}
        </div>
    );
}

function AddReviewModal({
    propertyId, propertyTitle, landlordId, studentId, onClose, onSuccess,
}: {
    propertyId: number; propertyTitle: string; landlordId: string;
    studentId: string; onClose: () => void; onSuccess: () => void;
}) {
    const [rating,  setRating]  = useState(0);
    const [comment, setComment] = useState('');
    const [errors,  setErrors]  = useState<string[]>([]);
    const [addReview, { isLoading }] = useAddReviewMutation();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors([]);
        if (rating < 1) { setErrors(['Please select a rating.']); return; }
        try {
            const response = await addReview({
                studentId,
                dto: { landlordId, propertyId, rating, comment: comment.trim() },
            });
            if ('data' in response && response.data?.success) {
                onSuccess();
            } else if ('error' in response) {
                const err    = response.error as any;
                const details = err?.data?.Details ?? err?.data?.details ?? [];
                const message = err?.data?.Message ?? err?.data?.message ?? 'Failed to submit review.';
                setErrors(details.length > 0 ? details : [message]);
            }
        } catch {
            setErrors(['An unexpected error occurred.']);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-yellow-500 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Leave a Review</h2>
                    <p className="text-sm text-yellow-100 mt-0.5 truncate">{propertyTitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {errors.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                            {errors.map((e, i) => <p key={i} className="text-sm text-red-700">• {e}</p>)}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Your Rating <span className="text-destructive">*</span></label>
                        <StarPicker value={rating} onChange={setRating} disabled={isLoading} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold">
                            Comment <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                        </label>
                        <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)}
                            disabled={isLoading} maxLength={1000}
                            placeholder="Share your experience..."
                            className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none disabled:opacity-50" />
                        <p className={`text-right text-xs ${comment.length > 900 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {comment.length}/1000
                        </p>
                    </div>
                    <button type="submit" disabled={isLoading || rating === 0}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-sm font-semibold text-white hover:bg-yellow-600 transition-colors disabled:opacity-50">
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                            : <><Star className="h-4 w-4 fill-white" /> Submit Review</>
                        }
                    </button>
                    <button type="button" onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

function ReviewLoginModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-background p-8 shadow-xl text-center">
                <button onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <ShieldCheck className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Only registered students can leave reviews.
                </p>
                <div className="flex flex-col gap-3">
                    <a href="/login" className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        Sign In
                    </a>
                    <a href="/register" className="w-full rounded-lg border px-4 py-2.5 text-center text-sm font-medium hover:bg-muted transition-colors">
                        Create Student Account
                    </a>
                </div>
            </div>
        </div>
    );
}

function ReviewSuccessModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-background p-8 shadow-xl text-center">
                <button onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Review Submitted! ⭐</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Thank you! Your review helps future students.
                </p>
                <button onClick={onClose}
                    className="w-full rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600 transition-colors">
                    Done
                </button>
            </div>
        </div>
    );
}

function ReviewsSection({
    reviews, propertyId, propertyTitle, landlordId,
}: {
    reviews: ReviewDto[]; propertyId: number; propertyTitle: string; landlordId: string;
}) {
    const [showAll,     setShowAll]     = useState(false);
    const [reviewModal, setReviewModal] = useState<ReviewModalState>('none');

    const userId    = useAppSelector((state: any) => state.userAuthStore?.id);
    const isStudent = useAppSelector((state: any) => state.userAuthStore?.role === 'Student');

    function handleWriteReview() {
        if (!userId || !isStudent) { setReviewModal('login'); return; }
        setReviewModal('form');
    }

    const avgRating = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : null;

    const breakdown = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct:   reviews.length > 0
            ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
            : 0,
    }));

    const displayed = showAll ? reviews : reviews.slice(0, 3);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className={`${montserrat.className} text-lg font-semibold`}>
                    Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h2>
                <button onClick={handleWriteReview}
                    className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400 bg-yellow-50 px-4 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-100 transition-colors">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    Write a Review
                </button>
            </div>

            {reviews.length === 0 ? (
                <div className="rounded-xl border bg-muted/30 py-10 text-center">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm text-muted-foreground font-medium">No reviews yet</p>
                    <button onClick={handleWriteReview}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-yellow-500 px-4 py-2 text-xs font-semibold text-white hover:bg-yellow-600 transition-colors">
                        <Star className="h-3.5 w-3.5 fill-white" />
                        Be the first to review
                    </button>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="mb-5 rounded-xl border bg-muted/30 p-5">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            <div className="flex flex-col items-center justify-center shrink-0 sm:w-36">
                                <p className="text-5xl font-bold">{avgRating!.toFixed(1)}</p>
                                <StarRating rating={Math.round(avgRating!)} size="md" />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                </p>
                            </div>
                            <div className="flex-1 space-y-2">
                                {breakdown.map(({ star, count, pct }) => (
                                    <div key={star} className="flex items-center gap-2">
                                        <span className="w-2 text-right text-xs text-muted-foreground">{star}</span>
                                        <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                            <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Individual reviews */}
                    <div className="space-y-4">
                        {displayed.map(review => (
                            <div key={review.id} className="rounded-xl border bg-background p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
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
                                                        review.rating === 3 ? 'text-yellow-600' : 'text-red-600'
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
                            className="mt-4 w-full rounded-xl border py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                            {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
                        </button>
                    )}
                </>
            )}

            {/* Review modals */}
            {reviewModal === 'form' && (
                <AddReviewModal
                    propertyId={propertyId}
                    propertyTitle={propertyTitle}
                    landlordId={landlordId}
                    studentId={userId}
                    onClose={() => setReviewModal('none')}
                    onSuccess={() => setReviewModal('success')}
                />
            )}
            {reviewModal === 'success' && (
                <ReviewSuccessModal onClose={() => setReviewModal('none')} />
            )}
            {reviewModal === 'login' && (
                <ReviewLoginModal onClose={() => setReviewModal('none')} />
            )}
        </>
    );
}

// =============================================
// Apply Button — with date modal
// =============================================

type ApplyModalState =
    | { type: 'none' }
    | { type: 'dates' }
    | { type: 'login' }
    | { type: 'success'; propertyTitle: string }
    | { type: 'error'; message: string };

function ApplyButton({
    propertyId, propertyTitle, monthlyRent, availableFrom,
}: {
    propertyId:    number;
    propertyTitle: string;
    monthlyRent:   number;
    availableFrom: string;
}) {
    const [modal,  setModal] = useState<ApplyModalState>({ type: 'none' });
    const [applyForProperty, { isLoading }] = useApplyForPropertyMutation();

    const userId    = useAppSelector((state: any) => state.userAuthStore?.id);
    const isStudent = useAppSelector((state: any) => state.userAuthStore?.role === 'Student');

    function handleClick() {
        if (!userId || !isStudent) {
            setModal({ type: 'login' });
        } else {
            setModal({ type: 'dates' });
        }
    }

    async function handleConfirm(fromDate: string, toDate: string) {
        try {
            const response = await applyForProperty({
                studentId:  userId!,
                propertyId,
                fromDate,
                toDate,
            });
            if ('data' in response && response.data?.success) {
                setModal({ type: 'success', propertyTitle });
            } else if ('error' in response) {
                const err     = response.error as any;
                const message =
                    err?.data?.Message ??
                    err?.data?.message ??
                    err?.data?.details?.[0] ??
                    'Something went wrong.';
                setModal({ type: 'error', message });
            }
        } catch {
            setModal({ type: 'error', message: 'An unexpected error occurred.' });
        }
    }

    return (
        <>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <FileText className="h-4 w-4" />
                Apply Now
            </button>

            {modal.type === 'dates' && (
                <ApplyDateModal
                    propertyTitle={propertyTitle}
                    monthlyRent={monthlyRent}
                    availableFrom={availableFrom}
                    onConfirm={handleConfirm}
                    onClose={() => setModal({ type: 'none' })}
                    isLoading={isLoading}
                />
            )}
            {modal.type === 'login'   && <LoginRequiredModal onClose={() => setModal({ type: 'none' })} />}
            {modal.type === 'success' && <SuccessModal propertyTitle={modal.propertyTitle} onClose={() => setModal({ type: 'none' })} />}
            {modal.type === 'error'   && <ErrorModal message={modal.message} onClose={() => setModal({ type: 'none' })} />}
        </>
    );
}

// =============================================
// Main Page
// =============================================

export default function ListingDetailsPage() {
    const params     = useParams();
    const router     = useRouter();
    const propertyId = Number(params?.listingid);

    const { data: listing, isLoading, isFetching, isError } =
        useGetListingByIdQuery(propertyId, { skip: Number.isNaN(propertyId) });

    const [saved,        setSaved]        = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex,  setActiveIndex]  = useState(0);

    const images = useMemo(() => {
        if (!listing?.images?.length) return [];
        const primary = listing.images.find(img => img.isPrimary);
        if (!primary) return listing.images;
        return [primary, ...listing.images.filter(img => img.id !== primary.id)];
    }, [listing]);

    const reviews    = listing?.reviews ?? [];
    const avgRating  = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    function openLightbox(index: number) { setActiveIndex(index); setLightboxOpen(true); }
    function nextImage() { setActiveIndex(i => (i + 1) % images.length); }
    function prevImage() { setActiveIndex(i => (i - 1 + images.length) % images.length); }

    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen w-full bg-muted/30">
                <div className="container mx-auto px-4 py-6 space-y-4">
                    <div className="h-[420px] w-full animate-pulse rounded-xl bg-muted" />
                    <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-32 animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        );
    }

    if (isError || !listing) {
        return (
            <div className="min-h-screen w-full bg-muted/30">
                <div className="container mx-auto px-4 py-10 text-center text-sm text-red-700">
                    Couldn't load this listing.
                </div>
            </div>
        );
    }

    const heroImage    = images[0]?.imageUrl;
    const gridImages   = images.slice(1, 3);
    const remainingCount = images.length - 3;
    const beds         = bedroomLabel(listing.availableBeds);

    return (
        <div className="min-h-screen w-full bg-muted/30">
            <div className="container mx-auto px-4 py-6">

                {/* Back */}
                <button onClick={() => router.back()}
                    className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to results
                </button>

                {/* Gallery */}
                <div className="overflow-hidden rounded-xl border bg-background">
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:grid-rows-2">
                        <div className="relative h-72 cursor-pointer sm:col-span-2 sm:row-span-2 sm:h-[420px]"
                            onClick={() => images.length && openLightbox(0)}>
                            {heroImage ? (
                                <img src={heroImage} alt={listing.title}
                                    className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                    <Home className="h-10 w-10 opacity-40" />
                                </div>
                            )}
                        </div>
                        {gridImages.map((img, i) => (
                            <div key={img.id}
                                className="relative hidden h-[209px] cursor-pointer sm:block"
                                onClick={() => openLightbox(i + 1)}>
                                <img src={img.imageUrl} alt={`Photo ${i + 2}`}
                                    className="h-full w-full object-cover" />
                                {i === gridImages.length - 1 && remainingCount > 0 && (
                                    <button
                                        onClick={e => { e.stopPropagation(); openLightbox(0); }}
                                        className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold shadow">
                                        See all {images.length} images
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-3 border-t bg-slate-900 py-3">
                        <button onClick={() => images.length && openLightbox(0)}
                            className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10">
                            <Images className="h-4 w-4" /> Photos ({images.length})
                        </button>
                        <button onClick={() => images.length && openLightbox(0)}
                            className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10">
                            <LayoutGrid className="h-4 w-4" /> Photo Grid
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Main */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="rounded-xl border bg-background p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className={`${montserrat.className} text-3xl font-bold text-blue-700`}>
                                        R {formatRent(listing.monthlyRent)}
                                        <span className="text-base font-normal text-muted-foreground"> per month</span>
                                    </p>
                                    {avgRating !== null && (
                                        <div className="mt-1 flex items-center gap-2">
                                            <StarRating rating={Math.round(avgRating)} size="sm" />
                                            <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setSaved(s => !s)}
                                    className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-blue-50 hover:text-blue-600">
                                    <Heart className={`h-5 w-5 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
                                </button>
                            </div>

                            <p className="mt-2 text-base font-medium">{listing.title}</p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-blue-600">
                                <MapPin className="h-3.5 w-3.5" />
                                {listing.address}, {listing.city}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-6 border-y py-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <BedDouble className="h-4 w-4" /> {beds}
                                </span>
                                <span className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                                    listing.isAvailable
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-muted text-muted-foreground'
                                }`}>
                                    {listing.isAvailable
                                        ? availabilityLabel(listing.availableFrom)
                                        : 'Not available'}
                                </span>
                            </div>

                            {listing.description && (
                                <div className="mt-4">
                                    <h2 className={`${montserrat.className} text-lg font-semibold`}>Description</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {listing.description}
                                    </p>
                                </div>
                            )}

                            {listing.amenities?.length > 0 && (
                                <div className="mt-4">
                                    <h2 className={`${montserrat.className} text-lg font-semibold`}>Amenities</h2>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {listing.amenities.map((a, i) => (
                                            <span key={i} className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reviews */}
                        <div className="rounded-xl border bg-background p-6">
                            <ReviewsSection
                                reviews={reviews}
                                propertyId={listing.id}
                                propertyTitle={listing.title}
                                landlordId={listing.landlordId}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Rating card */}
                        {avgRating !== null && (
                            <div className="rounded-xl border bg-background p-5">
                                <h3 className={`${montserrat.className} text-sm font-semibold mb-3`}>
                                    Overall Rating
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-50 shrink-0">
                                        <span className="text-2xl font-bold text-yellow-600">
                                            {avgRating.toFixed(1)}
                                        </span>
                                    </div>
                                    <div>
                                        <StarRating rating={Math.round(avgRating)} size="md" />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Landlord + Apply card */}
                        <div className="h-fit rounded-xl border bg-background p-6">
                            <h2 className={`${montserrat.className} text-lg font-semibold`}>Landlord</h2>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">
                                        {listing.landlordName ?? 'Verified Landlord'}
                                    </p>
                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col gap-2 border-t pt-4 text-sm text-muted-foreground">
                                {listing.landLordEmail && (
                                    <a href={`mailto:${listing.landLordEmail}`}
                                        className="flex items-center gap-2 truncate hover:text-blue-600">
                                        <Mail className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{listing.landLordEmail}</span>
                                    </a>
                                )}
                                {listing.landLordPhoneNumber && (
                                    <a href={`tel:${listing.landLordPhoneNumber}`}
                                        className="flex items-center gap-2 hover:text-blue-600">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        {listing.landLordPhoneNumber}
                                    </a>
                                )}
                            </div>

                            {/* ✅ ApplyButton with all required props */}
                            <div className="mt-5 border-t pt-4">
                                <ApplyButton
                                    propertyId={listing.id}
                                    propertyTitle={listing.title}
                                    monthlyRent={listing.monthlyRent}
                                    availableFrom={listing.availableFrom}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <button onClick={() => setLightboxOpen(false)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                        <X className="h-5 w-5" />
                    </button>
                    {images.length > 1 && (
                        <button onClick={prevImage}
                            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}
                    <div className="relative h-[80vh] w-full max-w-4xl">
                        <img
                            src={images[activeIndex].imageUrl}
                            alt={`Photo ${activeIndex + 1}`}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    {images.length > 1 && (
                        <button onClick={nextImage}
                            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}
                    <span className="absolute bottom-6 text-sm font-medium text-white">
                        {activeIndex + 1} / {images.length}
                    </span>
                </div>
            )}
        </div>
    );
}