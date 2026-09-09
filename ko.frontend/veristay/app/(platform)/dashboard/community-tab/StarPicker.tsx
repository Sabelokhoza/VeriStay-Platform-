'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export function StarPicker({ value, onChange, disabled }: {
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
                        className="rounded transition-transform hover:scale-110 disabled:cursor-not-allowed"
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
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
                    (hovered || value) === 3 ? 'text-yellow-600' :
                    'text-red-600'
                }`}>
                    {labels[hovered || value]}
                </span>
            )}
        </div>
    );
}
