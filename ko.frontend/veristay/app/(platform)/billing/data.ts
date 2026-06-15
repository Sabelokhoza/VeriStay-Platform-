import { StudentModel } from '@/app/api/model/students-model';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online' | 'manual';
export type UserRole = 'admin' | 'partner' | 'system';

export interface PaymentStatusChange {
    id: string;
    changedBy: string;
    changedByRole: UserRole;
    previousStatus: PaymentStatus;
    newStatus: PaymentStatus;
    changeDate: string;
    changeReason?: string;
    paymentMethod?: PaymentMethod;
}

export interface CoursePayment {
    id: string;
    courseName: string;
    registrationDate: string;
    amount: number;
    status: PaymentStatus;
    paymentMethod?: PaymentMethod;
    isManualPayment?: boolean;
    statusHistory?: PaymentStatusChange[];
    lastModifiedBy?: string;
    lastModifiedDate?: string;
}

export const mockInstitutionDetails = {
    name: 'PSiRA Training Council',
    registrationNumber: 'TC-2025-001',
    address: '123 Security Street, Pretoria, 0002',
    contactEmail: 'billing@psiratraining.co.za',
    phone: '+27 12 345 6789',
};

export const mockStudents: StudentModel[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phoneNumber: '+27 82 123 4567',
        dateOfBirth: '1995-03-15',
        address: '45 Main Road, Johannesburg, 2001',
        psiraNumber: 'PSIRA-12345',
        createdAt: '2025-06-01T08:00:00Z',
        updatedAt: '2025-08-15T10:30:00Z',
        isActive: true,
        trainingCenterId: 'tc-001',
        coursePayments: [
            {
                id: 1,
                courseName: 'PSiRA Grade A - Advanced Security Officer',
                registrationDate: '2025-06-15',
                amount: 4500,
                status: 'paid',
                paymentMethod: 'cash',
                isManualPayment: true,
                lastModifiedBy: 'Training Partner Admin',
                lastModifiedDate: '2025-08-15T10:30:00Z',
                statusHistory: [
                    {
                        id: 'sh1',
                        changedBy: 'Training Partner Admin',
                        changedByRole: 'partner',
                        previousStatus: 'pending',
                        newStatus: 'paid',
                        changeDate: '2025-08-15T10:30:00Z',
                        changeReason: 'Cash payment received',
                        paymentMethod: 'cash',
                    },
                ],
            },
            {
                id: 2,
                courseName: 'PSiRA Grade B - Senior Security Officer',
                registrationDate: '2025-07-01',
                amount: 3800,
                status: 'pending',
                paymentMethod: 'online',
                isManualPayment: false,
                statusHistory: [],
            },
        ],
    },
    {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        phoneNumber: '+27 83 987 6543',
        dateOfBirth: '1992-07-22',
        address: '78 Oak Avenue, Cape Town, 8001',
        psiraNumber: 'PSIRA-12346',
        createdAt: '2025-06-05T09:15:00Z',
        updatedAt: '2025-08-10T00:00:00Z',
        isActive: true,
        trainingCenterId: 'tc-002',
        coursePayments: [
            {
                id: 3,
                courseName: 'PSiRA Grade C - Security Officer',
                registrationDate: '2025-07-10',
                amount: 3200,
                status: 'overdue',
                paymentMethod: 'online',
                isManualPayment: false,
                lastModifiedBy: 'System',
                lastModifiedDate: '2025-08-10T00:00:00Z',
                statusHistory: [
                    {
                        id: 'sh2',
                        changedBy: 'System',
                        changedByRole: 'system',
                        previousStatus: 'pending',
                        newStatus: 'overdue',
                        changeDate: '2025-08-10T00:00:00Z',
                        changeReason: 'Automatic status change - payment overdue',
                    },
                ],
            },
            {
                id: 4,
                courseName: 'PSiRA Grade D - Basic Security Officer',
                registrationDate: '2025-07-15',
                amount: 2800,
                status: 'paid',
                paymentMethod: 'bank_transfer',
                isManualPayment: false,
                statusHistory: [],
            },
        ],
    },
];
