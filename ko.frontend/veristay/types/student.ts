import { PSiRAGrade } from '@/app/(platform)/certifications/data/mock';

export type StudentStatus = 'Active' | 'Inactive';

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    status: StudentStatus;
    currentGrade?: PSiRAGrade;
    enrolledCourseId?: string;
    psiraNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateStudentInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    psiraNumber?: string;
    idNumber: string;
    dateOfBirth: string;
    isSouthAfrican: boolean;
    address: string;
    password: string;
}

export interface CreateCentreAdminInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    psiraNumber?: string;
    idNumber: string;
    dateOfBirth: string;
    isSouthAfrican: boolean;
    address: string;
    password: string;
    centreId: number;
}
