'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { montserrat } from '@/lib/fonts';
import {
    Search,
    Home,
    Heart,
    BedDouble,
    ChevronDown,
    ChevronRight,
    Tag,
    SlidersHorizontal,
    MapPin,
    ShieldCheck,
} from 'lucide-react';
import { ListingDto, useGetListingsQuery } from '@/app/errors/listingsApi';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function isNewListing(createdAt: string) {
    const created = new Date(createdAt).getTime();
    if (Number.isNaN(created)) return false;
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    return Date.now() - created <= THIRTY_DAYS;
}

function availabilityLabel(availableFrom: string) {
    const date = new Date(availableFrom);
    if (Number.isNaN(date.getTime())) return 'Available now';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = new Date(date);
    from.setHours(0, 0, 0, 0);

    if (from <= today) return 'Available now';

    return `Available: ${from.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}`;
}

function bedroomLabel(count: number) {
    return `${count} Bedroom${count === 1 ? '' : 's'}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// =============================================
// ListingsPage.tsx — updated search section
// =============================================

export default function ListingsPage({ city = '' }: { city?: string }) {
    const [sortBy, setSortBy]   = useState<SortOption>('default');
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
    const [search, setSearch]   = useState(city);
    const [searchField, setSearchField] = useState<'city' | 'title' | 'address' | 'description'>('city');
    const [debouncedSearch, setDebouncedSearch] = useState(city);
    const [debouncedField, setDebouncedField]   = useState<'city' | 'title' | 'address' | 'description'>('city');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setDebouncedField(searchField);
        }, 400);
        return () => clearTimeout(timer);
    }, [search, searchField]);

    const queryParams = useMemo(() => ({
        city:        debouncedField === 'city'        ? debouncedSearch : undefined,
        title:       debouncedField === 'title'       ? debouncedSearch : undefined,
        address:     debouncedField === 'address'     ? debouncedSearch : undefined,
        description: debouncedField === 'description' ? debouncedSearch : undefined,
    }), [debouncedSearch, debouncedField]);

    const {
        data: listings,
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetListingsQuery(queryParams);

    const sortedListings = useMemo(() => {
        const list = [...(listings ?? [])];
        switch (sortBy) {
            case 'price-asc':  return list.sort((a, b) => a.monthlyRent - b.monthlyRent);
            case 'price-desc': return list.sort((a, b) => b.monthlyRent - a.monthlyRent);
            case 'newest':     return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            default:           return list;
        }
    }, [listings, sortBy]);

    function toggleSaved(id: number) {
       
    }

    const loading = isLoading || isFetching;

    const placeholderMap = {
        city:        'Search by city...',
        title:       'Search by title...',
        address:     'Search by address...',
        description: 'Search by description...',
    };

    return (
        <div className="min-h-screen w-full bg-muted/30">
            {/* Search / filter bar */}
            <div className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex items-center gap-3 overflow-x-auto px-4 py-3">

                    {/* Search field selector + input */}
                    <div className="flex flex-1 max-w-2xl items-center rounded-full border bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-600 overflow-hidden">
                        
                        {/* Field selector */}
                        <div className="relative border-r">
                            <select
                                value={searchField}
                                onChange={(e) => {
                                    setSearchField(e.target.value as typeof searchField);
                                    setSearch('');
                                }}
                                className="appearance-none bg-transparent py-2 pl-4 pr-8 text-sm font-medium text-foreground focus:outline-none cursor-pointer"
                            >
                                <option value="city">City</option>
                                <option value="title">Title</option>
                                <option value="address">Address</option>
                                <option value="description">Description</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        </div>

                        {/* Search input */}
                        <div className="flex flex-1 items-center px-4 py-2">
                            <Search className="mr-3 h-5 w-5 shrink-0 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={placeholderMap[searchField]}
                                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="ml-2 shrink-0 text-muted-foreground hover:text-foreground text-lg leading-none"
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter buttons */}
                    <div className="ml-auto flex items-center gap-2">
                        <button className="flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                            <Home className="h-4 w-4" />
                            Property type
                        </button>
                        <button className="flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                            <Tag className="h-4 w-4" />
                            Price
                        </button>
                        <button className="hidden items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors sm:flex">
                            <SlidersHorizontal className="h-4 w-4" />
                            More filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 sm:py-8">
                {/* Breadcrumb */}
                <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                    <span>Free State</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>University of the Free State</span>
                    <ChevronRight className="h-3 w-3" />
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-medium text-foreground">{city}</span>
                </nav>

                {/* Heading */}
                <h1 className={`${montserrat.className} text-2xl font-bold sm:text-3xl lg:text-4xl`}>
                    {search
                        ? `Results for "${search}" in ${searchField}`
                        : `Rooms to rent in ${city || 'Free State'}`}
                </h1>

                {/* Results bar */}
                <div className="mt-4 flex items-center justify-between border-b pb-4">
                    <p className="text-sm text-muted-foreground">
                        {loading ? (
                            'Loading results…'
                        ) : (
                            <>
                                <span className="font-semibold text-foreground">
                                    1-{sortedListings.length}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-foreground">
                                    {sortedListings.length}
                                </span>{' '}
                                results
                            </>
                        )}
                    </p>

                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Sort by</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="appearance-none rounded-lg border bg-background py-1.5 pl-3 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="default">Default</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </label>
                </div>

                {/* States: loading / error / empty */}
                {loading && (
                    <div className="mt-6 space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
                        ))}
                    </div>
                )}

                {!loading && isError && (
                    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                        Couldn&apos;t load listings.{' '}
                        {error && 'status' in error ? `(${(error as any).status})` : ''}
                    </div>
                )}

                {!loading && !isError && sortedListings.length === 0 && (
                    <div className="mt-8 rounded-xl border bg-background p-10 text-center text-muted-foreground">
                        No listings found{search ? ` for "${search}"` : ` in ${city}`}. Try widening your search.
                    </div>
                )}

                {/* Listings */}
                {!loading && !isError && sortedListings.length > 0 && (
                    <div className="mt-6 space-y-4">
                        {sortedListings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                saved={savedIds.has(listing.id)}
                                onToggleSaved={() => toggleSaved(listing.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    
}

              // ---------------------------------------------------------------------------
// Listing Card
// ---------------------------------------------------------------------------

function ListingCard({
    listing,
    saved,
    onToggleSaved,
}: {
    listing: ListingDto;
    saved: boolean;
    onToggleSaved: () => void;
}) {
    const beds = bedroomLabel(listing.availableBeds);
    const imageUrl = listing.image?.imageUrl;

    return (
        <Link
            href={`/listings/${listing.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md sm:flex-row"
        >
            {/* Image */}
            <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-72">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={listing.title || `Property in ${listing.city}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 288px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Home className="h-10 w-10 opacity-40" />
                    </div>
                )}

                {isNewListing(listing.createdAt) && (
                    <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                        New
                    </span>
                )}

                <span className="absolute bottom-3 left-3 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
                    {availabilityLabel(listing.availableFrom)}
                </span>
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-lg font-bold sm:text-xl">
                            R {formatRent(listing.monthlyRent)}
                            <span className="text-sm font-normal text-muted-foreground"> per month</span>
                        </p>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onToggleSaved();
                            }}
                            aria-label={saved ? 'Remove from saved' : 'Save listing'}
                            className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Heart className={`h-5 w-5 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
                        </button>
                    </div>

                    <p className="mt-1 text-sm font-medium">
                        {beds} · {listing.title}
                    </p>

                    <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        {listing.city}
                    </p>

                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <BedDouble className="h-4 w-4" /> {listing.availableBeds}
                        </span>
                    </div>

                    {listing.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {listing.description}
                        </p>
                    )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-muted-foreground">
                        {listing.landlordName ?? 'Verified Landlord'}
                    </span>
                </div>
            </div>
        </Link>
    );
}