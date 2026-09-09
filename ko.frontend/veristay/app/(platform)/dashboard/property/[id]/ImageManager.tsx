'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Upload, Loader2, Star, Trash2, ImageIcon } from 'lucide-react';
import {
    useAddPropertyImageMutation,
    useDeletePropertyImageMutation,
    useSetPrimaryImageMutation,
    useGetImagesByPropertyIdQuery,
} from '@/app/errors/listingsApi';
import { Section } from './Section';

export function ImageManager({ propertyId }: { propertyId: number }) {
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
                            <div className="relative aspect-video bg-muted">
                                <Image
                                    src={img.imageUrl}
                                    alt="Property image"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                />
                            </div>

                            {img.isPrimary && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                                    <Star className="h-2.5 w-2.5 fill-white" /> Primary
                                </div>
                            )}

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
