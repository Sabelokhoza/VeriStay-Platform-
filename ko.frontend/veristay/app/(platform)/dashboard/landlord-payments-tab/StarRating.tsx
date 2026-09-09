import { Star } from 'lucide-react';

export function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`h-4 w-4 shrink-0 ${
                    star <= Math.round(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                }`} />
            ))}
        </div>
    );
}
