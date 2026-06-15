import { TrainingCentreEnrollmentsModel } from '@/app/errors/coursesApi';

export interface addEnrollmentDto {
    applicationUserId: string;
    courseId: number;
}

export interface CourseModuleDto {
    courseId: number;
    title: string;
    description: string;
    duration: number;

    id?: number;
    dateCreated?: string | null;
    dateModified?: string | null;
}

export interface StudentCoursesDashboardData {
    data(arg0: string, data: (arg0: string, data: any) => unknown): unknown;
    data(arg0: string, data: any): unknown;
    certificationEarned: number;
    averageProgress: number;
    totalEnrollments: number;
    activeCourse: ActiveCourse;
}

export interface StudentQuizAttemptDto {
    id: number;
    courseMaterialId: number;
    applicationUserId: string;
    score: number;
    isPass: boolean;
    dateCreated?: Date | string | null;
    dateModified?: Date | string | null;
    // Navigation properties (optional)
    courseMaterialTitle?: string;
    studentName?: string;
    isCourseCompleted?: boolean;
}

export interface ActiveCourse {
    id: number;
    courseId: number;
    studentId: number;
    enrollmentDate: string;
    startDate: any;
    endDate: string;
    progress: number;
    status: string;
    completedModules: string[];
    currentModule: number;
    grades: any[];
    certificateId: number;
}
export interface userDto {
    id: string;
    idNumber: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    dateOfBirth: string;
    email: string;
    password: string;
    registrationType: string;
    assistantName: string;
    psiraNumber: string;
    trainingCenterName: string;
    isActive: boolean;
    dateCreated: string;
    dateModified: string;
}

export interface AddStudentQuizAttemptDto {
    courseMaterialId: number;
    applicationUserId: number;
    score: number;
    isPass: boolean;
}

export interface CentreCourse {
    courseId: number;
    tittle: string;
    description: string;
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    completionRate: number;
    averageProgress: number;
    modulesCount: number;
    duration: number;
    status: string;
    isActive: boolean;
}

export interface StudentDetailsModel {
    enrollments: TrainingCentreEnrollmentsModel[];
    userId: string;
    fullName: string;
    psiraNo?: string;
    coursesCount: number;
}
