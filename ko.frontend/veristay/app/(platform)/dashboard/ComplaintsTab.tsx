import { ComplaintDto, useGetComplaintsQuery, useNotifyComplaintMutation, useUpdateComplaintStatusMutation } from "@/app/errors/listingsApi";
import { Bell,  X,CheckCircle, Clock, Eye, Flag, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export default function ComplaintsTab() {
    const [selected,      setSelected]     = useState<ComplaintDto | null>(null);
    const [adminNotes,    setAdminNotes]   = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const { data: complaints = [], refetch } = useGetComplaintsQuery();
    const [updateStatus] = useUpdateComplaintStatusMutation();
    const [notify]       = useNotifyComplaintMutation();

    const typeLabel = (t: number) =>
        ['Vacancy', 'Property Condition', 'Landlord Behaviour', 'Other'][t] ?? 'Unknown';

    const statusLabel = (s: number) =>
        ['Open', 'Under Review', 'Resolved', 'Dismissed'][s] ?? 'Unknown';

    const statusStyle = (s: number) => [
        'bg-red-100 text-red-800 border-red-200',
        'bg-yellow-100 text-yellow-800 border-yellow-200',
        'bg-green-100 text-green-800 border-green-200',
        'bg-gray-100 text-gray-700 border-gray-200',
    ][s] ?? 'bg-gray-100 text-gray-700 border-gray-200';

    const typeStyle = (t: number) => [
        'bg-blue-100 text-blue-800 border-blue-200',
        'bg-orange-100 text-orange-800 border-orange-200',
        'bg-red-100 text-red-800 border-red-200',
        'bg-gray-100 text-gray-700 border-gray-200',
    ][t] ?? 'bg-gray-100 text-gray-700 border-gray-200';

    async function handleUpdateStatus(status: number) {
        if (!selected) return;
        setActionLoading(true);
        try {
            await updateStatus({ id: selected.id, status, adminNotes }).unwrap();
            toast.success('Complaint status updated');
            setSelected(null);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.Message ?? 'Failed to update complaint');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleNotify(id: number) {
        try {
            await notify(id).unwrap();
            toast.success('Notification sent to landlord');
            refetch();
        } catch {
            toast.error('Failed to send notification');
        }
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Complaints ({complaints.length})
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        {complaints.filter(c => !c.isNotified && c.landlordId).length} pending notification
                    </span>
                </div>

                {complaints.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <Flag className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground">No complaints filed.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {complaints.map(c => (
                            <div key={c.id}
                                className="rounded-xl border bg-background p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{c.title}</p>
                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${typeStyle(c.type)}`}>
                                                {typeLabel(c.type)}
                                            </span>
                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyle(c.status)}`}>
                                                {statusLabel(c.status)}
                                            </span>
                                            {!c.isNotified && c.landlordId && (
                                                <span className="rounded-full bg-orange-100 border border-orange-200 px-2 py-0.5 text-xs font-semibold text-orange-800">
                                                    Not Notified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {c.description}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span>By: <strong>{c.submittedByName}</strong></span>
                                            {c.landlordName && <span>Against: <strong>{c.landlordName}</strong></span>}
                                            {c.propertyTitle && <span>Property: <strong>{c.propertyTitle}</strong></span>}
                                            <span>{formatDate(c.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => { setSelected(c); setAdminNotes(c.adminNotes); }}
                                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                                            <Eye className="h-3.5 w-3.5" /> Review
                                        </button>
                                        {!c.isNotified && c.landlordId && (
                                            <button
                                                onClick={() => handleNotify(c.id)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600">
                                                <Bell className="h-3.5 w-3.5" /> Notify
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                        <div className="bg-orange-500 px-6 py-5 text-white">
                            <button onClick={() => setSelected(null)}
                                className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="text-lg font-bold">Review Complaint</h2>
                            <p className="text-sm text-orange-100 mt-0.5 truncate">{selected.title}</p>
                        </div>
                        <div className="px-6 py-4 border-b bg-muted/30 space-y-2 text-sm">
                            <p><strong>By:</strong> {selected.submittedByName}</p>
                            {selected.landlordName && <p><strong>Against:</strong> {selected.landlordName}</p>}
                            <p><strong>Type:</strong> {typeLabel(selected.type)}</p>
                            <p className="text-muted-foreground">{selected.description}</p>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="text-sm font-semibold">Admin Notes</label>
                                <textarea rows={3} value={adminNotes}
                                    onChange={e => setAdminNotes(e.target.value)}
                                    placeholder="Notes on this complaint..."
                                    className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleUpdateStatus(1)} disabled={actionLoading}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-3 py-2.5 text-xs font-semibold text-white hover:bg-yellow-600 disabled:opacity-50">
                                    {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />}
                                    Under Review
                                </button>
                                <button onClick={() => handleUpdateStatus(2)} disabled={actionLoading}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                                    {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                    Resolved
                                </button>
                                <button onClick={() => handleUpdateStatus(3)} disabled={actionLoading}
                                    className="col-span-2 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50">
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}