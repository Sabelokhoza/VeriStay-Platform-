'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { montserrat } from '@/lib/fonts';
import {
    ArrowLeft,
    Share2,
    Heart,
    Phone,
    MessageCircle,
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
} from 'lucide-react';
import { useGetListingByIdQuery } from '@/app/errors/listingsApi';

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
// Component
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
    const [contactRevealed, setContactRevealed] = useState(false);
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
                            <p className={`${montserrat.className} text-3xl font-bold text-blue-700`}>
                                R {formatRent(listing.monthlyRent)}
                                <span className="text-base font-normal text-muted-foreground"> per month</span>
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
                                    <Heart className={`h-4 w-4 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
                                </button>
                            </div>
                        </div>

                        <p className="mt-2 text-base font-medium">
                            {listing.title}
                        </p>

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
                                {listing.isAvailable ? availabilityLabel(listing.availableFrom) : 'Not available'}
                            </span>
                        </div>

                        <div className="mt-4">
                            <h2 className={`${montserrat.className} text-lg font-semibold`}>Description</h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {listing.description}
                            </p>
                        </div>

                        {listing.amenities?.length > 0 && (
                            <div className="mt-4">
                                <h2 className={`${montserrat.className} text-lg font-semibold`}>Amenities</h2>
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

                    {/* Sidebar */}
                    <div className="h-fit rounded-xl border bg-background p-6">
                        <h2 className={`${montserrat.className} text-lg font-semibold`}>Contact Agents</h2>

                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={() => setContactRevealed(true)}
                                className="flex items-center justify-center gap-2 rounded-full border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                <Phone className="h-4 w-4" />
                                {contactRevealed ? 'Contact Number Sent' : 'Show Contact Number'}
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Agent
                            </button>
                        </div>

                        <div className="mt-5 flex items-center gap-2 border-t pt-4">
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-semibold text-muted-foreground">
                                {listing.landlordName ?? 'Verified Landlord'}
                            </span>
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