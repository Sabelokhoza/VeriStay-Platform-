export function formatCardNumber(value: string) {
    return value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

export function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

export function formatCVC(value: string) {
    return value.replace(/\D/g, '').slice(0, 3);
}

export function getCardType(number: string): 'visa' | 'mastercard' | 'amex' | null {
    const n = number.replace(/\s/g, '');
    if (n.startsWith('4'))                     return 'visa';
    if (n.startsWith('5') || n.startsWith('2')) return 'mastercard';
    if (n.startsWith('3'))                      return 'amex';
    return null;
}

export function formatRent(n: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(n);
}

export interface CardDetails {
    number: string;
    name:   string;
    expiry: string;
    cvc:    string;
}

export type PaymentStep = 'form' | 'processing' | 'success';
