'use client';

import { CreditCard, CheckCircle, Clock, AlertCircle, Loader2, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { RentPaymentDto, useGetReceiptUrlMutation } from '@/app/errors/listingsApi';
import { formatRent, formatDate, getPaymentStatus } from './utils';

export function PaymentCard({
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
        try {
            const result = await getReceiptUrl(payment.id).unwrap();

            if (result) {
                if (result.startsWith('http')) {
                    window.open(result, '_blank', 'noopener,noreferrer');
                } else {
                    toast.info(`Receipt Reference: ${result}`);
                }
            }
        } catch (err: any) {
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
