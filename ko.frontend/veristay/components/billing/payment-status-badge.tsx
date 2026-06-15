'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

type PaymentStatus = 'paid' | 'pending' | 'overdue';

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
    size?: 'sm' | 'default' | 'lg';
    showIcon?: boolean;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
    status,
    size = 'default',
    showIcon = true,
}) => {
    const getStatusVariant = (status: PaymentStatus) => {
        switch (status) {
            case 'paid':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'overdue':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getStatusIcon = (status: PaymentStatus) => {
        let iconSize = 'h-4 w-4';
        if (size === 'sm') {
            iconSize = 'h-3 w-3';
        } else if (size === 'lg') {
            iconSize = 'h-5 w-5';
        }

        switch (status) {
            case 'paid':
                return <CheckCircle className={iconSize} />;
            case 'pending':
                return <Clock className={iconSize} />;
            case 'overdue':
                return <AlertTriangle className={iconSize} />;
            default:
                return <Clock className={iconSize} />;
        }
    };

    const getStatusText = (status: PaymentStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Badge variant={getStatusVariant(status)} className="flex items-center gap-1">
            {showIcon && getStatusIcon(status)}
            {getStatusText(status)}
        </Badge>
    );
};

export default PaymentStatusBadge;
