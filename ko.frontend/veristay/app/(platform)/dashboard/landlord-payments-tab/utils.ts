import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function isPlaceholder(v: string | null | undefined) {
    if (!v) return true;
    return v.trim().toLowerCase() === 'string' || v.trim() === '';
}

export function getPaymentStatus(status: number) {
    switch (status) {
        case 0: return { label: 'Pending', style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock       };
        case 1: return { label: 'Paid',    style: 'bg-green-100  text-green-800  border-green-200', icon: CheckCircle };
        case 2: return { label: 'Overdue', style: 'bg-red-100    text-red-800    border-red-200',   icon: AlertCircle };
        default: return { label: 'Unknown', style: 'bg-gray-100  text-gray-700   border-gray-200',  icon: AlertCircle };
    }
}
