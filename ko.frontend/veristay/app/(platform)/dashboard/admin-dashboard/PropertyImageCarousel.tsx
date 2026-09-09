'use client';

import { useState } from 'react';
import { Home, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { ListingImageDto } from '@/app/errors/listingsApi';

export function PropertyImageCarousel({ images, propertyTitle }: { images: ListingImageDto[]; propertyTitle?: string }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex h-36 w-full flex-col items-center justify-center bg-muted/30 text-muted-foreground border-b">
                <Home className="h-8 w-8 mb-1.5 opacity-30" />
                <p className="text-xs">No images uploaded yet</p>
            </div>
        );
    }

    const current = images[currentImageIndex] ?? images[0];

    function prevImage(e: React.MouseEvent) {
        e.stopPropagation();
        setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1));
    }

    function nextImage(e: React.MouseEvent) {
        e.stopPropagation();
        setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1));
    }

    return (
        <div>
            <div className="relative h-52 w-full bg-muted overflow-hidden">
                {current?.imageUrl ? (
                    <img
                        src={current.imageUrl}
                        alt={`${propertyTitle ?? 'Property'} — photo ${currentImageIndex + 1}`}
                        className="h-full w-full object-cover transition-all duration-300"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Home className="h-8 w-8 opacity-30" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </>
                )}

                {images.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={e => { e.stopPropagation(); setCurrentImageIndex(i); }}
                                className={`rounded-full transition-all ${
                                    i === currentImageIndex
                                        ? 'h-2 w-4 bg-white'
                                        : 'h-2 w-2 bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {images.length > 1
                        ? `${currentImageIndex + 1} / ${images.length}`
                        : `${images.length} photo`}
                </div>

                {current?.isPrimary && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-blue-600/80 px-2.5 py-1 text-xs font-semibold text-white">
                        ⭐ Main
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto bg-muted/30 px-4 py-2 scrollbar-hide">
                    {images.slice(0, 6).map((img, i) => (
                        <button
                            key={img.id}
                            onClick={e => { e.stopPropagation(); setCurrentImageIndex(i); }}
                            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                i === currentImageIndex
                                    ? 'border-blue-500 opacity-100 shadow-sm'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={img.imageUrl}
                                alt={`Photo ${i + 1}`}
                                className="h-full w-full object-cover"
                            />
                            {img.isPrimary && (
                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/70 text-center text-[9px] font-bold text-white py-0.5">
                                    MAIN
                                </div>
                            )}
                        </button>
                    ))}
                    {images.length > 6 && (
                        <button
                            onClick={e => { e.stopPropagation(); setCurrentImageIndex(6); }}
                            className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground border hover:bg-muted/80 transition-colors"
                        >
                            +{images.length - 6} more
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
