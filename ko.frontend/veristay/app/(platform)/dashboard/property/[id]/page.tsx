'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Loader2, AlertCircle, Eye } from 'lucide-react';
import {
    useGetPropertyInfoQuery,
    useUpdatePropertyMutation,
} from '@/app/errors/listingsApi';
import { formatRent, safeBeds, isPlaceholder, getPropertyStatusLabel } from './utils';
import { PropertyDetailsSection } from './PropertyDetailsSection';
import { LocationSection } from './LocationSection';
import { PricingSection } from './PricingSection';
import { AmenitiesSection } from './AmenitiesSection';
import { ImageManager } from './ImageManager';

export default function PropertyManagePage() {
    const router  = useRouter();
    const params = useParams();

    const propertyId = Number(params.id);

    const {
        data: property,
        isLoading,
        isError,
        refetch,
    } = useGetPropertyInfoQuery(propertyId, {
        skip: isNaN(propertyId),
    });

    const [updateProperty, { isLoading: isSaving }] = useUpdatePropertyMutation();

    const [form, setForm] = useState({
        title:         '',
        description:   '',
        address:       '',
        city:          '',
        monthlyRent:   '',
        availableBeds: '',
        availableFrom: '',
        isAvailable:   true,
        amenities:     [] as string[],
    });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (!property) return;
        setForm({
            title:         isPlaceholder(property.title)       ? '' : property.title,
            description:   isPlaceholder(property.description) ? '' : property.description,
            address:       isPlaceholder(property.address)     ? '' : property.address,
            city:          isPlaceholder(property.city)        ? '' : property.city,
            monthlyRent:   property.monthlyRent > 0 ? String(property.monthlyRent) : '',
            availableBeds: safeBeds(property.availableBeds),
            availableFrom: property.availableFrom
                ? new Date(property.availableFrom).toISOString().split('T')[0]
                : '',
            isAvailable:   property.isAvailable,
            amenities:     property.amenities.filter(a => !isPlaceholder(a)),
        });
        setIsDirty(false);
    }, [property]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setForm(prev => ({ ...prev, [name]: val }));
        setIsDirty(true);
    }

    function setCity(city: string) {
        setForm(prev => ({ ...prev, city }));
        setIsDirty(true);
    }

    function toggleAmenity(label: string) {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(label)
                ? prev.amenities.filter(a => a !== label)
                : [...prev.amenities, label],
        }));
        setIsDirty(true);
    }

    function addAmenity(label: string) {
        setForm(prev => ({ ...prev, amenities: [...prev.amenities, label] }));
        setIsDirty(true);
    }

    function removeAmenity(a: string) {
        setForm(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== a) }));
        setIsDirty(true);
    }

    async function handleSave() {
        if (!property) return;

        if (!form.title.trim() || !form.address.trim() || !form.city.trim()) {
            toast.error('Title, address, and city are required.');
            return;
        }

        try {
            await updateProperty({
                id:            property.id,
                landlordId:    property.landlordId,
                title:         form.title.trim(),
                description:   form.description.trim(),
                address:       form.address.trim(),
                city:          form.city.trim(),
                monthlyRent:   Number(form.monthlyRent) || 0,
                availableBeds: Number(form.availableBeds) || 0,
                amenities:     form.amenities,
                availableFrom: form.availableFrom
                    ? new Date(form.availableFrom).toISOString()
                    : new Date().toISOString(),
                isAvailable:   form.isAvailable,
            }).unwrap();

            toast.success('Property updated successfully!');
            setIsDirty(false);
            refetch();
        } catch (err: any) {
            const msg = err?.data?.Message ?? err?.data?.message ?? 'Failed to update property.';
            toast.error(msg);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-muted/30">
                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="container mx-auto max-w-4xl px-4 py-8 space-y-4">
                    <div className="h-64 animate-pulse rounded-xl bg-muted" />
                    <div className="h-48 animate-pulse rounded-xl bg-muted" />
                    <div className="h-32 animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        );
    }

    if (isError || !property) {
        return (
            <div className="min-h-screen w-full bg-muted/30 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <AlertCircle className="h-10 w-10 mx-auto text-red-500" />
                    <p className="font-medium">Failed to load property</p>
                    <button
                        onClick={() => router.back()}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const statusInfo = getPropertyStatusLabel(property.status);
    const StatusIcon = statusInfo.icon;
    const today      = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen w-full bg-muted/30 pb-16">

            <div className="sticky top-0 z-20 border-b bg-background px-4 py-3 sm:px-8 shadow-sm">
                <div className="container mx-auto max-w-4xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => router.back()}
                            className="shrink-0 rounded-lg border p-2 hover:bg-muted transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">Managing Property</p>
                            <h1 className="font-bold truncate">
                                {isPlaceholder(property.title) ? `Property #${property.id}` : property.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </span>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !isDirty}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Save className="h-4 w-4" />
                            }
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {isDirty && (
                <div className="border-b bg-yellow-50 px-4 py-2.5 sm:px-8">
                    <div className="container mx-auto max-w-4xl flex items-center gap-2 text-sm text-yellow-800">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        You have unsaved changes. Click <strong className="mx-1">Save Changes</strong> to apply them.
                    </div>
                </div>
            )}

            <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-8 space-y-6">

                <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.style}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                    </span>

                    <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                            form.isAvailable
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                    >
                        {form.isAvailable ? '✓ Available' : '✗ Not Available'}
                    </span>

                    {property.monthlyRent > 0 && (
                        <span className="text-sm font-bold text-blue-600">
                            R {formatRent(property.monthlyRent)} / month
                        </span>
                    )}

                    <a
                        href={`/listings/${property.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Preview Listing
                    </a>
                </div>

                <PropertyDetailsSection
                    title={form.title}
                    description={form.description}
                    isAvailable={form.isAvailable}
                    onChange={handleChange}
                />

                <LocationSection
                    address={form.address}
                    city={form.city}
                    onChange={handleChange}
                    onCitySelect={setCity}
                />

                <PricingSection
                    monthlyRent={form.monthlyRent}
                    availableBeds={form.availableBeds}
                    availableFrom={form.availableFrom}
                    today={today}
                    onChange={handleChange}
                />

                <AmenitiesSection
                    amenities={form.amenities}
                    onToggle={toggleAmenity}
                    onAdd={addAmenity}
                    onRemove={removeAmenity}
                />

                <ImageManager propertyId={property.id} />

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !isDirty}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                            : <><Save className="h-4 w-4" /> Save Changes</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
