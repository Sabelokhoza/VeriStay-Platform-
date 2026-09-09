import { Tag, BedDouble, Calendar } from 'lucide-react';
import { Section } from './Section';
import { formatRent, inputClass, labelClass } from './utils';

export function PricingSection({
    monthlyRent,
    availableBeds,
    availableFrom,
    today,
    onChange,
}: {
    monthlyRent:   string;
    availableBeds: string;
    availableFrom: string;
    today:         string;
    onChange:      (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <Section title="Pricing & Availability" icon={Tag}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                    <label className={labelClass}>Monthly Rent (ZAR)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R</span>
                        <input
                            name="monthlyRent"
                            type="number"
                            min="0"
                            step="50"
                            value={monthlyRent}
                            onChange={onChange}
                            placeholder="0"
                            className={`${inputClass} pl-7`}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className={labelClass}>Bedrooms</label>
                    <div className="relative">
                        <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            name="availableBeds"
                            type="number"
                            min="1"
                            max="20"
                            value={availableBeds}
                            onChange={onChange}
                            placeholder="1"
                            className={`${inputClass} pl-9`}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className={labelClass}>Available From</label>
                    <div className="relative">
                        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            name="availableFrom"
                            type="date"
                            min={today}
                            value={availableFrom}
                            onChange={onChange}
                            className={`${inputClass} pl-9`}
                        />
                    </div>
                </div>
            </div>

            {Number(monthlyRent) > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
                    <Tag className="h-3.5 w-3.5 shrink-0" />
                    R {formatRent(Number(monthlyRent))} / month
                    {Number(availableBeds) > 0 && (
                        <span className="ml-1">
                            · {availableBeds} {Number(availableBeds) === 1 ? 'bedroom' : 'bedrooms'}
                            · R {formatRent(Math.round(Number(monthlyRent) / Number(availableBeds)))} per room
                        </span>
                    )}
                </div>
            )}
        </Section>
    );
}
