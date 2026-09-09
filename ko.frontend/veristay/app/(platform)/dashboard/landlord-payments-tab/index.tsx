'use client';

import { useState } from 'react';
import { CreditCard, AlertCircle, TrendingUp, Clock, Users } from 'lucide-react';
import { useGetLandlordPaymentsOverviewQuery, LandlordPaymentSummaryDto } from '@/app/errors/listingsApi';
import { formatRent } from './utils';
import { SendReminderModal } from './SendReminderModal';
import { TenantPaymentRow } from './TenantPaymentRow';
import { PaymentsSkeleton } from './PaymentsSkeleton';
import ReputationSection from './ReputationSection';

export default ReputationSection;

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

    const summaries  = overview.tenancySummaries ?? [];
    const hasOverdue = summaries.some(s => s.overdueCount > 0);

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
