'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, CreditCard, Banknote, Smartphone, CircleDollarSign } from 'lucide-react';
import PaymentStatusBadge from './payment-status-badge';

type PaymentStatus = 'paid' | 'pending' | 'overdue';
type PaymentMethod = 'cash' | 'eft' | 'card' | 'other';

interface PaymentStatusChange {
    id: string;
    paymentId: string;
    oldStatus: PaymentStatus;
    newStatus: PaymentStatus;
    changedBy: string;
    changedAt: Date;
    reason?: string;
    paymentMethod?: PaymentMethod;
    isManual: boolean;
}

interface CoursePayment {
    id: string;
    status: PaymentStatus;
    amount: number;
    courseName: string;
    registrationDate: string;
    statusHistory?: PaymentStatusChange[];
}

interface PaymentHistoryViewerProps {
    payment: CoursePayment;
}

const PaymentHistoryViewer: React.FC<PaymentHistoryViewerProps> = ({ payment }) => {
    const getPaymentMethodIcon = (method?: PaymentMethod) => {
        if (!method) return null;

        switch (method) {
            case 'cash':
                return <Banknote className="h-4 w-4" />;
            case 'eft':
                return <CreditCard className="h-4 w-4" />;
            case 'card':
                return <Smartphone className="h-4 w-4" />;
            case 'other':
                return <CircleDollarSign className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const statusHistory = payment.statusHistory || [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="View payment history"
                >
                    <History className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Payment History</DialogTitle>
                    <DialogDescription>
                        Status change history for {payment.courseName}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-96 w-full">
                    <div className="space-y-4 py-4">
                        {statusHistory.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No status changes recorded</p>
                            </div>
                        ) : (
                            statusHistory
                                .toSorted(
                                    (a, b) =>
                                        new Date(b.changedAt).getTime() -
                                        new Date(a.changedAt).getTime()
                                )
                                .map((change, index) => (
                                    <div
                                        key={change.id}
                                        className="flex items-start gap-3 p-3 border rounded-lg"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {index === 0 ? (
                                                <div className="h-2 w-2 bg-primary rounded-full" />
                                            ) : (
                                                <div className="h-2 w-2 bg-muted-foreground/30 rounded-full" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <PaymentStatusBadge
                                                    status={change.oldStatus}
                                                    size="sm"
                                                />
                                                <span className="text-muted-foreground">→</span>
                                                <PaymentStatusBadge
                                                    status={change.newStatus}
                                                    size="sm"
                                                />

                                                {change.isManual && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Manual
                                                    </Badge>
                                                )}
                                            </div>

                                            {change.paymentMethod && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    {getPaymentMethodIcon(change.paymentMethod)}
                                                    <span>
                                                        {change.paymentMethod
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            change.paymentMethod.slice(1)}
                                                    </span>
                                                </div>
                                            )}

                                            {change.reason && (
                                                <p className="text-sm text-muted-foreground">
                                                    "{change.reason}"
                                                </p>
                                            )}

                                            <div className="text-xs text-muted-foreground">
                                                Changed by {change.changedBy} on{' '}
                                                {formatDate(change.changedAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentHistoryViewer;
