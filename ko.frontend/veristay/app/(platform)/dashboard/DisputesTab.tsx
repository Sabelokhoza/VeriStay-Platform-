// ── Disputes Tab ──────────────────────────────────────────────────────

import { DisputeDto, useGetDisputesQuery, useResolveDisputeMutation } from "@/app/errors/listingsApi";
import { AlertTriangle,ChevronRight, CheckCircle,Home, Clock,Users, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";


function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export default function DisputesTab() {
    const [selected,    setSelected]    = useState<DisputeDto | null>(null);
    const [resolution,  setResolution]  = useState('');
    const [adminNotes,  setAdminNotes]  = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const { data: disputes = [], refetch } = useGetDisputesQuery();
    const [resolveDispute] = useResolveDisputeMutation();

    const statusLabel = (s: number) => ['Open', 'Under Review', 'Resolved', 'Closed'][s] ?? 'Unknown';
    const statusStyle = (s: number) => [
        'bg-red-100 text-red-800 border-red-200',
        'bg-yellow-100 text-yellow-800 border-yellow-200',
        'bg-green-100 text-green-800 border-green-200',
        'bg-gray-100 text-gray-700 border-gray-200',
    ][s] ?? 'bg-gray-100 text-gray-700 border-gray-200';

    async function handleResolve(status: number) {
        if (!selected) return;
        setActionLoading(true);
        try {
            await resolveDispute({
                disputeId:  selected.id,
                resolution: resolution.trim(),
                adminNotes: adminNotes.trim(),
                status,
            }).unwrap();
            toast.success('Dispute updated successfully');
            setSelected(null);
            setResolution('');
            setAdminNotes('');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.Message ?? 'Failed to update dispute');
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Tenant / Landlord Disputes ({disputes.length})
                    </h2>
                    <div className="flex gap-2">
                        {[0,1,2,3].map(s => (
                            <span key={s} className={`text-xs px-2 py-1 rounded-full border font-semibold ${statusStyle(s)}`}>
                                {disputes.filter(d => d.status === s).length} {statusLabel(s)}
                            </span>
                        ))}
                    </div>
                </div>

                {disputes.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <AlertTriangle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground">No disputes filed.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {disputes.map(d => (
                            <div key={d.id}
                                onClick={() => { setSelected(d); setResolution(d.resolution); setAdminNotes(d.adminNotes); }}
                                className="rounded-xl border bg-background p-4 shadow-sm cursor-pointer hover:shadow-md transition-all">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{d.title}</p>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyle(d.status)}`}>
                                                {statusLabel(d.status)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {d.description}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                Student: <strong className="ml-1">{d.studentName}</strong>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Home className="h-3 w-3" />
                                                Landlord: <strong className="ml-1">{d.landlordName}</strong>
                                            </span>
                                            {d.propertyTitle && (
                                                <span>Property: <strong>{d.propertyTitle}</strong></span>
                                            )}
                                            <span>{formatDate(d.createdAt)}</span>
                                        </div>
                                        {d.resolution && (
                                            <div className="mt-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs text-green-800">
                                                <strong>Resolution:</strong> {d.resolution}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resolve modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
                    <div className="relative w-full max-w-lg rounded-2xl bg-background shadow-xl overflow-hidden my-auto">
                        <div className="bg-red-600 px-6 py-5 text-white">
                            <button onClick={() => setSelected(null)} disabled={actionLoading}
                                className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="text-lg font-bold">Manage Dispute</h2>
                            <p className="text-sm text-red-100 mt-0.5 truncate">{selected.title}</p>
                        </div>

                        <div className="px-6 py-4 border-b bg-muted/30 space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Student</p>
                                    <p className="font-medium">{selected.studentName}</p>
                                    <p className="text-xs text-muted-foreground">{selected.studentEmail}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Landlord</p>
                                    <p className="font-medium">{selected.landlordName}</p>
                                    <p className="text-xs text-muted-foreground">{selected.landlordEmail}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Description</p>
                                <p className="text-sm">{selected.description}</p>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="text-sm font-semibold">Resolution</label>
                                <textarea rows={3} value={resolution}
                                    onChange={e => setResolution(e.target.value)}
                                    placeholder="Describe the resolution..."
                                    className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold">Admin Notes (internal)</label>
                                <textarea rows={2} value={adminNotes}
                                    onChange={e => setAdminNotes(e.target.value)}
                                    placeholder="Internal notes..."
                                    className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleResolve(1)} disabled={actionLoading}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50">
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                                    Mark Under Review
                                </button>
                                <button onClick={() => handleResolve(2)} disabled={actionLoading}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                    Mark Resolved
                                </button>
                            </div>
                            <button onClick={() => handleResolve(3)} disabled={actionLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50">
                                Close Dispute
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}