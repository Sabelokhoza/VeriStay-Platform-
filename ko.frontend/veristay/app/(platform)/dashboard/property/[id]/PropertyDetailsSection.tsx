import { Home } from 'lucide-react';
import { Section } from './Section';
import { inputClass, labelClass } from './utils';

export function PropertyDetailsSection({
    title,
    description,
    isAvailable,
    onChange,
}: {
    title:       string;
    description: string;
    isAvailable: boolean;
    onChange:    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
    return (
        <Section title="Property Details" icon={Home}>
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className={labelClass}>
                        Title <span className="text-destructive">*</span>
                    </label>
                    <input
                        name="title"
                        type="text"
                        value={title}
                        onChange={onChange}
                        placeholder="e.g. Modern 2-Bedroom Apartment near Campus"
                        className={inputClass}
                        maxLength={120}
                    />
                    <p className="text-right text-xs text-muted-foreground">{title.length}/120</p>
                </div>

                <div className="space-y-1.5">
                    <label className={labelClass}>Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={description}
                        onChange={onChange}
                        placeholder="Describe your property..."
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                        maxLength={1000}
                    />
                    <p className="text-right text-xs text-muted-foreground">{description.length}/1000</p>
                </div>

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
                            checked={isAvailable}
                            onChange={onChange}
                            className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
                    </label>
                </div>
            </div>
        </Section>
    );
}
