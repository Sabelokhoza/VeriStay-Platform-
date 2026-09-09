import { CheckCircle } from 'lucide-react';
import { formatRent } from './utils';

export function PaymentSuccessScreen({
    amount,
    cardLast4,
    onClose,
}: {
    amount:    number;
    cardLast4: string;
    onClose:   () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-bounce">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
                <p className="text-xl font-bold text-green-800">Payment Successful!</p>
                <p className="text-sm text-muted-foreground mt-1">Your rent has been paid</p>
            </div>
            <div className="w-full rounded-xl bg-green-50 border border-green-200 p-4 text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-bold text-green-700">R {formatRent(amount)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Card</span>
                    <span className="font-mono font-medium">•••• •••• •••• {cardLast4}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                        {new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-green-700">✓ Confirmed</span>
                </div>
            </div>
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-2 text-xs text-yellow-800 w-full">
                ⚠️ This is a simulated payment for demonstration purposes only.
            </div>
            <button
                onClick={onClose}
                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors"
            >
                Done
            </button>
        </div>
    );
}
