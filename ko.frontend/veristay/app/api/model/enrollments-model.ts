import { ActiveStatus } from './enums';

interface EnrollmentModel {
    id: string;
    studentId: string;
    courseId: string;
    startDate: string;
    endDate?: string;
    status: ActiveStatus;
    studentBillingItemId?: string;
}

export type { EnrollmentModel };
