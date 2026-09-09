'use client';

import { useRef, useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { CardDetails, formatCardNumber, formatExpiry, formatCVC, getCardType, formatRent } from './utils';
import { CardPreview } from './CardPreview';
import { CardTypeIcon } from './CardTypeIcon';

const inputBase =
    'flex h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 transition-colors';

const errorClass = 'border-red-400 focus-visible:ring-red-400';

export function PaymentForm({
    amount,
    onPay,
}: {
    amount: number;
    onPay:  (card: CardDetails) => void;
}) {
    const [flipped, setFlipped] = useState(false);
    const [showCvc, setShowCvc] = useState(false);
    const [errors,  setErrors]  = useState<Partial<CardDetails>>({});
    const [card, setCard] = useState<CardDetails>({
        number: '', name: '', expiry: '', cvc: '',
    });

    const cvcRef = useRef<HTMLInputElement>(null);

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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        onPay(card);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CardPreview
                number={card.number}
                name={card.name}
                expiry={card.expiry}
                flipped={flipped}
            />

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

            <div className="rounded-xl bg-muted/50 border px-4 py-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">🧪 Test card details</p>
                <p>Number: <span className="font-mono">4242 4242 4242 4242</span></p>
                <p>Expiry: <span className="font-mono">12/28</span> &nbsp; CVC: <span className="font-mono">123</span></p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Simulated secure payment · No real charge will be made</span>
            </div>

            <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3.5 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
            >
                <Lock className="h-4 w-4" />
                Pay R {formatRent(amount)} Now
            </button>
        </form>
    );
}
