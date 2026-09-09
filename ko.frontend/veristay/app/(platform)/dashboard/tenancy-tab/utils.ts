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

export function getTenancyStatusLabel(status: number) {
    switch (status) {
        case 0:  return { label: 'Active',      style: 'bg-green-100 text-green-800 border-green-200',  icon: CheckCircle  };
        case 1:  return { label: 'Ended',       style: 'bg-gray-100  text-gray-700  border-gray-200',   icon: Clock        };
        case 2:  return { label: 'Terminated',  style: 'bg-red-100   text-red-800   border-red-200',    icon: AlertCircle  };
        default: return { label: 'Unknown',     style: 'bg-gray-100  text-gray-700  border-gray-200',   icon: AlertCircle  };
    }
}

export function isPlaceholder(v: string | null | undefined) {
    if (!v) return true;
    const l = v.trim().toLowerCase();
    return l === 'string' || l === 'string - string' || l === '';
}
