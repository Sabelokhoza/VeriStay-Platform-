'use client';

import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { CardDetails, PaymentStep, formatRent } from './utils';
import { ProcessingScreen } from './ProcessingScreen';
import { PaymentSuccessScreen } from './PaymentSuccessScreen';
import { PaymentForm } from './PaymentForm';

export function CreditCardPaymentModal({
    amount,
    propertyTitle,
    dueDate,
    onClose,
    onSuccess,
}: {
    amount:        number;
    propertyTitle: string;
    dueDate:       string;
    onClose:       () => void;
    onSuccess:     (cardLast4: string) => void;
}) {
    const [step, setStep] = useState<PaymentStep>('form');
    const [cardLast4, setCardLast4] = useState('');

    async function handlePay(card: CardDetails) {
        setStep('processing');
        await new Promise(r => setTimeout(r, 2500));

        const last4 = card.number.replace(/\s/g, '').slice(-4);
        setCardLast4(last4);
        setStep('success');
        onSuccess(last4);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 overflow-y-auto py-8">
            <div className="relative w-full max-w-md rounded-3xl bg-background shadow-2xl overflow-hidden my-auto">
                {step === 'form' && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 pt-6 pb-4 text-white">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-1">
                            <Lock className="h-4 w-4 text-blue-200" />
                            <span className="text-xs text-blue-200 font-medium">Secure Simulated Payment</span>
                        </div>
                        <h2 className="text-xl font-bold">Pay Rent</h2>
                        <p className="text-sm text-blue-100 mt-0.5 truncate">{propertyTitle}</p>
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-blue-200">Due: {dueDate}</p>
                            <p className="text-2xl font-black">R {formatRent(amount)}</p>
                        </div>
                    </div>
                )}

                <div className="px-6 py-5">
                    {step === 'processing' && <ProcessingScreen amount={amount} />}

                    {step === 'success' && (
                        <PaymentSuccessScreen
                            amount={amount}
                            cardLast4={cardLast4}
                            onClose={onClose}
                        />
                    )}

                    {step === 'form' && (
                        <PaymentForm amount={amount} onPay={handlePay} />
                    )}
                </div>
            </div>
        </div>
    );
}
