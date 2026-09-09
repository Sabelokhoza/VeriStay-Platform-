import {
    BarChart3, Home, ClipboardList, Users, CreditCard, Wrench, Megaphone, Star,
} from 'lucide-react';

export function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function safeBeds(count: number) {
    if (!Number.isFinite(count) || count > 100 || count <= 0) return null;
    return count;
}

export function isPlaceholder(value: string | null | undefined) {
    if (!value) return true;
    const v = value.trim().toLowerCase();
    return v === 'n/a' || v === 'none' || v === 'unknown' || v === 'tbd' || v === 'tba';
}

export function getPropertyStatusLabel(status: number) {
    switch (status) {
        case 0: return 'Pending Approval';
        case 1: return 'Approved';
        case 2: return 'Rejected';
        case 3: return 'Delisted';
        default: return 'Unknown';
    }
}

export function getPropertyStatusStyle(status: number) {
    switch (status) {
        case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 1: return 'bg-green-100  text-green-800  border-green-200';
        case 2: return 'bg-red-100    text-red-800    border-red-200';
        case 3: return 'bg-gray-100   text-gray-700   border-gray-200';
        default: return 'bg-gray-100  text-gray-700   border-gray-200';
    }
}

export function getAppStatusLabel(status: number) {
    switch (status) {
        case 0: return 'Pending';
        case 1: return 'Approved';
        case 2: return 'Rejected';
        case 4: return 'Accepted';
        default: return 'Unknown';
    }
}

export function getAppStatusStyle(status: number) {
    switch (status) {
        case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 1: return 'bg-green-100  text-green-800  border-green-200';
        case 2: return 'bg-red-100    text-red-800    border-red-200';
        case 4: return 'bg-gray-100   text-gray-700   border-gray-200';
        default: return 'bg-gray-100  text-gray-700   border-gray-200';
    }
}

export function getMaintPriorityLabel(priority: number) {
    switch (priority) {
        case 0: return { label: 'Low',       style: 'text-green-600'       };
        case 1: return { label: 'Medium',    style: 'text-yellow-600'      };
        case 2: return { label: 'High',      style: 'text-red-600'         };
        case 3: return { label: 'Emergency', style: 'text-red-800 font-bold' };
        default: return { label: 'Unknown',  style: 'text-gray-500'        };
    }
}

export function getMaintStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Open',       style: 'bg-blue-100   text-blue-800   border-blue-200'   };
        case 1: return { label: 'In Progress', style: 'bg-orange-100 text-orange-800 border-orange-200' };
        case 2: return { label: 'Resolved',    style: 'bg-green-100  text-green-800  border-green-200'  };
        default: return { label: 'Unknown',    style: 'bg-gray-100   text-gray-700   border-gray-200'   };
    }
}

export type Tab = 'overview' | 'properties' | 'applications' | 'pending' | 'tenants' | 'payments' | 'maintenance' | 'announcements' | 'reputation';

export const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'overview',       label: 'Overview',             icon: BarChart3     },
    { id: 'properties',     label: 'Properties',           icon: Home          },
    { id: 'applications',   label: 'Applications',         icon: ClipboardList },
    { id: 'pending',        label: 'Pending Applications', icon: ClipboardList },
    { id: 'tenants',        label: 'Tenants',               icon: Users         },
    { id: 'payments',       label: 'Payments',             icon: CreditCard    },
    { id: 'maintenance',    label: 'Maintenance',          icon: Wrench        },
    { id: 'announcements',  label: 'Announcements',        icon: Megaphone     },
    { id: 'reputation',     label: 'Reputation Score',     icon: Star          },
];
