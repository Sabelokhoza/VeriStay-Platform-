'use client';

import { useState } from 'react';
import {
    CreditCard, CheckCircle, Clock, AlertCircle,
    ChevronDown, ChevronUp, Bell, MapPin,
} from 'lucide-react';
import { LandlordPaymentSummaryDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, isPlaceholder, getPaymentStatus } from './utils';

export function TenantPaymentRow({
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

            {expanded && (
                <div className="border-t bg-muted/20 px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Payment History
                    </p>
                    {summary.payments.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">No payment records yet.</p>
                    ) : (
                        [...summary.payments]
                            .sort((a, b) => {
                                const order = [2, 0, 1];
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
