import { Role } from '@/hooks/use-user';
import { PaymentMethod, PaymentStatus } from './enums';

interface StudentBillingItemModel {
    id: string;
    amount: number;
    courseId: string;
    billingId: string;
}

interface StudentBillingModel {
    id: string;
    billingDate: string;
    amount: number;
    status: PaymentStatus;
    studentId: string;
}

interface StudentBillingDetails {
    id: string;
    courseName: string;
    registrationDate: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    isManualPayment: boolean;
    lastModifiedBy: string;
    lastModifiedDate: string;
    PaymentStatusChange?: PaymentStatusChange[];
}

interface PaymentStatusChange {
    id: string;
    changedBy: string;
    changedByRole: Role;
    previousStatus: PaymentStatus;
    newStatus: PaymentStatus;
    changeDate: string;
    changeReason: string;
    paymentMethod: PaymentMethod;
}

export type { StudentBillingDetails, StudentBillingItemModel, StudentBillingModel };
