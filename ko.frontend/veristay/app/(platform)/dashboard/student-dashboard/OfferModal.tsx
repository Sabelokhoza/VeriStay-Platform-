'use client';

import { useState } from 'react';
import {
    X, CheckCircle, CreditCard, ThumbsUp, ThumbsDown, Loader2, MapPin,
} from 'lucide-react';
import { ApplicationDto } from '@/app/errors/listingsApi';
import { formatRent } from './utils';

export function OfferModal({
    app,
    onAccept,
    onDecline,
    onClose,
    isLoading,
}: {
    app: ApplicationDto;
    onAccept: () => void;
    onDecline: () => void;
    onClose: () => void;
    isLoading: boolean;
}) {
    const [confirming, setConfirming] = useState<'accept' | 'decline' | null>(null);

    function handleAccept() {
        setConfirming('accept');
        onAccept();
    }

    function handleDecline() {
        setConfirming('decline');
        onDecline();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                <div className="bg-green-600 px-6 py-5 text-white">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-green-100 font-medium uppercase tracking-wide">
                                Application Approved
                            </p>
                            <h2 className="text-lg font-bold">You Have an Offer! 🎉</h2>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Property</p>
                    <p className="font-semibold text-foreground">
                        {app.propertyTitle !== 'string' ? app.propertyTitle : 'Property'}
                    </p>
                    {app.propertyLocation && app.propertyLocation !== 'string - string' && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                            {app.propertyLocation}
                        </p>
                    )}
                    {app.landlordName && app.landlordName !== 'string' && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Landlord:{' '}
                            <span className="font-medium text-foreground">{app.landlordName}</span>
                        </p>
                    )}
                    <div className="mt-3 inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5">
                        <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-bold text-blue-700">
                            R {formatRent(app.price)} / month
                        </span>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Congratulations! Your application has been approved by the landlord. Please
                        review the offer and let them know your decision.
                    </p>

                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-xs text-yellow-800 mb-4">
                        <p className="font-semibold mb-1">⏰ Please respond promptly</p>
                        <p>
                            Landlords may offer your spot to another student if you don't respond
                            within a reasonable time. Accepting the offer confirms your intention to
                            move in.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleAccept}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && confirming === 'accept' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ThumbsUp className="h-4 w-4" />
                            )}
                            Accept Offer
                        </button>

                        <button
                            onClick={handleDecline}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && confirming === 'decline' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ThumbsDown className="h-4 w-4" />
                            )}
                            Decline Offer
                        </button>

                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                        >
                            Decide later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
