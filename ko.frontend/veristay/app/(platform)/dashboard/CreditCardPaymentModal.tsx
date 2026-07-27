// =============================================
// Dummy Credit Card Payment Modal
// =============================================

'use client';

import { useState, useRef } from 'react';
import {
    CreditCard, Lock, CheckCircle, X, Loader2,
    Eye, EyeOff, AlertCircle,
} from 'lucide-react';

// =============================================
// Helpers
// =============================================

function formatCardNumber(value: string) {
    return value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

function formatCVC(value: string) {
    return value.replace(/\D/g, '').slice(0, 3);
}

function getCardType(number: string): 'visa' | 'mastercard' | 'amex' | null {
    const n = number.replace(/\s/g, '');
    if (n.startsWith('4'))                     return 'visa';
    if (n.startsWith('5') || n.startsWith('2')) return 'mastercard';
    if (n.startsWith('3'))                      return 'amex';
    return null;
}

function CardTypeIcon({ type }: { type: 'visa' | 'mastercard' | 'amex' | null }) {
    if (!type) return null;
    const styles = {
        visa:       'bg-blue-700  text-white  text-[10px] font-black italic',
        mastercard: 'bg-orange-500 text-white  text-[9px]  font-bold',
        amex:       'bg-blue-500  text-white  text-[9px]  font-bold',
    };
    const labels = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' };
    return (
        <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 ${styles[type]}`}>
            {labels[type]}
        </span>
    );
}

// =============================================
// Animated Card Preview
// =============================================

function CardPreview({
    number, name, expiry, flipped,
}: {
    number: string; name: string; expiry: string; flipped: boolean;
}) {
    const cardType = getCardType(number);
    const display  = number.padEnd(16, '·').replace(/(.{4})/g, '$1 ').trim();

    return (
        <div className="perspective-1000 h-44 w-full max-w-sm mx-auto mb-6">
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                {/* Front */}
                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 shadow-xl text-white"
                    style={{ backfaceVisibility: 'hidden' }}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-xs text-blue-200 font-medium">VeriStay Pay</span>
                            <span className="text-[10px] text-blue-300">Simulated Card</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {cardType
                                ? <CardTypeIcon type={cardType} />
                                : <div className="h-8 w-12 rounded bg-white/20" />
                            }
                        </div>
                    </div>

                    {/* Chip */}
                    <div className="mb-4 h-8 w-12 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-400/50" />

                    {/* Card number */}
                    <p className="font-mono text-lg tracking-widest mb-3 text-white/90">
                        {display}
                    </p>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[9px] text-blue-300 uppercase tracking-wide">Card Holder</p>
                            <p className="text-sm font-semibold uppercase tracking-wide truncate max-w-[160px]">
                                {name || 'YOUR NAME'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-blue-300 uppercase tracking-wide">Expires</p>
                            <p className="text-sm font-semibold">{expiry || 'MM/YY'}</p>
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl text-white"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="h-10 w-full bg-gray-800 mt-6 mb-4" />
                    <div className="px-5">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-10 bg-white/10 rounded-l" />
                            <div className="w-16 h-10 bg-white rounded flex items-center justify-center">
                                <p className="text-gray-800 font-mono font-bold text-sm">•••</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 text-center">
                            This is a simulated card for demo purposes only
                        </p>
                    </div>
                    <div className="absolute bottom-4 right-5">
                        {cardType && <CardTypeIcon type={cardType} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================
// Processing Animation
// =============================================

function ProcessingScreen({ amount }: { amount: number }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <CreditCard className="absolute inset-0 m-auto h-8 w-8 text-blue-600" />
            </div>
            <p className="text-lg font-bold">Processing Payment...</p>
            <p className="text-sm text-muted-foreground">
                R {new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount)}
            </p>
            <p className="text-xs text-muted-foreground">Please do not close this window</p>
        </div>
    );
}

// =============================================
// Payment Success Screen
// =============================================

function PaymentSuccessScreen({
    amount,
    cardLast4,
    onClose,
}: {
    amount:    number;
    cardLast4: string;
    onClose:   () => void;
}) {
    const formatRent = (n: number) =>
        new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(n);

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

// =============================================
// Main Credit Card Modal
// =============================================

interface CardDetails {
    number:  string;
    name:    string;
    expiry:  string;
    cvc:     string;
}

type PaymentStep = 'form' | 'processing' | 'success';

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
    const [step,    setStep]    = useState<PaymentStep>('form');
    const [flipped, setFlipped] = useState(false);
    const [showCvc, setShowCvc] = useState(false);
    const [errors,  setErrors]  = useState<Partial<CardDetails>>({});

    const [card, setCard] = useState<CardDetails>({
        number: '', name: '', expiry: '', cvc: '',
    });

    const cvcRef = useRef<HTMLInputElement>(null);

    const formatRent = (n: number) =>
        new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(n);

    function updateCard(field: keyof CardDetails, raw: string) {
        let value = raw;
        if (field === 'number') value = formatCardNumber(raw);
        if (field === 'expiry') value = formatExpiry(raw);
        if (field === 'cvc')    value = formatCVC(raw);
        setCard(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
        const errs: Partial<CardDetails> = {};
        const digits = card.number.replace(/\s/g, '');

        if (digits.length < 16)        errs.number = 'Enter a valid 16-digit card number';
        if (!card.name.trim())         errs.name   = 'Cardholder name is required';
        if (card.expiry.length < 5)    errs.expiry = 'Enter a valid expiry date (MM/YY)';
        else {
            const [mm, yy] = card.expiry.split('/').map(Number);
            const now      = new Date();
            const cardDate = new Date(2000 + yy, mm - 1);
            if (mm < 1 || mm > 12 || cardDate < now) errs.expiry = 'Card has expired';
        }
        if (card.cvc.length < 3)       errs.cvc    = 'Enter a valid 3-digit CVC';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handlePay(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setStep('processing');

        // Simulate network delay
        await new Promise(r => setTimeout(r, 2500));

        const last4 = card.number.replace(/\s/g, '').slice(-4);
        setStep('success');
        onSuccess(last4);
    }

    const inputBase =
        'flex h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 transition-colors';

    const errorClass = 'border-red-400 focus-visible:ring-red-400';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 overflow-y-auto py-8">
            <div className="relative w-full max-w-md rounded-3xl bg-background shadow-2xl overflow-hidden my-auto">

                {/* Header */}
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

                {/* Content */}
                <div className="px-6 py-5">
                    {step === 'processing' && <ProcessingScreen amount={amount} />}

                    {step === 'success' && (
                        <PaymentSuccessScreen
                            amount={amount}
                            cardLast4={card.number.replace(/\s/g, '').slice(-4)}
                            onClose={onClose}
                        />
                    )}

                    {step === 'form' && (
                        <form onSubmit={handlePay} className="space-y-4">
                            {/* Card preview */}
                            <CardPreview
                                number={card.number}
                                name={card.name}
                                expiry={card.expiry}
                                flipped={flipped}
                            />

                            {/* Card number */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="1234 5678 9012 3456"
                                        value={card.number}
                                        onChange={e => updateCard('number', e.target.value)}
                                        className={`${inputBase} pr-16 font-mono tracking-widest ${errors.number ? errorClass : ''}`}
                                        maxLength={19}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <CardTypeIcon type={getCardType(card.number)} />
                                    </div>
                                </div>
                                {errors.number && (
                                    <p className="flex items-center gap-1 text-xs text-red-600">
                                        <AlertCircle className="h-3 w-3" /> {errors.number}
                                    </p>
                                )}
                            </div>

                            {/* Cardholder name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Cardholder Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={card.name}
                                    onChange={e => updateCard('name', e.target.value.toUpperCase())}
                                    className={`${inputBase} uppercase tracking-wide ${errors.name ? errorClass : ''}`}
                                    maxLength={26}
                                />
                                {errors.name && (
                                    <p className="flex items-center gap-1 text-xs text-red-600">
                                        <AlertCircle className="h-3 w-3" /> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Expiry + CVC */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold">Expiry Date</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="MM/YY"
                                        value={card.expiry}
                                        onChange={e => updateCard('expiry', e.target.value)}
                                        className={`${inputBase} font-mono ${errors.expiry ? errorClass : ''}`}
                                        maxLength={5}
                                    />
                                    {errors.expiry && (
                                        <p className="flex items-center gap-1 text-xs text-red-600">
                                            <AlertCircle className="h-3 w-3" /> {errors.expiry}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold">CVC</label>
                                    <div className="relative">
                                        <input
                                            ref={cvcRef}
                                            type={showCvc ? 'text' : 'password'}
                                            inputMode="numeric"
                                            placeholder="•••"
                                            value={card.cvc}
                                            onChange={e => updateCard('cvc', e.target.value)}
                                            onFocus={() => setFlipped(true)}
                                            onBlur={() => setFlipped(false)}
                                            className={`${inputBase} pr-9 font-mono tracking-widest ${errors.cvc ? errorClass : ''}`}
                                            maxLength={3}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCvc(s => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            tabIndex={-1}
                                        >
                                            {showCvc ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.cvc && (
                                        <p className="flex items-center gap-1 text-xs text-red-600">
                                            <AlertCircle className="h-3 w-3" /> {errors.cvc}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Test card hint */}
                            <div className="rounded-xl bg-muted/50 border px-4 py-3 text-xs text-muted-foreground space-y-1">
                                <p className="font-semibold text-foreground">🧪 Test card details</p>
                                <p>Number: <span className="font-mono">4242 4242 4242 4242</span></p>
                                <p>Expiry: <span className="font-mono">12/28</span> &nbsp; CVC: <span className="font-mono">123</span></p>
                            </div>

                            {/* Security note */}
                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <Lock className="h-3 w-3" />
                                <span>Simulated secure payment · No real charge will be made</span>
                            </div>

                            {/* Pay button */}
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3.5 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
                            >
                                <Lock className="h-4 w-4" />
                                Pay R {formatRent(amount)} Now
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}