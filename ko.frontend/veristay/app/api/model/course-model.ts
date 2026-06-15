import { PSIRAGrade } from './enums';

interface CourseModel {
    id: string;
    title: string;
    description: string;
    durationHours: number;
    psiraGrade: PSIRAGrade;
    TrainingCenterId: string;
    pricing: number;
    isActive: boolean;
}

interface CourseEnrollment {
    id: string;
    courseId: string;
    studentId: string;
    enrollmentDate: string;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    startDate: string;
    endDate?: string;
    certificateId?: string;
}

interface CourseInformation {
    id: string;
    courseId: string;
    title: string;
    description: string;
    status: boolean;
    totalEnrollments: number;
    totalActiveEnrollments: number;
    totalCompleted: number;
    totalCompletedPercentage: number;
    totalModules: number;
    averageProgress: number;
    courseDuration: number;
}

export type { CourseModel, CourseEnrollment, CourseInformation };
