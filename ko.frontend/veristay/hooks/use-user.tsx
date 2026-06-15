'use client';
import { StudentModel } from '@/app/api/model/students-model';
import { useAppSelector } from '@/app/store/store';
import { redirect } from 'next/navigation';

export enum Role {
    Admin = 'admin',
    Partner = 'consultant',
    Student = 'student',
}

export interface UserModel {
    id: string;
    idNumber: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    dateOfBirth: string;
    email: string;
    isSouthAfrican: boolean;
    role: Role;
    token: string;
}

export function useUser() {
    // Access the updated userModel properties
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const userEmail = useAppSelector((state) => state.userAuthStore?.email);
    const firstName = useAppSelector((state) => state.userAuthStore?.firstName);
    const lastName = useAppSelector((state) => state.userAuthStore?.lastName);
    const idNumber = useAppSelector((state) => state.userAuthStore?.idNumber);
    const address = useAppSelector((state) => state.userAuthStore?.address);
    const phoneNumber = useAppSelector((state) => state.userAuthStore?.phoneNumber);
    const dateOfBirth = useAppSelector((state) => state.userAuthStore?.dateOfBirth);
    const isSouthAfrican = useAppSelector((state) => state.userAuthStore?.isSouthAfrican);
    const userRole = useAppSelector((state) => state.userAuthStore?.role);
    const userToken = useAppSelector((state) => state.userAuthStore?.token);

    console.log('User data from Redux:', {
        userId,
        userEmail,
        firstName,
        lastName,
        userRole,
    });

    if (!userId || !userEmail || !userRole) {
        console.log('Redirecting to login - missing user data:', {
            userId: !!userId,
            userEmail: !!userEmail,
            userRole: !!userRole,
        });
        redirect('/login');
    }

    const role = userRole.toLowerCase() as Role;
    console.log('Determined user role:', role);

    if (role !== Role.Admin && role !== Role.Partner && role !== Role.Student) {
        console.log('Redirecting to unauthorized - invalid role:', role);
        redirect('/unauthorized');
    }

    const user: UserModel = {
        id: userId,
        idNumber: idNumber || '',
        firstName: firstName || '',
        lastName: lastName || '',
        address: address || '',
        phoneNumber: phoneNumber || '',
        dateOfBirth: dateOfBirth || '',
        email: userEmail,
        isSouthAfrican: isSouthAfrican || false,
        role,
        token: userToken || '',
    };

    return user;
}

export function useStudentUser() {
    // Access the updated userModel properties
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const userEmail = useAppSelector((state) => state.userAuthStore?.email);
    const firstName = useAppSelector((state) => state.userAuthStore?.firstName);
    const lastName = useAppSelector((state) => state.userAuthStore?.lastName);
    const phoneNumber = useAppSelector((state) => state.userAuthStore?.phoneNumber);
    const dateOfBirth = useAppSelector((state) => state.userAuthStore?.dateOfBirth);
    const address = useAppSelector((state) => state.userAuthStore?.address);
    const userRole = useAppSelector((state) => state.userAuthStore?.role);

    console.log('Student User data from Redux:', {
        userId,
        userEmail,
        firstName,
        lastName,
        userRole,
    });

    if (!userId || !userEmail || !userRole) {
        redirect('/login');
    }

    const role = userRole.toLowerCase() as Role;
    if (role !== Role.Student) {
        redirect('/unauthorized');
    }

    const student: StudentModel = {
        id: userId,
        firstName: firstName || '',
        lastName: lastName || '',
        email: userEmail,
        phoneNumber: phoneNumber || '123-456-7890',
        dateOfBirth: dateOfBirth || '2000-01-01',
        address: address || '123 Main St, City, Country',
        psiraNumber: 'PS123456',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        trainingCenterId: 'TC001',
        coursePayments: undefined,
    };

    return student;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
