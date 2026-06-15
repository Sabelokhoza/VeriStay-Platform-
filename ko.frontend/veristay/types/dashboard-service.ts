import {
    StudentDashboardData,
    PartnerDashboardData,
    AdminDashboardData,
    DashboardStat,
    ActiveCourse,
    PartnerCourse,
    Certification,
    UpcomingAssessment,
    PendingReview,
    TrainingPartner,
    ComplianceIssue,
    PendingApproval,
} from './dashboard';

// Service interfaces for backend operations
export interface DashboardService {
    getStudentDashboard(userId: string): Promise<StudentDashboardData>;
    getPartnerDashboard(partnerId: string): Promise<PartnerDashboardData>;
    getAdminDashboard(): Promise<AdminDashboardData>;
}

export interface DashboardRepository {
    // Student dashboard queries
    getStudentStats(userId: string): Promise<{
        enrolledCoursesCount: number;
        certificationsCount: number;
        achievementsCount: number;
    }>;
    getStudentActiveCourses(userId: string): Promise<ActiveCourse[]>;
    getStudentCertification(userId: string): Promise<Certification | null>;
    getStudentUpcomingAssessments(userId: string): Promise<UpcomingAssessment[]>;

    // Partner dashboard queries
    getPartnerStats(partnerId: string): Promise<{
        activeCoursesCount: number;
        totalStudentsCount: number;
        certificationsCount: number;
        pendingReviewsCount: number;
    }>;
    getPartnerCourses(partnerId: string): Promise<PartnerCourse[]>;
    getPartnerPendingReviews(partnerId: string): Promise<PendingReview[]>;

    // Admin dashboard queries
    getAdminStats(): Promise<{
        trainingPartnersCount: number;
        totalUsersCount: number;
        activeCoursesCount: number;
        complianceIssuesCount: number;
    }>;
    getTrainingPartners(): Promise<TrainingPartner[]>;
    getComplianceIssues(): Promise<ComplianceIssue[]>;
    getPendingApprovals(): Promise<PendingApproval[]>;
}

// Database entity interfaces (for ORM mapping)
export interface DashboardCourseEntity {
    id: string;
    title: string;
    partnerId?: string;
    enrolledStudents?: number;
    averageProgress?: number;
    completionRate?: number;
    progress?: number;
    nextLesson?: string;
    dueDate?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DashboardCertificationEntity {
    id: string;
    userId: string;
    title: string;
    psiraNumber: string;
    issueDate: Date;
    expiryDate: Date;
    level: string;
    status: 'active' | 'expired' | 'pending';
    createdAt: Date;
    updatedAt: Date;
}

export interface DashboardAssessmentEntity {
    id: string;
    title: string;
    courseId: string;
    userId: string;
    scheduledDate: Date;
    scheduledTime: string;
    status: 'scheduled' | 'completed' | 'pending';
    createdAt: Date;
    updatedAt: Date;
}

export interface DashboardReviewEntity {
    id: string;
    title: string;
    studentId: string;
    courseId: string;
    partnerId: string;
    status: 'pending' | 'reviewing' | 'completed';
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface DashboardPartnerEntity {
    id: string;
    name: string;
    activeStudents: number;
    activeCourses: number;
    complianceScore: number;
    lastAuditDate: Date;
    status: 'active' | 'pending' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
}

export interface DashboardComplianceEntity {
    id: string;
    title: string;
    partnerId: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved';
    reportedAt: Date;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface DashboardApprovalEntity {
    id: string;
    title: string;
    organizationId: string;
    type: 'partner-application' | 'course-certification' | 'instructor-certification';
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewerId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Re-export dashboard types for convenience
export type {
    StudentDashboardData,
    PartnerDashboardData,
    AdminDashboardData,
    DashboardStat,
    ActiveCourse,
    PartnerCourse,
    Certification,
    UpcomingAssessment,
    PendingReview,
    TrainingPartner,
    ComplianceIssue,
    PendingApproval,
};
