import { CreditCard } from 'lucide-react';
import { formatRent } from './utils';

export function ProcessingScreen({ amount }: { amount: number }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <CreditCard className="absolute inset-0 m-auto h-8 w-8 text-blue-600" />
            </div>
            <p className="text-lg font-bold">Processing Payment...</p>
            <p className="text-sm text-muted-foreground">
                R {formatRent(amount)}
            </p>
            <p className="text-xs text-muted-foreground">Please do not close this window</p>
        </div>
    );
}
