'use client';

import { useState } from 'react';
import {
    CreditCard, CheckCircle, Clock, AlertCircle,
    Loader2, X, Download, FileText, Calendar,
    TrendingUp, Home, MapPin,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
    useGetStudentPaymentSummaryQuery,
    useMarkRentPaidMutation,
    RentPaymentDto,
    useLazyDownloadReceiptQuery,
    useGetReceiptUrlMutation,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import { CreditCardPaymentModal } from './CreditCardPaymentModal';

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

function getPaymentStatus(status: number) {
    switch (status) {
        case 0: return { label: 'Pending', style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock        };
        case 1: return { label: 'Paid',    style: 'bg-green-100  text-green-800  border-green-200',  icon: CheckCircle  };
        case 2: return { label: 'Overdue', style: 'bg-red-100    text-red-800    border-red-200',    icon: AlertCircle  };
        default: return { label: 'Unknown', style: 'bg-gray-100  text-gray-700   border-gray-200',   icon: AlertCircle  };
    }
}

function isPlaceholder(v: string | null | undefined) {
    if (!v) return true;
    return v.trim().toLowerCase() === 'string' || v.trim() === '';
}

// =============================================
// Confirm Pay Modal
// =============================================

function ConfirmPayModal({
    payment,
    onConfirm,
    onClose,
    isLoading,
}: {
    payment:   RentPaymentDto;
    onConfirm: () => void;
    onClose:   () => void;
    isLoading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Confirm Payment</h2>
                    <p className="text-sm text-blue-100 mt-0.5">Simulated rent payment</p>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Property</span>
                        <span className="font-medium text-right max-w-[200px] truncate">
                            {isPlaceholder(payment.propertyTitle) ? `Property #${payment.tenancyId}` : payment.propertyTitle}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date</span>
                        <span className="font-medium">{formatDate(payment.dueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="text-lg font-bold text-blue-600">R {formatRent(payment.amount)}</span>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800 mb-4">
                        <p className="font-semibold mb-0.5">⚠️ Simulated Payment</p>
                        <p>This is a simulated payment for tracking purposes only.
                        No real money will be processed.</p>
                    </div>

                    <button onClick={onConfirm} disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                            : <><CreditCard className="h-4 w-4" /> Confirm Payment — R {formatRent(payment.amount)}</>
                        }
                    </button>
                    <button onClick={onClose} disabled={isLoading}
                        className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Payment Success Modal
// =============================================

function PaymentSuccessModal({
    payment,
    onClose,
}: {
    payment: RentPaymentDto;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-background p-8 shadow-xl text-center">
                <button onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Payment Confirmed! 🎉</h2>
                <p className="text-sm text-muted-foreground mb-2">
                    Your payment of
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                    R {formatRent(payment.amount)}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                    has been recorded successfully.
                </p>
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-xs text-green-800 mb-5 text-left">
                    <p className="font-semibold mb-1">Payment Details</p>
                    <div className="space-y-1">
                        <p>Date: {formatDate(new Date().toISOString())}</p>
                        <p>Amount: R {formatRent(payment.amount)}</p>
                        <p>Status: Paid ✓</p>
                    </div>
                </div>
                <button onClick={onClose}
                    className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                    Done
                </button>
            </div>
        </div>
    );
}

// =============================================
// Updated PaymentCard
// =============================================

function PaymentCard({
    payment,
    onPay,
}: {
    payment: RentPaymentDto;
    onPay:   (payment: RentPaymentDto) => void;
}) {
    const [getReceiptUrl, { isLoading: isDownloading }] = useGetReceiptUrlMutation();

    const statusInfo = getPaymentStatus(payment.status);
    const StatusIcon = statusInfo.icon;
    const isPending  = payment.status === 0;
    const isOverdue  = payment.status === 2;
    const isPaid     = payment.status === 1;

    async function handleDownloadReceipt() {
    console.log('Receipt button clicked for payment:', payment.id); // 👈 add this
    
    try {
        console.log('Calling getReceiptUrl...'); 
        const result = await getReceiptUrl(payment.id).unwrap();
        console.log('Receipt result:', result); 

        if (result) {
            if (result.startsWith('http')) {
                window.open(result, '_blank', 'noopener,noreferrer');
            } else {
                toast.info(`Receipt Reference: ${result}`);
            }
        }
    } catch (err: any) {
        console.error('Receipt error:', err); 
        const msg =
            err?.data?.Message ??
            err?.data?.message ??
            'Failed to get receipt. Please try again.';
        toast.error(msg);
    }
}

    return (
        <div className={`rounded-xl border bg-background p-4 shadow-sm transition-all ${
            isOverdue ? 'border-red-200 bg-red-50/30' : ''
        }`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2.5 shrink-0 ${
                        isPaid    ? 'bg-green-50'  :
                        isOverdue ? 'bg-red-50'    :
                        'bg-yellow-50'
                    }`}>
                        <CreditCard className={`h-5 w-5 ${
                            isPaid    ? 'text-green-600' :
                            isOverdue ? 'text-red-600'   :
                            'text-yellow-600'
                        }`} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">
                            Due {formatDate(payment.dueDate)}
                        </p>
                        {isPaid && payment.paidAt && (
                            <p className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                                <CheckCircle className="h-3 w-3" />
                                Paid on {formatDate(payment.paidAt)}
                            </p>
                        )}
                        {isOverdue && (
                            <p className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
                                <AlertCircle className="h-3 w-3" />
                                Payment overdue
                            </p>
                        )}
                        {isPending && (
                            <p className="flex items-center gap-1 text-xs text-yellow-600 mt-0.5">
                                <Clock className="h-3 w-3" />
                                Payment pending
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    <p className="text-lg font-bold">R {formatRent(payment.amount)}</p>

                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.style}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                    </span>

                    {(isPending || isOverdue) && (
                        <button
                            onClick={() => onPay(payment)}
                            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors ${
                                isOverdue
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            Pay Now
                        </button>
                    )}

                    {isPaid && (
                        <button
                            onClick={handleDownloadReceipt}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Download className="h-3.5 w-3.5" />
                            }
                            {isDownloading ? 'Loading...' : 'Receipt'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
// =============================================
// Payments Tab Skeleton
// =============================================

function PaymentsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 w-40 rounded bg-muted" />
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="h-32 rounded-xl bg-muted" />
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-muted" />
                ))}
            </div>
        </div>
    );
}

// =============================================
// Main PaymentsTab
// =============================================

export function PaymentsTab({ studentId }: { studentId: string }) {
   const [selectedPayment, setSelectedPayment] = useState<RentPaymentDto | null>(null);
const [paidPayment,     setPaidPayment]     = useState<RentPaymentDto | null>(null);
const [paidCardLast4,   setPaidCardLast4]   = useState('');


    const {
        data:      summary,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetStudentPaymentSummaryQuery(studentId, { skip: !studentId });

    const [markRentPaid, { isLoading: isPaying }] = useMarkRentPaidMutation();

   async function handleCardSuccess(cardLast4: string) {
    if (!selectedPayment) return;
    try {
        const response = await markRentPaid({
            rentPaymentId: selectedPayment.id,
            receiptUrl:    '',
        });
        if ('data' in response && response.data?.success) {
            setPaidPayment(selectedPayment);
            setPaidCardLast4(cardLast4);
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

    const payments  = summary.payments ?? [];
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

                {/* Property info */}
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

                {/* Stats */}
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

                {/* Financial summary */}
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

                    {/* Progress bar */}
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

                {/* Overdue alert */}
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

                {/* Payments list */}
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


