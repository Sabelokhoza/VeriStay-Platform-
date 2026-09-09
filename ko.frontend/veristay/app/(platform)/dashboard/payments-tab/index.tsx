'use client';

import { useState } from 'react';
import { CreditCard, AlertCircle, FileText, Home, MapPin, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
    useGetStudentPaymentSummaryQuery,
    useMarkRentPaidMutation,
    RentPaymentDto,
} from '@/app/errors/listingsApi';
import { CreditCardPaymentModal } from '../CreditCardPaymentModal';
import { formatRent, isPlaceholder } from './utils';
import { PaymentCard } from './PaymentCard';
import { PaymentsSkeleton } from './PaymentsSkeleton';
import { PaymentSuccessModal } from './PaymentSuccessModal';

export function PaymentsTab({ studentId }: { studentId: string }) {
    const [selectedPayment, setSelectedPayment] = useState<RentPaymentDto | null>(null);
    const [paidPayment,     setPaidPayment]     = useState<RentPaymentDto | null>(null);

    const {
        data:      summary,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetStudentPaymentSummaryQuery(studentId, { skip: !studentId });

    const [markRentPaid] = useMarkRentPaidMutation();

    async function handleCardSuccess() {
        if (!selectedPayment) return;
        try {
            const response = await markRentPaid({
                rentPaymentId: selectedPayment.id,
                receiptUrl:    '',
            });
            if ('data' in response && response.data?.success) {
                setPaidPayment(selectedPayment);
                setSelectedPayment(null);
                refetch();
            } else if ('error' in response) {
                const err = response.error as any;
                toast.error(err?.data?.Message ?? 'Payment failed.');
            }
        } catch {
            toast.error('An unexpected error occurred.');
        }
    }

    if (isLoading || isFetching) return <PaymentsSkeleton />;

    if (isError || !summary) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Rent Payments</h2>
                <div className="rounded-xl border bg-background p-10 text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm font-medium text-muted-foreground">
                        No payment records found.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Payment records will appear here once your tenancy is active
                        and your landlord has added payments.
                    </p>
                    <Link href="/listings"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        Browse Properties
                    </Link>
                </div>
            </div>
        );
    }

    const payments   = summary.payments ?? [];
    const overduePay = payments.filter(p => p.status === 2);

    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Rent Payments</h2>
                    {overduePay.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {overduePay.length} overdue
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-background p-4">
                    <div className="rounded-lg bg-blue-50 p-2.5 shrink-0">
                        <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                            {isPlaceholder(summary.propertyTitle) ? `Tenancy #${summary.tenancyId}` : summary.propertyTitle}
                        </p>
                        {!isPlaceholder(summary.propertyLocation) && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {summary.propertyLocation}
                            </p>
                        )}
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-blue-600">R {formatRent(summary.monthlyRent)}</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border bg-background p-4 text-center shadow-sm">
                        <p className="text-xs text-muted-foreground">Total Payments</p>
                        <p className="text-2xl font-bold">{summary.totalPayments}</p>
                    </div>
                    <div className="rounded-xl border bg-green-50 border-green-200 p-4 text-center shadow-sm">
                        <p className="text-xs text-green-600">Paid</p>
                        <p className="text-2xl font-bold text-green-700">{summary.paidCount}</p>
                    </div>
                    <div className="rounded-xl border bg-yellow-50 border-yellow-200 p-4 text-center shadow-sm">
                        <p className="text-xs text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-700">{summary.pendingCount}</p>
                    </div>
                    <div className="rounded-xl border bg-red-50 border-red-200 p-4 text-center shadow-sm">
                        <p className="text-xs text-red-600">Overdue</p>
                        <p className="text-2xl font-bold text-red-700">{summary.overdueCount}</p>
                    </div>
                </div>

                <div className="rounded-xl border bg-background p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        Financial Summary
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                            <p className="text-xs text-green-600 font-medium">Total Paid</p>
                            <p className="text-xl font-bold text-green-700">R {formatRent(summary.totalPaid)}</p>
                        </div>
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                            <p className="text-xs text-red-600 font-medium">Total Owed</p>
                            <p className="text-xl font-bold text-red-700">R {formatRent(summary.totalOwed)}</p>
                        </div>
                    </div>

                    {summary.totalPaid + summary.totalOwed > 0 && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Payment progress</span>
                                <span>
                                    {Math.round((summary.totalPaid / (summary.totalPaid + summary.totalOwed)) * 100)}% paid
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-green-600 transition-all"
                                    style={{ width: `${Math.round((summary.totalPaid / (summary.totalPaid + summary.totalOwed)) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {overduePay.length > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                {overduePay.length} overdue {overduePay.length === 1 ? 'payment' : 'payments'}
                            </p>
                            <p className="text-xs text-red-700 mt-0.5">
                                Please settle overdue payments as soon as possible to avoid issues with your landlord.
                            </p>
                        </div>
                    </div>
                )}

                {payments.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">No payments yet</p>
                        <p className="text-xs mt-1">
                            Your landlord will add payment records here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payments.filter(p => p.status === 2).map(p => (
                            <PaymentCard key={p.id} payment={p} onPay={setSelectedPayment} />
                        ))}
                        {payments.filter(p => p.status === 0).map(p => (
                            <PaymentCard key={p.id} payment={p} onPay={setSelectedPayment} />
                        ))}
                        {payments.filter(p => p.status === 1).map(p => (
                            <PaymentCard key={p.id} payment={p} onPay={setSelectedPayment} />
                        ))}
                    </div>
                )}
            </div>

            {selectedPayment && (
                <CreditCardPaymentModal
                    amount={selectedPayment.amount}
                    propertyTitle={summary?.propertyTitle ?? 'Property'}
                    dueDate={new Date(selectedPayment.dueDate).toLocaleDateString('en-ZA', {
                        day: '2-digit', month: 'short', year: 'numeric',
                    })}
                    onClose={() => setSelectedPayment(null)}
                    onSuccess={handleCardSuccess}
                />
            )}

            {paidPayment && (
                <PaymentSuccessModal
                    payment={paidPayment}
                    onClose={() => setPaidPayment(null)}
                />
            )}
        </>
    );
}
