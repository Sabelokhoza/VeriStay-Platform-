import { Role } from '@/hooks/use-user';
import { StudentBillingDetails } from '../model/billing-model';
import { PaymentMethod, PaymentStatus } from '../model/enums';

const coursePayments: StudentBillingDetails[] = [
    {
        id: '1',
        courseName: 'PSiRA Grade A - Advanced Security Officer',
        registrationDate: '2025-06-15',
        amount: 4500,
        status: PaymentStatus.Paid,
        method: PaymentMethod.Cash,
        isManualPayment: true,
        lastModifiedBy: 'Training Partner Admin',
        lastModifiedDate: '2025-08-15T10:30:00Z',
        PaymentStatusChange: [
            {
                id: 'sh1',
                changedBy: 'Training Partner Admin',
                changedByRole: Role.Partner,
                previousStatus: PaymentStatus.Pending,
                newStatus: PaymentStatus.Paid,
                changeDate: '2025-08-15T10:30:00Z',
                changeReason: 'Cash payment received',
                paymentMethod: PaymentMethod.Cash,
            },
        ],
    },
];

export { coursePayments };
