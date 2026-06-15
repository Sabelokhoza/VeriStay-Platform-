import { enrollments } from './../../(platform)/data/enrollments';
interface StudentModel {
    coursePayments: any;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    psiraNumber?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    trainingCenterId: string;
}

export type { StudentModel };
