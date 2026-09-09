import {
    BarChart3, ClipboardList, Home, CreditCard, Wrench,
    Users, AlertTriangle, Flag,
} from 'lucide-react';
import { MaintenancePriority, MaintenanceStatus } from '@/app/errors/listingsApi';

export function getMaintenanceStatusLabel(status: MaintenanceStatus): string {
    switch (status) {
        case MaintenanceStatus.Open:
            return 'Open';
        case MaintenanceStatus.InProgress:
            return 'InProgress';
        case MaintenanceStatus.Resolved:
            return 'Resolved';
        case MaintenanceStatus.Rejected:
            return 'Rejected';
        default:
            return 'Unknown';
    }
}

export function getPriorityLabel(priority: MaintenancePriority): string {
    switch (priority) {
        case MaintenancePriority.Low:
            return 'Low';
        case MaintenancePriority.Medium:
            return 'Medium';
        case MaintenancePriority.High:
            return 'High';
        case MaintenancePriority.Emergency:
            return 'Emergency';
        default:
            return 'Low';
    }
}

export function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function getStatusLabel(status: number): string {
    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Approved';
        case 2:
            return 'Rejected';
        case 3:
            return 'WaitingList';
        case 4:
            return 'Accepted';
        case 5:
            return 'Declined';
        default:
            return 'Unknown';
    }
}

export const statusStyles: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Approved: 'bg-green-100  text-green-800  border-green-200',
    Rejected: 'bg-red-100    text-red-800    border-red-200',
    Open: 'bg-blue-100   text-blue-800   border-blue-200',
    InProgress: 'bg-orange-100 text-orange-800 border-orange-200',
    Resolved: 'bg-green-100  text-green-800  border-green-200',
    Paid: 'bg-green-100  text-green-800  border-green-200',
    Overdue: 'bg-red-100    text-red-800    border-red-200',
};

export const priorityStyles: Record<string, string> = {
    Low: 'text-green-600',
    Medium: 'text-yellow-600',
    High: 'text-red-600',
    Emergency: 'text-red-800 font-bold',
};

export type Tab = 'overview' | 'applications' | 'tenancy' |
           'payments' | 'maintenance' | 'community' |
           'disputes' | 'complaints';

export const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',     label: 'Overview',     icon: BarChart3     },
    { id: 'applications', label: 'Applications', icon: ClipboardList },
    { id: 'tenancy',      label: 'My Tenancy',   icon: Home          },
    { id: 'payments',     label: 'Payments',     icon: CreditCard    },
    { id: 'maintenance',  label: 'Maintenance',  icon: Wrench        },
    { id: 'community',    label: 'Community',    icon: Users         },
    { id: 'disputes',     label: 'Disputes',     icon: AlertTriangle },
    { id: 'complaints',   label: 'Complaints',   icon: Flag          },
];
