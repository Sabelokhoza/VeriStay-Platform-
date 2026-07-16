'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { montserrat } from '@/lib/fonts';
import {
    ArrowLeft,
    Share2,
    Heart,
    BedDouble,
    ShieldCheck,
    MapPin,
    Images,
    LayoutGrid,
    Map as MapIcon,
    X,
    ChevronLeft,
    ChevronRight,
    Home,
    Mail,
    Phone,
    User,
    FileText,
    Loader2,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useGetListingByIdQuery, useApplyForPropertyMutation } from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function bedroomLabel(count: number) {
    return `${count} Bedroom${count === 1 ? '' : 's'}`;
}

function availabilityLabel(availableFrom: string) {
    const date = new Date(availableFrom);
    if (Number.isNaN(date.getTime())) return 'Available now';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = new Date(date);
    from.setHours(0, 0, 0, 0);

    if (from <= today) return 'Available now';

    return `Available: ${from.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}`;
}

// ---------------------------------------------------------------------------
// Apply Modals
// ---------------------------------------------------------------------------

function SuccessModal({ propertyTitle, onClose }: { propertyTitle: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-xl text-center">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <h2 className="mb-2 text-xl font-bold">Application Sent! 🎉</h2>
                <p className="mb-1 text-sm text-muted-foreground">Your application for</p>
                <p className="mb-4 font-semibold text-foreground">{propertyTitle}</p>
                <p className="mb-6 text-sm text-muted-foreground">
                    has been submitted successfully. The landlord will review your application and
                    get back to you. You can track your application status in your dashboard.
                </p>

                <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-left text-xs text-blue-800">
                    <p className="mb-1 font-semibold">What happens next?</p>
                    <ul className="list-inside list-disc space-y-1">
                        <li>The landlord reviews your application</li>
                        <li>You&apos;ll receive a notification on approval or rejection</li>
                        <li>Track your status in the Applications tab</li>
                    </ul>
                </div>

                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
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
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                </div>

                <h2 className="mb-2 text-xl font-bold">Application Failed</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                    We couldn&apos;t submit your application.
                </p>

                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {message}
                </div>

                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

function LoginRequiredModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-xl text-center">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <ShieldCheck className="h-8 w-8 text-yellow-600" />
                    </div>
                </div>

                <h2 className="mb-2 text-xl font-bold">Sign In Required</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    You need to be logged in as a student to apply for accommodation.
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="/login"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Sign In
                    </a>
                    <a
                        href="/register"
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Create Account
                    </a>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Apply Button
// ---------------------------------------------------------------------------

type ModalState =
    | { type: 'none' }
    | { type: 'login' }
    | { type: 'success'; propertyTitle: string }
    | { type: 'error'; message: string };

function ApplyButton({ propertyId, propertyTitle }: { propertyId: number; propertyTitle: string }) {
    const [modal, setModal] = useState<ModalState>({ type: 'none' });
    const [applyForProperty, { isLoading }] = useApplyForPropertyMutation();

    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const isLoggedIn = !!userId;
    const isStudent = useAppSelector((state) => state.userAuthStore?.role === 'Student');

    async function handleApply() {
        if (!isLoggedIn) {
            setModal({ type: 'login' });
            return;
        }

        if (!isStudent) {
            setModal({
                type: 'error',
                message: 'Only registered students can apply for accommodation.',
            });
            return;
        }

        try {
            const response = await applyForProperty({
                studentId: userId,
                propertyId,
                supportingDocumentUrl: '',
            });

            if ('data' in response && response.data?.success) {
                setModal({ type: 'success', propertyTitle });
            } else if ('error' in response) {
                const err = response.error as any;
                const message =
                    err?.data?.Message ||
                    err?.data?.message ||
                    err?.data?.details?.[0] ||
                    'Something went wrong. Please try again.';
                setModal({ type: 'error', message });
            }
        } catch {
            setModal({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.',
            });
        }
    }

    return (
        <>
            <button
                onClick={handleApply}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <FileText className="h-4 w-4" />
                        Apply Now
                    </>
                )}
            </button>

            {modal.type === 'login' && (
                <LoginRequiredModal onClose={() => setModal({ type: 'none' })} />
            )}
            {modal.type === 'success' && (
                <SuccessModal
                    propertyTitle={modal.propertyTitle}
                    onClose={() => setModal({ type: 'none' })}
                />
            )}
            {modal.type === 'error' && (
                <ErrorModal message={modal.message} onClose={() => setModal({ type: 'none' })} />
            )}
        </>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ListingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const propertyId = Number(params?.listingid);

    const {
        data: listing,
        isLoading,
        isFetching,
        isError,
    } = useGetListingByIdQuery(propertyId, {
        skip: Number.isNaN(propertyId),
    });

    const [saved, setSaved] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const loading = isLoading || isFetching;

    // Primary image first, then the rest, in whatever order the API sent them.
    const images = useMemo(() => {
        if (!listing?.images?.length) return [];
        const primary = listing.images.find((img) => img.isPrimary);
        if (!primary) return listing.images;
        return [primary, ...listing.images.filter((img) => img.id !== primary.id)];
    }, [listing]);

    function openLightbox(index: number) {
        setActiveIndex(index);
        setLightboxOpen(true);
    }

    function nextImage() {
        setActiveIndex((i) => (i + 1) % images.length);
    }

    function prevImage() {
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
    }

    // ---- Loading state ----
    if (loading) {
        return (
            <div className="min-h-screen w-full bg-muted/30">
                <div className="container mx-auto px-4 py-6">
                    <div className="h-[420px] w-full animate-pulse rounded-xl bg-muted" />
                    <div className="mt-6 h-8 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
            </div>
        );
    }

    // ---- Error / not found state ----
    if (isError || !listing) {
        return (
            <div className="min-h-screen w-full bg-muted/30">
                <div className="container mx-auto px-4 py-10">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                        Couldn&apos;t load this listing.
                    </div>
                </div>
            </div>
        );
    }

    const beds = bedroomLabel(listing.availableBeds);
    const heroImage = images[0]?.imageUrl;
    const gridImages = images.slice(1, 3);
    const remainingCount = images.length - 3;
    const titleText = listing.title;

    return (
        <div className="min-h-screen w-full bg-muted/30">
            <div className="container mx-auto px-4 py-6">
                {/* Back link */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to results
                </button>

                {/* Gallery */}
                <div className="overflow-hidden rounded-xl border bg-background">
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:grid-rows-2">
                        {/* Hero image */}
                        <div
                            className="relative h-72 cursor-pointer sm:col-span-2 sm:row-span-2 sm:h-[420px]"
                            onClick={() => images.length && openLightbox(0)}
                        >
                            {heroImage ? (
                                <Image
                                    src={heroImage}
                                    alt={titleText}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 66vw"
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                    <Home className="h-10 w-10 opacity-40" />
                                </div>
                            )}
                        </div>

                        {/* Side grid (2 more thumbnails) */}
                        {gridImages.map((img, i) => (
                            <div
                                key={img.id}
                                className="relative hidden h-[209px] cursor-pointer sm:block"
                                onClick={() => openLightbox(i + 1)}
                            >
                                <Image
                                    src={img.imageUrl}
                                    alt={`${titleText} photo ${i + 2}`}
                                    fill
                                    sizes="288px"
                                    className="object-cover"
                                />
                                {i === gridImages.length - 1 && remainingCount > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openLightbox(0);
                                        }}
                                        className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold shadow"
                                    >
                                        See all {images.length} images
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center justify-center gap-3 border-t bg-slate-900 py-3">
                        <button
                            onClick={() => images.length && openLightbox(0)}
                            className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10"
                        >
                            <Images className="h-4 w-4" />
                            Photos ({images.length})
                        </button>
                        <button
                            onClick={() => images.length && openLightbox(0)}
                            className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            Photo Grid
                        </button>
                        <button className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10">
                            <MapIcon className="h-4 w-4" />
                            Map
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main details */}
                    <div className="rounded-xl border bg-background p-6 lg:col-span-2">
                        <div className="flex items-start justify-between gap-4">
                            <p
                                className={`${montserrat.className} text-3xl font-bold text-blue-700`}
                            >
                                R {formatRent(listing.monthlyRent)}
                                <span className="text-base font-normal text-muted-foreground">
                                    {' '}
                                    per month
                                </span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    aria-label="Share listing"
                                    className="rounded-full border p-2 text-muted-foreground hover:bg-muted"
                                >
                                    <Share2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setSaved((s) => !s)}
                                    aria-label={saved ? 'Remove from saved' : 'Save listing'}
                                    className="rounded-full border p-2 text-muted-foreground hover:bg-muted"
                                >
                                    <Heart
                                        className={`h-4 w-4 ${saved ? 'fill-blue-600 text-blue-600' : ''}`}
                                    />
                                </button>
                            </div>
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
                            <span
                                className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                                    listing.isAvailable
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {listing.isAvailable
                                    ? availabilityLabel(listing.availableFrom)
                                    : 'Not available'}
                            </span>
                        </div>

                        <div className="mt-4">
                            <h2 className={`${montserrat.className} text-lg font-semibold`}>
                                Description
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {listing.description}
                            </p>
                        </div>

                        {listing.amenities?.length > 0 && (
                            <div className="mt-4">
                                <h2 className={`${montserrat.className} text-lg font-semibold`}>
                                    Amenities
                                </h2>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {listing.amenities.map((amenity, i) => (
                                        <span
                                            key={`${amenity}-${i}`}
                                            className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar — Landlord info + Apply */}
                    <div className="h-fit rounded-xl border bg-background p-6">
                        <h2 className={`${montserrat.className} text-lg font-semibold`}>
                            Landlord
                        </h2>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {listing.landlordName ?? 'Verified Landlord'}
                                </p>
                                <span className="flex items-center gap-1 text-xs text-emerald-600">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Verified
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 border-t pt-4 text-sm text-muted-foreground">
                            {listing.landLordEmail && (
                                <span className="flex items-center gap-2 truncate">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{listing.landLordEmail}</span>
                                </span>
                            )}
                            {listing.landLordPhoneNumber && (
                                <span className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    {listing.landLordPhoneNumber}
                                </span>
                            )}
                        </div>

                        <div className="mt-5 border-t pt-4">
                            <ApplyButton propertyId={listing.id} propertyTitle={listing.title} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close gallery"
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {images.length > 1 && (
                        <button
                            onClick={prevImage}
                            aria-label="Previous image"
                            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}

                    <div className="relative h-[80vh] w-full max-w-4xl">
                        <Image
                            src={images[activeIndex].imageUrl}
                            alt={`Photo ${activeIndex + 1} of ${images.length}`}
                            fill
                            sizes="100vw"
                            className="object-contain"
                        />
                    </div>

                    {images.length > 1 && (
                        <button
                            onClick={nextImage}
                            aria-label="Next image"
                            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                        >
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
