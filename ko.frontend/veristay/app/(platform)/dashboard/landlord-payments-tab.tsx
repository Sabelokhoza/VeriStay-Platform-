// =============================================
// components/dashboard/landlord-payments-tab.tsx
// =============================================

'use client';

import { useState } from 'react';
import {
    CreditCard, CheckCircle, Clock, AlertCircle,
    ChevronDown, ChevronUp, Bell, Loader2, X,
    TrendingUp, Home, MapPin, Star, MessageSquare,
    Send, Users,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    useGetLandlordPaymentsOverviewQuery,
    useSendPaymentReminderMutation,
    useGetLandlordDashboardQuery,
    LandlordPaymentSummaryDto,
    RentPaymentDto,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import { data } from '../(partner)/team/mock';

// =============================================
// Helpers
// =============================================

function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function isPlaceholder(v: string | null | undefined) {
    if (!v) return true;
    return v.trim().toLowerCase() === 'string' || v.trim() === '';
}

function getPaymentStatus(status: number) {
    switch (status) {
        case 0: return { label: 'Pending', style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock       };
        case 1: return { label: 'Paid',    style: 'bg-green-100  text-green-800  border-green-200', icon: CheckCircle };
        case 2: return { label: 'Overdue', style: 'bg-red-100    text-red-800    border-red-200',   icon: AlertCircle };
        default: return { label: 'Unknown', style: 'bg-gray-100  text-gray-700   border-gray-200',  icon: AlertCircle };
    }
}

// =============================================
// Send Reminder Modal
// =============================================

function SendReminderModal({
    summary,
    onClose,
}: {
    summary: LandlordPaymentSummaryDto;
    onClose: () => void;
}) {
    const [message, setMessage] = useState('');
    const [sendReminder, { isLoading }] = useSendPaymentReminderMutation();

    async function handleSend() {
        try {
            const studentEmail = ''; // pulled from dashboard data ideally
            await sendReminder({
                tenancyId:    summary.tenancyId,
                studentId:    summary.studentId,
                studentEmail: studentEmail,
                message:      message.trim(),
            }).unwrap();
            toast.success(`Reminder sent to ${summary.studentName}`);
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.Message ?? 'Failed to send reminder.');
        }
    }

    const overdueCount  = summary.payments.filter(p => p.status === 2).length;
    const pendingCount  = summary.payments.filter(p => p.status === 0).length;
    const totalOwed     = summary.totalOwed;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-orange-500 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Send Payment Reminder</h2>
                    <p className="text-sm text-orange-100 mt-0.5">{summary.studentName}</p>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Property</span>
                        <span className="font-medium text-right max-w-[220px] truncate">
                            {isPlaceholder(summary.propertyTitle)
                                ? `Tenancy #${summary.tenancyId}`
                                : summary.propertyTitle}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Outstanding</span>
                        <span className="font-bold text-red-600">R {formatRent(totalOwed)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Overdue</span>
                        <span className={`font-semibold ${overdueCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {overdueCount} payment{overdueCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-semibold text-yellow-600">
                            {pendingCount} payment{pendingCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold">
                            Personal Message
                            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            disabled={isLoading}
                            placeholder="Add a personal note to the reminder email..."
                            maxLength={500}
                            className="mt-1.5 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none disabled:opacity-50"
                        />
                        <p className="text-right text-xs text-muted-foreground mt-1">
                            {message.length}/500
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                        A reminder email will be sent to the student listing all overdue and
                        pending payments with a link to their dashboard to pay.
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                            : <><Send className="h-4 w-4" /> Send Reminder</>
                        }
                    </button>
                    <button onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Tenant Payment Row
// =============================================

function TenantPaymentRow({
    summary,
    onSendReminder,
}: {
    summary:         LandlordPaymentSummaryDto;
    onSendReminder:  (summary: LandlordPaymentSummaryDto) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    const hasOverdue  = summary.overdueCount > 0;
    const hasPending  = summary.pendingCount > 0;
    const progressPct = summary.totalPayments > 0
        ? Math.round((summary.paidCount / summary.totalPayments) * 100)
        : 0;

    return (
        <div className={`rounded-xl border bg-background shadow-sm overflow-hidden ${
            hasOverdue ? 'border-red-200' : ''
        }`}>
            {/* Summary row */}
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {summary.studentName?.charAt(0)?.toUpperCase() ?? 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold">{summary.studentName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                            {isPlaceholder(summary.propertyTitle)
                                ? `Tenancy #${summary.tenancyId}`
                                : summary.propertyTitle}
                        </p>
                        {!isPlaceholder(summary.propertyLocation) && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {summary.propertyLocation}
                            </p>
                        )}
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-blue-600">
                            R {formatRent(summary.monthlyRent)}/mo
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                            R {formatRent(summary.totalPaid)} collected
                        </p>
                        {summary.totalOwed > 0 && (
                            <p className="text-xs text-red-600 font-medium">
                                R {formatRent(summary.totalOwed)} owed
                            </p>
                        )}
                    </div>
                </div>

                {/* Payment status chips */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 border border-green-200 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        <CheckCircle className="h-3 w-3" /> {summary.paidCount} paid
                    </span>
                    {hasPending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 border border-yellow-200 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                            <Clock className="h-3 w-3" /> {summary.pendingCount} pending
                        </span>
                    )}
                    {hasOverdue && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            <AlertCircle className="h-3 w-3" /> {summary.overdueCount} overdue
                        </span>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        {(hasOverdue || hasPending) && (
                            <button
                                onClick={() => onSendReminder(summary)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                            >
                                <Bell className="h-3.5 w-3.5" />
                                Send Reminder
                            </button>
                        )}
                        <button
                            onClick={() => setExpanded(s => !s)}
                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                        >
                            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {expanded ? 'Hide' : 'History'}
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Payment progress</span>
                        <span>{progressPct}% paid</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full bg-green-600 transition-all"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Expanded payment history */}
            {expanded && (
                <div className="border-t bg-muted/20 px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Payment History
                    </p>
                    {summary.payments.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">No payment records yet.</p>
                    ) : (
                        // Overdue first, then pending, then paid
                        [...summary.payments]
                            .sort((a, b) => {
                                const order = [2, 0, 1]; // overdue, pending, paid
                                return order.indexOf(a.status) - order.indexOf(b.status);
                            })
                            .map(payment => {
                                const statusInfo = getPaymentStatus(payment.status);
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <div key={payment.id}
                                        className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className={`h-4 w-4 shrink-0 ${
                                                payment.status === 1 ? 'text-green-600' :
                                                payment.status === 2 ? 'text-red-600'   :
                                                'text-yellow-600'
                                            }`} />
                                            <div>
                                                <p className="text-xs font-semibold">
                                                    {new Date(payment.dueDate).toLocaleDateString('en-ZA', {
                                                        month: 'long', year: 'numeric',
                                                    })}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Due {formatDate(payment.dueDate)}
                                                    {payment.paidAt && ` · Paid ${formatDate(payment.paidAt)}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <p className="text-sm font-bold">R {formatRent(payment.amount)}</p>
                                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusInfo.style}`}>
                                                <StatusIcon className="h-2.5 w-2.5" />
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>
            )}
        </div>
    );
}

// =============================================
// Star Rating Display
// =============================================

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`h-4 w-4 shrink-0 ${
                    star <= Math.round(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                }`} />
            ))}
        </div>
    );
}

// =============================================
// Reputation Section
// =============================================

 export default function ReputationSection({ landlordId }: { landlordId: string }) {
    const { data } = useGetLandlordDashboardQuery(landlordId, { skip: !landlordId });

    const score = data?.score ?? 0;

    // Star breakdown (mock — replace with real review data when endpoint available)
    const breakdown = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: star === 5 ? 3 : star === 4 ? 1 : 0,
        pct:   star === 5 ? 75 : star === 4 ? 25 : 0,
    }));

    const totalReviews = breakdown.reduce((sum, b) => sum + b.count, 0);

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b px-5 py-4 font-semibold">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                Reputation Score
            </div>
            <div className="p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {/* Score */}
                    <div className="flex flex-col items-center justify-center shrink-0 sm:w-40">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 border-4 border-yellow-400">
                            <span className="text-3xl font-black text-yellow-600">
                                {score.toFixed(1)}
                            </span>
                        </div>
                        <StarRating rating={score} />
                        <p className="mt-1 text-xs text-muted-foreground">
                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                        </p>
                        <div className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            score >= 4 ? 'bg-green-100 text-green-800 border-green-200' :
                            score >= 3 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                        }`}>
                            {score >= 4.5 ? '⭐ Excellent' :
                             score >= 4   ? '✓ Very Good' :
                             score >= 3   ? 'Good'        :
                             score >= 2   ? 'Fair'        :
                             'Needs Improvement'}
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="flex-1 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Rating Breakdown
                        </p>
                        {breakdown.map(({ star, count, pct }) => (
                            <div key={star} className="flex items-center gap-2">
                                <span className="w-2 text-right text-xs text-muted-foreground">{star}</span>
                                <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-yellow-400 transition-all"
                                        style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-4 text-right text-xs text-muted-foreground">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {totalReviews === 0 && (
                    <div className="mt-4 rounded-lg bg-muted/30 border border-dashed py-6 text-center">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm text-muted-foreground">No reviews yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Students will leave reviews after their tenancy.
                        </p>
                    </div>
                )}

                {/* Tips */}
                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800 space-y-1">
                    <p className="font-semibold">💡 How to improve your score</p>
                    <ul className="space-y-0.5 list-disc list-inside">
                        <li>Respond to maintenance requests promptly</li>
                        <li>Keep the property in good condition</li>
                        <li>Communicate clearly with tenants</li>
                        <li>Send payment reminders politely and on time</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Payments Skeleton
// =============================================

function PaymentsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="h-48 rounded-xl bg-muted" />
            <div className="h-48 rounded-xl bg-muted" />
        </div>
    );
}

// =============================================
// Main LandlordPaymentsTab
// =============================================

export function LandlordPaymentsTab({ landlordId }: { landlordId: string }) {
    const [reminderTarget, setReminderTarget] =
        useState<LandlordPaymentSummaryDto | null>(null);

    const {
        data:      overview,
        isLoading,
        isError,
        refetch,
    } = useGetLandlordPaymentsOverviewQuery(landlordId, { skip: !landlordId });

    if (isLoading) return <PaymentsSkeleton />;


    
    if (isError || !overview) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Payments & Reputation</h2>
                <div className="rounded-xl border bg-background p-10 text-center">
                    <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm text-muted-foreground font-medium">
                        No payment data available.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Payment records will appear here once you have active tenants.
                    </p>
                </div>
              
            </div>
        );
    }

    const summaries    = overview.tenancySummaries ?? [];
    const hasOverdue   = summaries.some(s => s.overdueCount > 0);
    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Payments </h2>
                    {hasOverdue && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Overdue payments
                        </span>
                    )}
                </div>

                {/* Financial summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                        <div className="flex h-10 w-10 mx-auto mb-2 items-center justify-center rounded-lg bg-green-50">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-xs text-muted-foreground">Total Collected</p>
                        <p className="text-xl font-bold text-green-600">
                            R {formatRent(overview.totalCollected)}
                        </p>
                    </div>
                    <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                        <div className="flex h-10 w-10 mx-auto mb-2 items-center justify-center rounded-lg bg-yellow-50">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                        <p className="text-xl font-bold text-yellow-600">
                            R {formatRent(overview.totalOutstanding)}
                        </p>
                    </div>
                    <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                        <div className="flex h-10 w-10 mx-auto mb-2 items-center justify-center rounded-lg bg-red-50">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                        <p className="text-xl font-bold text-red-600">
                            R {formatRent(overview.totalOverdue)}
                        </p>
                    </div>
                </div>

                {/* Overdue alert */}
                {hasOverdue && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800">
                                {summaries.filter(s => s.overdueCount > 0).length}{' '}
                                tenant(s) have overdue payments
                            </p>
                            <p className="text-xs text-red-700 mt-0.5">
                                Send reminders to tenants with outstanding balances.
                            </p>
                        </div>
                    </div>
                )}

                {/* Tenant payment rows */}
                {summaries.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground font-medium">
                            No active tenants yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Tenant Payment History ({summaries.length})
                        </p>
                        {summaries.map(summary => (
                            <TenantPaymentRow
                                key={summary.tenancyId}
                                summary={summary}
                                onSendReminder={setReminderTarget}
                            />
                        ))}
                    </div>
                )}

               
            </div>

            {/* Reminder modal */}
            {reminderTarget && (
                <SendReminderModal
                    summary={reminderTarget}
                    onClose={() => {
                        setReminderTarget(null);
                        refetch();
                    }}
                />
            )}
        </>
    );
}