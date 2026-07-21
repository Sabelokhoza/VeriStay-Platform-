// components/landlord/PropertyManagePage.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
    Home,
    MapPin,
    Tag,
    BedDouble,
    Calendar,
    Save,
    ArrowLeft,
    Upload,
    X,
    Star,
    Trash2,
    Loader2,
    CheckCircle,
    AlertCircle,
    Plus,
    Eye,
    Clock,
    Wifi,
    Car,
    Zap,
    Droplets,
    Shield,
    Utensils,
    Tv,
    Wind,
    Package,
    ImageIcon,
} from 'lucide-react';
import {
    useGetPropertyInfoQuery,
    useUpdatePropertyMutation,
    useAddPropertyImageMutation,
    useDeletePropertyImageMutation,
    useSetPrimaryImageMutation,
    useGetImagesByPropertyIdQuery,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';

// =============================================
// Helpers
// =============================================

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function safeBeds(count: number) {
    if (!Number.isFinite(count) || count > 100 || count <= 0) return '';
    return String(count);
}

function isPlaceholder(value: string | null | undefined) {
    if (!value) return true;
    const v = value.trim().toLowerCase();
    return v === 'n/a' || v === 'none' || v === 'unknown' || v === 'tbd' || v === 'tba';
}

function getPropertyStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Pending Approval', style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
        case 1: return { label: 'Approved',          style: 'bg-green-100  text-green-800  border-green-200', icon: CheckCircle };
        case 2: return { label: 'Rejected',          style: 'bg-red-100    text-red-800    border-red-200',   icon: AlertCircle };
        case 3: return { label: 'Delisted',          style: 'bg-gray-100   text-gray-700   border-gray-200', icon: X };
        default: return { label: 'Unknown',          style: 'bg-gray-100   text-gray-700   border-gray-200', icon: AlertCircle };
    }
}

const PRESET_AMENITIES = [
    { label: 'WiFi',             icon: Wifi      },
    { label: 'Parking',          icon: Car       },
    { label: 'Electricity',      icon: Zap       },
    { label: 'Water',            icon: Droplets  },
    { label: 'Security',         icon: Shield    },
    { label: 'Kitchen',          icon: Utensils  },
    { label: 'DSTV',             icon: Tv        },
    { label: 'Air Conditioning', icon: Wind      },
    { label: 'Furnished',        icon: Package   },
];

const SOUTH_AFRICAN_CITIES = [
    'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth',
    'Bloemfontein', 'East London', 'Stellenbosch', 'Bellville',
    'Rondebosch', 'Mowbray', 'Observatory', 'Claremont',
    'Sandton', 'Centurion', 'Potchefstroom', 'George',
];

const inputClass =
    'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

const labelClass = 'text-sm font-medium text-foreground';

// =============================================
// Section wrapper
// =============================================

function Section({
    title,
    icon: Icon,
    children,
}: {
    title:    string;
    icon:     React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                <Icon className="h-4 w-4 text-blue-600" />
                {title}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

// =============================================
// Image Manager
// =============================================

function ImageManager({ propertyId }: { propertyId: number }) {
    const fileRef = useRef<HTMLInputElement>(null);

    const {
        data: images = [],
        isLoading: imagesLoading,
        refetch: refetchImages,
    } = useGetImagesByPropertyIdQuery(propertyId);

    const [addImage,       { isLoading: isAdding    }] = useAddPropertyImageMutation();
    const [deleteImage,    { isLoading: isDeleting  }] = useDeletePropertyImageMutation();
    const [setPrimary,     { isLoading: isSettingPrimary }] = useSetPrimaryImageMutation();
    const [deletingId,     setDeletingId]   = useState<number | null>(null);
    const [primaryId,      setPrimaryId]    = useState<number | null>(null);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) {
            toast.error('Only JPG, PNG or WEBP images are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5MB');
            return;
        }

        try {
            await addImage({
                propertyId,
                image: file,
                isPrimary: images.length === 0,
            }).unwrap();
            toast.success('Image uploaded successfully');
            refetchImages();
            if (fileRef.current) fileRef.current.value = '';
        } catch (err: any) {
            toast.error(err?.data?.message ?? 'Failed to upload image');
        }
    }

    async function handleDelete(imageId: number) {
        setDeletingId(imageId);
        try {
            await deleteImage(imageId).unwrap();
            toast.success('Image removed');
            refetchImages();
        } catch {
            toast.error('Failed to remove image');
        } finally {
            setDeletingId(null);
        }
    }

    async function handleSetPrimary(imageId: number) {
        setPrimaryId(imageId);
        try {
            await setPrimary(imageId).unwrap();
            toast.success('Primary image updated');
            refetchImages();
        } catch {
            toast.error('Failed to set primary image');
        } finally {
            setPrimaryId(null);
        }
    }

    const busy = isAdding || isDeleting || isSettingPrimary;

    return (
        <Section title="Property Images" icon={ImageIcon}>
            {/* Upload zone */}
            <div className="mb-5">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={busy}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/30 px-4 py-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isAdding ? (
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                            <Upload className="h-6 w-6 text-blue-600" />
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium">
                            {isAdding ? 'Uploading...' : 'Click to upload image'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            JPG, PNG or WEBP · Max 5MB
                        </p>
                    </div>
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={busy}
                />
            </div>

            {/* Image grid */}
            {imagesLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="aspect-video animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            ) : images.length === 0 ? (
                <div className="rounded-xl border bg-muted/30 py-10 text-center">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">No images yet.</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Upload images to help students find your property.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                                img.isPrimary
                                    ? 'border-blue-500 shadow-md'
                                    : 'border-transparent hover:border-muted-foreground/30'
                            }`}
                        >
                            {/* Image */}
                            <div className="relative aspect-video bg-muted">
                                <Image
                                    src={img.imageUrl}
                                    alt="Property image"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                />
                            </div>

                            {/* Primary badge */}
                            {img.isPrimary && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                                    <Star className="h-2.5 w-2.5 fill-white" /> Primary
                                </div>
                            )}

                            {/* Actions overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!img.isPrimary && (
                                    <button
                                        onClick={() => handleSetPrimary(img.id)}
                                        disabled={busy}
                                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {primaryId === img.id
                                            ? <Loader2 className="h-3 w-3 animate-spin" />
                                            : <Star className="h-3 w-3" />
                                        }
                                        Set Primary
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    disabled={busy}
                                    className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deletingId === img.id
                                        ? <Loader2 className="h-3 w-3 animate-spin" />
                                        : <Trash2 className="h-3 w-3" />
                                    }
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground text-center">
                    Hover over an image to set it as primary or remove it.
                    The primary image is shown first in search results.
                </p>
            )}
        </Section>
    );
}

// =============================================
// Main Page
// =============================================

export default function PropertyManagePage({ propertyId }: { propertyId: number }) {
    const router  = useRouter();
    const userId  = useAppSelector((state: any) => state.userAuthStore?.id ?? '');

   const params = useParams();

    const p = Number(params.id);

    console.log("Property ID:", p);

    const {
        data: property,
        isLoading,
        isError,
        refetch,
    } = useGetPropertyInfoQuery(p, {
        skip: isNaN(p),
    });

    const [updateProperty, { isLoading: isSaving }] = useUpdatePropertyMutation();

    // ── Form state ────────────────────────────────────────────────────────
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
    const [customAmenity, setCustomAmenity] = useState('');
    const [isDirty, setIsDirty]             = useState(false);

    // Sync form with API data
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

    function toggleAmenity(label: string) {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(label)
                ? prev.amenities.filter(a => a !== label)
                : [...prev.amenities, label],
        }));
        setIsDirty(true);
    }

    function addCustomAmenity() {
        const trimmed = customAmenity.trim();
        if (!trimmed || form.amenities.includes(trimmed)) return;
        setForm(prev => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
        setCustomAmenity('');
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

    // ── Loading ───────────────────────────────────────────────────────────
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

            {/* ── Header ──────────────────────────────────────────────── */}
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

            {/* ── Unsaved changes banner ──────────────────────────────── */}
            {isDirty && (
                <div className="border-b bg-yellow-50 px-4 py-2.5 sm:px-8">
                    <div className="container mx-auto max-w-4xl flex items-center gap-2 text-sm text-yellow-800">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        You have unsaved changes. Click <strong className="mx-1">Save Changes</strong> to apply them.
                    </div>
                </div>
            )}

            <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-8 space-y-6">

                {/* ── Status + quick info ─────────────────────────────── */}
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
                {/* ── Property Details ────────────────────────────────── */}
                <Section title="Property Details" icon={Home}>
                    <div className="space-y-4">

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                Title <span className="text-destructive">*</span>
                            </label>
                            <input
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Modern 2-Bedroom Apartment near Campus"
                                className={inputClass}
                                maxLength={120}
                            />
                            <p className="text-right text-xs text-muted-foreground">{form.title.length}/120</p>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your property..."
                                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                                maxLength={1000}
                            />
                            <p className="text-right text-xs text-muted-foreground">{form.description.length}/1000</p>
                        </div>

                        {/* Availability toggle */}
                        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium">Available for Applications</p>
                                <p className="text-xs text-muted-foreground">
                                    Toggle off to temporarily hide this listing from students.
                                </p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={form.isAvailable}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                    </div>
                </Section>

                {/* ── Location ────────────────────────────────────────── */}
                <Section title="Location" icon={MapPin}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                Street Address <span className="text-destructive">*</span>
                            </label>
                            <input
                                name="address"
                                type="text"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="e.g. 14 Main Road"
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                City <span className="text-destructive">*</span>
                            </label>
                            <select
                                name="city"
                                value={SOUTH_AFRICAN_CITIES.includes(form.city) ? form.city : ''}
                                onChange={(e) => {
                                    setForm(prev => ({ ...prev, city: e.target.value }));
                                    setIsDirty(true);
                                }}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="">Select city...</option>
                                {SOUTH_AFRICAN_CITIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            {/* Show manual city if not in list */}
                            {form.city && !SOUTH_AFRICAN_CITIES.includes(form.city) && (
                                <p className="text-xs text-muted-foreground">
                                    Current: <strong>{form.city}</strong>
                                </p>
                            )}
                            <input
                                name="city"
                                type="text"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="Or type your city..."
                                className={`${inputClass} mt-2`}
                            />
                        </div>
                    </div>
                </Section>

                {/* ── Pricing & Availability ──────────────────────────── */}
                <Section title="Pricing & Availability" icon={Tag}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Monthly Rent */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Monthly Rent (ZAR)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R</span>
                                <input
                                    name="monthlyRent"
                                    type="number"
                                    min="0"
                                    step="50"
                                    value={form.monthlyRent}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={`${inputClass} pl-7`}
                                />
                            </div>
                        </div>

                        {/* Bedrooms */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Bedrooms</label>
                            <div className="relative">
                                <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    name="availableBeds"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={form.availableBeds}
                                    onChange={handleChange}
                                    placeholder="1"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </div>

                        {/* Available From */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Available From</label>
                            <div className="relative">
                                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    name="availableFrom"
                                    type="date"
                                    min={today}
                                    value={form.availableFrom}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live rent preview */}
                    {Number(form.monthlyRent) > 0 && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
                            <Tag className="h-3.5 w-3.5 shrink-0" />
                            R {formatRent(Number(form.monthlyRent))} / month
                            {Number(form.availableBeds) > 0 && (
                                <span className="ml-1">
                                    · {form.availableBeds} {Number(form.availableBeds) === 1 ? 'bedroom' : 'bedrooms'}
                                    · R {formatRent(Math.round(Number(form.monthlyRent) / Number(form.availableBeds)))} per room
                                </span>
                            )}
                        </div>
                    )}
                </Section>

                {/* ── Amenities ───────────────────────────────────────── */}
                <Section title="Amenities" icon={CheckCircle}>

                    {/* Preset toggles */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {PRESET_AMENITIES.map(({ label, icon: Icon }) => {
                            const selected = form.amenities.includes(label);
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => toggleAmenity(label)}
                                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all
                                        ${selected
                                            ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                                            : 'border-input bg-background hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                    {selected && <CheckCircle className="h-3 w-3 ml-0.5" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Custom amenity */}
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">Add custom amenity</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customAmenity}
                                onChange={(e) => setCustomAmenity(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                                placeholder="e.g. Study room, Pool..."
                                className={`${inputClass} flex-1`}
                                maxLength={50}
                            />
                            <button
                                type="button"
                                onClick={addCustomAmenity}
                                disabled={!customAmenity.trim()}
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" /> Add
                            </button>
                        </div>
                    </div>

                    {/* Selected amenities */}
                    {form.amenities.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-2">
                                Selected ({form.amenities.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {form.amenities.map((a) => (
                                    <span
                                        key={a}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-800"
                                    >
                                        {a}
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(a)}
                                            className="rounded-full text-blue-600 hover:text-blue-800"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </Section>

                {/* ── Images ──────────────────────────────────────────── */}
                <ImageManager propertyId={property.id} />

                {/* ── Save button (bottom) ────────────────────────────── */}
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
    )
}