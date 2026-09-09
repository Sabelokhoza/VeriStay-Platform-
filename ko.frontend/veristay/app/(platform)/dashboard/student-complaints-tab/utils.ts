import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

export function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function getComplaintTypeInfo(type: number) {
    switch (type) {
        case 0: return { label: 'Vacancy',             style: 'bg-blue-100   text-blue-800   border-blue-200'   };
        case 1: return { label: 'Property Condition',  style: 'bg-orange-100 text-orange-800 border-orange-200' };
        case 2: return { label: 'Landlord Behaviour',  style: 'bg-red-100    text-red-800    border-red-200'    };
        case 3: return { label: 'Other',               style: 'bg-gray-100   text-gray-700   border-gray-200'   };
        default: return { label: 'Unknown',            style: 'bg-gray-100   text-gray-700   border-gray-200'   };
    }
}

export function getComplaintStatusInfo(status: number) {
    switch (status) {
        case 0: return { label: 'Open',         style: 'bg-red-100    text-red-800    border-red-200',    icon: AlertCircle };
        case 1: return { label: 'Under Review',  style: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock       };
        case 2: return { label: 'Resolved',      style: 'bg-green-100  text-green-800  border-green-200',  icon: CheckCircle };
        case 3: return { label: 'Dismissed',     style: 'bg-gray-100   text-gray-700   border-gray-200',   icon: X           };
        default: return { label: 'Unknown',      style: 'bg-gray-100   text-gray-700   border-gray-200',   icon: AlertCircle };
    }
}

export interface ActiveTenancyRef {
    landlordId?:    string;
    propertyId?:    number;
    propertyTitle?: string;
}
