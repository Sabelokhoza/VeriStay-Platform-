import { MapPin } from 'lucide-react';
import { Section } from './Section';
import { inputClass, labelClass, SOUTH_AFRICAN_CITIES } from './utils';

export function LocationSection({
    address,
    city,
    onChange,
    onCitySelect,
}: {
    address:      string;
    city:         string;
    onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCitySelect: (city: string) => void;
}) {
    return (
        <Section title="Location" icon={MapPin}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className={labelClass}>
                        Street Address <span className="text-destructive">*</span>
                    </label>
                    <input
                        name="address"
                        type="text"
                        value={address}
                        onChange={onChange}
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
                        value={SOUTH_AFRICAN_CITIES.includes(city) ? city : ''}
                        onChange={(e) => onCitySelect(e.target.value)}
                        className={`${inputClass} appearance-none`}
                    >
                        <option value="">Select city...</option>
                        {SOUTH_AFRICAN_CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {city && !SOUTH_AFRICAN_CITIES.includes(city) && (
                        <p className="text-xs text-muted-foreground">
                            Current: <strong>{city}</strong>
                        </p>
                    )}
                    <input
                        name="city"
                        type="text"
                        value={city}
                        onChange={onChange}
                        placeholder="Or type your city..."
                        className={`${inputClass} mt-2`}
                    />
                </div>
            </div>
        </Section>
    );
}
