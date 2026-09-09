import Link from 'next/link';
import { X, CheckCircle, XCircle } from 'lucide-react';

export function OfferResultModal({
    type,
    onClose,
}: {
    type: 'accepted' | 'declined';
    onClose: () => void;
}) {
    const isAccepted = type === 'accepted';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-background p-8 shadow-xl text-center">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex justify-center mb-4">
                    <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${isAccepted ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                        {isAccepted ? (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : (
                            <XCircle className="h-8 w-8 text-red-600" />
                        )}
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-2">
                    {isAccepted ? 'Offer Accepted! 🏠' : 'Offer Declined'}
                </h2>

                <p className="text-sm text-muted-foreground mb-6">
                    {isAccepted
                        ? 'Great! You have accepted the offer. The landlord will be in touch with next steps for your move-in.'
                        : 'You have declined this offer. You can continue browsing other available properties.'}
                </p>

                <div className="flex flex-col gap-3">
                    {isAccepted ? (
                        <Link
                            href="/dashboard"
                            onClick={onClose}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors text-center"
                        >
                            Go to My Tenancy
                        </Link>
                    ) : (
                        <Link
                            href="/listing"
                            onClick={onClose}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors text-center"
                        >
                            Browse Properties
                        </Link>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
