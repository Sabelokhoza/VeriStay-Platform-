import { useState } from 'react';
import { AlertTriangle, CheckCircle, Flag, Loader2, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import {
    useGetLandlordComplaintsQuery,
    useGetLandlordDisputesQuery,
    useRespondToComplaintMutation,
    useRespondToDisputeMutation,
} from '@/app/errors/listingsApi';
import { formatDate } from './utils';

const disputeStatusLabels   = ['Open', 'Under Review', 'Resolved', 'Closed'];
const complaintStatusLabels = ['Open', 'Under Review', 'Resolved', 'Dismissed'];
const complaintTypeLabels   = ['Vacancy', 'Property Condition', 'Landlord Behaviour', 'Other'];

const statusStyles = [
    'bg-red-100 text-red-800 border-red-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-gray-100 text-gray-700 border-gray-200',
];

interface IssueItem {
    id:                  number;
    kind:                'dispute' | 'complaint';
    title:               string;
    description:         string;
    status:              number;
    statusLabel:         string;
    typeLabel?:          string;
    raisedBy:            string;
    propertyTitle:       string;
    createdAt:           string;
    landlordResponse:    string;
    landlordRespondedAt: string | null;
    adminOutcome:        string;
    adminOutcomeLabel:   string;
}

export function DisputesComplaintsTab({ landlordId }: { landlordId: string }) {
    const [view, setView] = useState<'disputes' | 'complaints'>('disputes');

    const { data: disputes = [],   isLoading: disputesLoading }   =
        useGetLandlordDisputesQuery(landlordId, { skip: !landlordId });
    const { data: complaints = [], isLoading: complaintsLoading } =
        useGetLandlordComplaintsQuery(landlordId, { skip: !landlordId });

    if (disputesLoading || complaintsLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                <div className="h-8 w-48 rounded bg-muted" />
                <div className="h-28 rounded-xl bg-muted" />
                <div className="h-28 rounded-xl bg-muted" />
            </div>
        );
    }

    const disputeItems: IssueItem[] = disputes.map(d => ({
        id:                  d.id,
        kind:                'dispute',
        title:               d.title,
        description:         d.description,
        status:              d.status,
        statusLabel:         disputeStatusLabels[d.status] ?? 'Unknown',
        raisedBy:            d.studentName,
        propertyTitle:       d.propertyTitle,
        createdAt:           d.createdAt,
        landlordResponse:    d.landlordResponse,
        landlordRespondedAt: d.landlordRespondedAt,
        adminOutcome:        d.resolution,
        adminOutcomeLabel:   'Admin Resolution',
    }));

    const complaintItems: IssueItem[] = complaints.map(c => ({
        id:                  c.id,
        kind:                'complaint',
        title:               c.title,
        description:         c.description,
        status:              c.status,
        statusLabel:         complaintStatusLabels[c.status] ?? 'Unknown',
        typeLabel:           complaintTypeLabels[c.type],
        raisedBy:            c.submittedByName,
        propertyTitle:       c.propertyTitle,
        createdAt:           c.createdAt,
        landlordResponse:    c.landlordResponse,
        landlordRespondedAt: c.landlordRespondedAt,
        adminOutcome:        c.adminNotes,
        adminOutcomeLabel:   'Admin Notes',
    }));

    const items = view === 'disputes' ? disputeItems : complaintItems;
    const awaitingDisputes   = disputeItems.filter(needsResponse).length;
    const awaitingComplaints = complaintItems.filter(needsResponse).length;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Disputes &amp; Complaints</h2>
                <div className="inline-flex rounded-lg border bg-background p-1">
                    <ViewButton active={view === 'disputes'} onClick={() => setView('disputes')}
                        icon={AlertTriangle} label={`Disputes (${disputeItems.length})`} badge={awaitingDisputes} />
                    <ViewButton active={view === 'complaints'} onClick={() => setView('complaints')}
                        icon={Flag} label={`Complaints (${complaintItems.length})`} badge={awaitingComplaints} />
                </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                    These were raised by tenants about your properties. Your response is shared with
                    the tenant and the VeriStay admin team, who will use it when resolving the matter.
                </p>
            </div>

            {items.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No {view} have been raised against your properties.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map(item => (
                        <IssueCard key={`${item.kind}-${item.id}`} item={item} landlordId={landlordId} />
                    ))}
                </div>
            )}
        </div>
    );
}

function needsResponse(item: IssueItem) {
    return !item.landlordResponse && item.status < 2;
}

function ViewButton({ active, onClick, icon: Icon, label, badge }: {
    active:  boolean;
    onClick: () => void;
    icon:    typeof Flag;
    label:   string;
    badge:   number;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors
                ${active ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
        >
            <Icon className="h-4 w-4" />
            {label}
            {badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {badge}
                </span>
            )}
        </button>
    );
}

function IssueCard({ item, landlordId }: { item: IssueItem; landlordId: string }) {
    const [isReplying, setIsReplying] = useState(false);
    const [response,   setResponse]   = useState(item.landlordResponse ?? '');
    const [error,      setError]      = useState<string | null>(null);

    const [respondToDispute,   { isLoading: disputeSending }]   = useRespondToDisputeMutation();
    const [respondToComplaint, { isLoading: complaintSending }] = useRespondToComplaintMutation();
    const isSending = disputeSending || complaintSending;
    const isClosed  = item.status >= 2;

    async function handleSend() {
        setError(null);
        if (!response.trim()) {
            setError('Please write a response first.');
            return;
        }
        const payload = { id: item.id, landlordId, response: response.trim() };
        try {
            if (item.kind === 'dispute') await respondToDispute(payload).unwrap();
            else                         await respondToComplaint(payload).unwrap();
            setIsReplying(false);
        } catch (err: any) {
            setError(err?.data?.message ?? err?.data?.Message ?? 'Failed to send response.');
        }
    }

    return (
        <div className="rounded-xl border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{item.title}</p>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.status] ?? statusStyles[3]}`}>
                            {item.statusLabel}
                        </span>
                        {item.typeLabel && (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {item.typeLabel}
                            </span>
                        )}
                        {needsResponse(item) && (
                            <span className="inline-flex items-center rounded-full bg-orange-100 border border-orange-200 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
                                Awaiting your response
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Raised by: <strong>{item.raisedBy}</strong></span>
                        {item.propertyTitle && <span>Property: <strong>{item.propertyTitle}</strong></span>}
                        <span>{formatDate(item.createdAt)}</span>
                    </div>
                </div>
            </div>

            {item.landlordResponse && !isReplying && (
                <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-900">
                    <p className="font-semibold mb-0.5">Your response · {formatDate(item.landlordRespondedAt)}</p>
                    <p className="whitespace-pre-line">{item.landlordResponse}</p>
                </div>
            )}

            {item.adminOutcome && (
                <div className="mt-3 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs text-green-800">
                    <p className="font-semibold mb-0.5 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> {item.adminOutcomeLabel}
                    </p>
                    <p className="whitespace-pre-line">{item.adminOutcome}</p>
                </div>
            )}

            {isReplying ? (
                <div className="mt-3 space-y-2">
                    <textarea
                        rows={3}
                        value={response}
                        onChange={e => setResponse(e.target.value)}
                        maxLength={1000}
                        placeholder="Explain what happened and how you will resolve it…"
                        disabled={isSending}
                        className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                    {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => { setIsReplying(false); setError(null); setResponse(item.landlordResponse ?? ''); }}
                            disabled={isSending}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={isSending}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Send to tenant &amp; admin
                        </button>
                    </div>
                </div>
            ) : !isClosed && (
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={() => setIsReplying(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                    >
                        <MessageSquare className="h-4 w-4" />
                        {item.landlordResponse ? 'Edit response' : 'Respond'}
                    </button>
                </div>
            )}
        </div>
    );
}
