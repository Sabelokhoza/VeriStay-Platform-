'use client';

import { CreditCard, Loader2, Badge, CheckCircle, XCircle, Receipt } from 'lucide-react';
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CardTitle, CardContent, Card, CardHeader } from '../ui/card';
import { StudentModel } from '@/app/api/model/students-model';
import { Button } from '../ui/button';
import { CourseEnrollmentPaymentModel } from '@/app/errors/studentApi';
import { AddPaymentDto, useAddPaymentMutation } from '@/app/errors/filesApi';
import { toast } from 'react-toastify';
import { userDto } from '@/app/api/dtos/dtos';
import { initiatePayment } from './payfast-integration';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import DownloadInvoice from './download-invoice';

const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'overdue':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

interface BillingStudentInfoProps {
    coursePayments: CourseEnrollmentPaymentModel[];
    student: userDto;
    onPaymentSuccess?: () => void;
}

const BillingStudentInfo = ({
    coursePayments,
    student,
    onPaymentSuccess,
}: BillingStudentInfoProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [addPayment, { isLoading }] = useAddPaymentMutation();
    const [processingPaymentId, setProcessingPaymentId] = useState<number | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<{ amount: number; id: string } | null>(null);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            if (!searchParams) return;
            const status = searchParams.get('status');
            const enrollmentId = searchParams.get('enrollmentId');
            const amountParam = searchParams.get('amount');

            if (status === 'success' && enrollmentId && amountParam) {
                const paymentData: AddPaymentDto = {
                    applicationUserId: student.id || '',
                    courseEnrollmentId: parseInt(enrollmentId),
                    amount: parseFloat(amountParam),
                    paymentMethod: 'Card',
                };

                try {
                    await addPayment(paymentData).unwrap();
                    setReceiptData({ amount: parseFloat(amountParam), id: enrollmentId });
                    setShowReceipt(true);
                    if (onPaymentSuccess) onPaymentSuccess();
                } catch (error) {
                    console.error('Payment recording failed or already recorded', error);
                }
                router.replace(pathname);
            } else if (status === 'cancelled') {
                toast.info('Payment was cancelled');
                router.replace(pathname);
            }
        };
        checkPaymentStatus();
    }, [searchParams, addPayment, student.id, pathname, router, onPaymentSuccess]);

    const handlePayNow = async (payment: CourseEnrollmentPaymentModel) => {
        try {
            setProcessingPaymentId(payment.id);

            const paymentOutcome = await initiatePayment(
                student.id,
                `Course Payment: ${payment.courseName}`,
                parseFloat(payment.amount),
                payment.id
            );

            if (!paymentOutcome.success) {
                toast.error(`Payment initiation failed: ${paymentOutcome.message}`);
                setProcessingPaymentId(null);
                return;
            }

            // Redirecting to PayFast...
        } catch (error: any) {
            toast.error(`Payment failed: ${error?.data?.message || error.message}`);
            setProcessingPaymentId(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Course Payments
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your billing history and payment status
                        </p>
                    </div>
                    <div>
                        <DownloadInvoice student={student} coursePayments={coursePayments} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {coursePayments.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between p-4 rounded-lg border bg-muted/5"
                            >
                                <div className="space-y-1">
                                    <div className="font-medium">{payment.courseName}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Registered:{' '}
                                        {new Date(payment.registrationDate).toLocaleDateString(
                                            'en-ZA'
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={getStatusStyle(payment.status)}>
                                        {payment.status.toLowerCase() === 'paid' && (
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {payment.status.toLowerCase() === 'overdue' && (
                                            <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {payment.status.charAt(0).toUpperCase() +
                                            payment.status.slice(1)}
                                    </Badge>

                                    <span className="font-medium">
                                        R {parseFloat(payment.amount).toLocaleString()}
                                    </span>

                                    {payment.status.toLowerCase() === 'paid' ? (
                                        <DownloadInvoice
                                            student={student}
                                            coursePayments={[payment]}
                                            label="Receipt"
                                            size="sm"
                                        />
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="flex items-center gap-2"
                                            onClick={() => handlePayNow(payment)}
                                            disabled={
                                                isLoading && processingPaymentId === payment.id
                                            }
                                        >
                                            {isLoading && processingPaymentId === payment.id ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Pay now'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {coursePayments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard className="h-8 w-8 mx-auto mb-2" />
                                <p>No course payments found</p>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <div className="font-medium">Total Amount</div>
                                <div className="font-bold">
                                    R{' '}
                                    {coursePayments
                                        .reduce(
                                            (sum, payment) => sum + parseFloat(payment.amount),
                                            0
                                        )
                                        .toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            Payment Successful
                        </DialogTitle>
                        <DialogDescription>
                            Your payment has been successfully processed. Thank you!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Amount Paid</span>
                            <span className="text-lg font-bold">
                                R {receiptData?.amount.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            Transaction ID: {receiptData?.id}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowReceipt(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BillingStudentInfo;
