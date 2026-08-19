import { LandlordPropertyDto, useAddAnnouncementMutation } from "@/app/errors/listingsApi";
import { AlertCircle, Loader2, Megaphone, X } from "lucide-react";
import { useState } from "react";




export default function AddAnnouncementModal({
    landlordId,
    properties,
    onClose,
    onSuccess,
}: {
    landlordId: string;
    properties: LandlordPropertyDto[];
    onClose:    () => void;
    onSuccess:  () => void;
}) {
    const [message,    setMessage]    = useState('');
    const [propertyId, setPropertyId] = useState<number | ''>('');
    const [error,      setError]      = useState<string | null>(null);
    const [addAnnouncement, { isLoading }] = useAddAnnouncementMutation();

   async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
        setError('Message is required.');
        return;
    }
    if (!propertyId) {
        setError('Please select a property.');
        return;
    }

    try {
        await addAnnouncement({
            landlordId,             
            propertyId: Number(propertyId), 
            message:    message.trim(),     
        }).unwrap();
        onSuccess();
    } catch (err: any) {
        setError(err?.data?.message ?? 'Failed to post announcement.');
    }
}
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">

                <div className="bg-purple-600 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5" />
                        <h2 className="text-lg font-bold">New Announcement</h2>
                    </div>
                    <p className="text-sm text-purple-100 mt-0.5">
                        Post a message to all tenants of a property
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {error && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Property selector */}
                    <div>
                        <label className="text-sm font-medium">
                            Property <span className="text-destructive">*</span>
                        </label>
                        <select
                            value={propertyId}
                            onChange={e => setPropertyId(e.target.value === '' ? '' : Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="">Select a property…</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-sm font-medium">
                            Message <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="e.g. Water will be off on Saturday from 8am–12pm for maintenance…"
                            maxLength={500}
                            className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                        />
                        <p className={`text-right text-xs mt-0.5 ${message.length > 450 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            {message.length}/500
                        </p>
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors disabled:opacity-50">
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting…</>
                            : <><Megaphone className="h-4 w-4" /> Post Announcement</>
                        }
                    </button>

                    <button type="button" onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
