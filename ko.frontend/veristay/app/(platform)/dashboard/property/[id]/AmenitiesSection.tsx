import { useState } from 'react';
import { CheckCircle, Plus, X } from 'lucide-react';
import { Section } from './Section';
import { inputClass, PRESET_AMENITIES } from './utils';

export function AmenitiesSection({
    amenities,
    onToggle,
    onAdd,
    onRemove,
}: {
    amenities: string[];
    onToggle:  (label: string) => void;
    onAdd:     (label: string) => void;
    onRemove:  (label: string) => void;
}) {
    const [customAmenity, setCustomAmenity] = useState('');

    function addCustomAmenity() {
        const trimmed = customAmenity.trim();
        if (!trimmed || amenities.includes(trimmed)) return;
        onAdd(trimmed);
        setCustomAmenity('');
    }

    return (
        <Section title="Amenities" icon={CheckCircle}>
            <div className="flex flex-wrap gap-2 mb-4">
                {PRESET_AMENITIES.map(({ label, icon: Icon }) => {
                    const selected = amenities.includes(label);
                    return (
                        <button
                            key={label}
                            type="button"
                            onClick={() => onToggle(label)}
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

            {amenities.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">
                        Selected ({amenities.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {amenities.map((a) => (
                            <span
                                key={a}
                                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-800"
                            >
                                {a}
                                <button
                                    type="button"
                                    onClick={() => onRemove(a)}
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
    );
}
