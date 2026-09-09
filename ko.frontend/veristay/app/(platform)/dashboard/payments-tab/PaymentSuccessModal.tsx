import { CheckCircle, X } from 'lucide-react';
import { RentPaymentDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate } from './utils';

export function PaymentSuccessModal({
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
