import { CreditCard, Loader2, X } from 'lucide-react';
import { RentPaymentDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, isPlaceholder } from './utils';

export function ConfirmPayModal({
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
