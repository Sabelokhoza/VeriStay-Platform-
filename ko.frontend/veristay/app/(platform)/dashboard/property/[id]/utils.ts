import {
    Wifi, Car, Zap, Droplets, Shield, Utensils, Tv, Wind, Package,
    Clock, CheckCircle, AlertCircle, X,
} from 'lucide-react';

export function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

export function safeBeds(count: number) {
    if (!Number.isFinite(count) || count > 100 || count <= 0) return '';
    return String(count);
}

export function isPlaceholder(value: string | null | undefined) {
    if (!value) return true;
    const v = value.trim().toLowerCase();
    return v === 'n/a' || v === 'none' || v === 'unknown' || v === 'tbd' || v === 'tba';
}

export function getPropertyStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Pending Approval', style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
        case 1: return { label: 'Approved',          style: 'bg-green-100  text-green-800  border-green-200', icon: CheckCircle };
        case 2: return { label: 'Rejected',          style: 'bg-red-100    text-red-800    border-red-200',   icon: AlertCircle };
        case 3: return { label: 'Delisted',          style: 'bg-gray-100   text-gray-700   border-gray-200', icon: X };
        default: return { label: 'Unknown',          style: 'bg-gray-100   text-gray-700   border-gray-200', icon: AlertCircle };
    }
}

export const PRESET_AMENITIES = [
    { label: 'WiFi',             icon: Wifi      },
    { label: 'Parking',          icon: Car       },
    { label: 'Electricity',      icon: Zap       },
    { label: 'Water',            icon: Droplets  },
    { label: 'Security',         icon: Shield    },
    { label: 'Kitchen',          icon: Utensils  },
    { label: 'DSTV',             icon: Tv        },
    { label: 'Air Conditioning', icon: Wind      },
    { label: 'Furnished',        icon: Package   },
];

export const SOUTH_AFRICAN_CITIES = [
    'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth',
    'Bloemfontein', 'East London', 'Stellenbosch', 'Bellville',
    'Rondebosch', 'Mowbray', 'Observatory', 'Claremont',
    'Sandton', 'Centurion', 'Potchefstroom', 'George',
];

export const inputClass =
    'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

export const labelClass = 'text-sm font-medium text-foreground';
