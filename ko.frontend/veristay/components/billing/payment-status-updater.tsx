'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    CheckCircle,
    AlertTriangle,
    Clock,
    CreditCard,
    Banknote,
    Smartphone,
    CircleDollarSign,
} from 'lucide-react';
import PaymentStatusBadge from './payment-status-badge';

type PaymentStatus = 'paid' | 'pending' | 'overdue';
type PaymentMethod = 'cash' | 'eft' | 'card' | 'other';

interface CoursePayment {
    id: string;
    status: PaymentStatus;
    amount: number;
    courseName: string;
    registrationDate: string;
}

interface PaymentStatusUpdaterProps {
    payment: CoursePayment;
    onStatusUpdate: (
        paymentId: string,
        newStatus: PaymentStatus,
        paymentMethod?: PaymentMethod,
        reason?: string
    ) => void;
    disabled?: boolean;
    userRole: 'admin' | 'partner';
    userName: string;
}

const PaymentStatusUpdater: React.FC<PaymentStatusUpdaterProps> = ({
    payment,
    onStatusUpdate,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(payment.status);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
    const [changeReason, setChangeReason] = useState('');

    const handleConfirm = async () => {
        if (selectedStatus === payment.status) {
            setIsOpen(false);
            return;
        }

        setIsUpdating(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            onStatusUpdate(
                payment.id,
                selectedStatus,
                selectedStatus === 'paid' ? selectedPaymentMethod : undefined,
                changeReason || undefined
            );

            setIsOpen(false);
            setChangeReason('');
        } catch (error) {
            console.error('Failed to update payment status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    className="flex items-center gap-2"
                >
                    <PaymentStatusBadge status={payment.status} size="sm" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Payment Status</DialogTitle>
                    <DialogDescription>
                        Change the payment status for {payment.courseName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Payment Status</Label>
                        <Select
                            value={selectedStatus}
                            onValueChange={(value) => setSelectedStatus(value as PaymentStatus)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Pending
                                    </div>
                                </SelectItem>
                                <SelectItem value="paid">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Paid
                                    </div>
                                </SelectItem>
                                <SelectItem value="overdue">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Overdue
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedStatus === 'paid' && (
                        <div className="space-y-2">
                            <Label htmlFor="payment-method">Payment Method</Label>
                            <Select
                                value={selectedPaymentMethod}
                                onValueChange={(value) =>
                                    setSelectedPaymentMethod(value as PaymentMethod)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">
                                        <div className="flex items-center gap-2">
                                            <Banknote className="h-4 w-4" />
                                            Cash
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="eft">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            EFT
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="card">
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            Card
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="other">
                                        <div className="flex items-center gap-2">
                                            <CircleDollarSign className="h-4 w-4" />
                                            Other
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Textarea
                            id="reason"
                            placeholder="Enter reason for status change..."
                            value={changeReason}
                            onChange={(e) => setChangeReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Status'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentStatusUpdater;
