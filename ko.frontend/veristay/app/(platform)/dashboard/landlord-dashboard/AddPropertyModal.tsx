'use client';

import { useState } from 'react';
import { X, AlertCircle, Loader2, Plus } from 'lucide-react';
import { useAddPropertyMutation } from '@/app/errors/listingsApi';

interface AddPropertyForm {
    title: string; description: string; address: string; city: string;
    monthlyRent: string; availableBeds: string; amenities: string; availableFrom: string;
}

const emptyForm: AddPropertyForm = {
    title: '', description: '', address: '', city: '',
    monthlyRent: '', availableBeds: '', amenities: '', availableFrom: '',
};

export function AddPropertyModal({
    landlordId, onClose, onSuccess,
}: {
    landlordId: string; onClose: () => void; onSuccess: (id: number) => void;
}) {
    const [form, setForm]           = useState<AddPropertyForm>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [addProperty, { isLoading: isSubmitting, error: mutationError }] = useAddPropertyMutation();

    function update<K extends keyof AddPropertyForm>(key: K, value: AddPropertyForm[K]) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    const apiError = mutationError
        ? (mutationError as any)?.data?.message ?? 'Something went wrong.'
        : null;
    const error = formError ?? apiError;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);

        if (!form.title.trim() || !form.address.trim() || !form.city.trim()) {
            setFormError('Title, address, and city are required.');
            return;
        }

        const payload = {
            landlordId,
            title:         form.title.trim(),
            description:   form.description.trim(),
            address:       form.address.trim(),
            city:          form.city.trim(),
            monthlyRent:   Number(form.monthlyRent) || 0,
            availableBeds: Number(form.availableBeds) || 0,
            amenities:     form.amenities.split(',').map(a => a.trim()).filter(Boolean),
            availableFrom: form.availableFrom
                ? new Date(form.availableFrom).toISOString()
                : new Date().toISOString(),
        };

        try {
            const result = await addProperty(payload).unwrap();
            onSuccess(result.id);
        } catch {
            // surfaced via mutationError
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-2xl bg-background shadow-xl overflow-hidden my-auto">
                <div className="bg-blue-600 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isSubmitting}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Add Property</h2>
                    <p className="text-sm text-blue-100 mt-0.5">List a new property for students to apply to.</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
                        <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
                            placeholder="e.g. Sunny 2-bed near campus"
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
                            placeholder="Describe the property..."
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Address <span className="text-destructive">*</span></label>
                            <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
                                placeholder="Street address"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium">City <span className="text-destructive">*</span></label>
                            <input type="text" value={form.city} onChange={e => update('city', e.target.value)}
                                placeholder="City"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Monthly Rent (R)</label>
                            <input type="number" min={0} value={form.monthlyRent}
                                onChange={e => update('monthlyRent', e.target.value)}
                                placeholder="e.g. 3500"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Available Beds</label>
                            <input type="number" min={1} max={20} value={form.availableBeds}
                                onChange={e => update('availableBeds', e.target.value)}
                                placeholder="e.g. 2"
                                className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Amenities</label>
                        <input type="text" value={form.amenities} onChange={e => update('amenities', e.target.value)}
                            placeholder="Comma-separated e.g. WiFi, Parking, Water"
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                        <p className="mt-1 text-xs text-muted-foreground">Separate each amenity with a comma.</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Available From</label>
                        <input type="date" value={form.availableFrom}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => update('availableFrom', e.target.value)}
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>

                    <div className="pt-2 space-y-3">
                        <button type="submit" disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create Property
                        </button>
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
