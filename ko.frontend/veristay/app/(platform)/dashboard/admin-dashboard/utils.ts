import {
    BarChart3, Users, Home, AlertTriangle, Flag, UserCheck, FileText, TrendingUp,
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

export function getLandlordStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Pending',   style: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        case 1: return { label: 'Approved',  style: 'bg-green-100  text-green-800  border-green-200'  };
        case 2: return { label: 'Rejected',  style: 'bg-red-100    text-red-800    border-red-200'    };
        case 3: return { label: 'Suspended', style: 'bg-gray-100   text-gray-700   border-gray-200'   };
        default: return { label: 'Unknown',  style: 'bg-gray-100   text-gray-700   border-gray-200'   };
    }
}

export function getPropertyStatusLabel(status: number) {
    switch (status) {
        case 0: return { label: 'Pending Approval', style: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        case 1: return { label: 'Approved',          style: 'bg-green-100  text-green-800  border-green-200'  };
        case 2: return { label: 'Rejected',          style: 'bg-red-100    text-red-800    border-red-200'    };
        case 3: return { label: 'Delisted',          style: 'bg-gray-100   text-gray-700   border-gray-200'   };
        default: return { label: 'Unknown',          style: 'bg-gray-100   text-gray-700   border-gray-200'   };
    }
}

export type Tab = 'overview' | 'landlords' | 'properties' | 'disputes' |
           'complaints' | 'users' | 'report' | 'analytics';

export const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',    label: 'Overview',    icon: BarChart3     },
    { id: 'landlords',   label: 'Landlords',   icon: Users         },
    { id: 'properties',  label: 'Properties',  icon: Home          },
    { id: 'disputes',    label: 'Disputes',    icon: AlertTriangle },
    { id: 'complaints',  label: 'Complaints',  icon: Flag          },
    { id: 'users',       label: 'Users',       icon: UserCheck     },
    { id: 'report',      label: 'Report',      icon: FileText      },
    { id: 'analytics',   label: 'Analytics',   icon: TrendingUp    },
];
