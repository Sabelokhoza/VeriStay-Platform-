// Dashboard Models

export interface DashboardStat {
    count: number;
    label: string;
}

export interface StudentDashboardStats {
    enrolledCourses: DashboardStat;
    certifications: DashboardStat;
    achievements: DashboardStat;
}

export interface PartnerDashboardStats {
    activeCourses: DashboardStat;
    totalStudents: DashboardStat;
    certifications: DashboardStat;
    pendingReviews: DashboardStat;
}

export interface AdminDashboardStats {
    trainingPartners: DashboardStat;
    totalUsers: DashboardStat;
    activeCourses: DashboardStat;
    complianceIssues: DashboardStat;
}

export interface ActiveCourse {
    id: string;
    title: string;
    progress: number;
    nextLessonId: number;
    nextLesson: string;
    dueDate: string;
}

export interface PartnerCourse {
    id: string;
    title: string;
    enrolledStudents: number;
    averageProgress: number;
    completionRate: number;
}

export interface Certification {
    id: string;
    title: string;
    psiraNumber: string;
    issueDate: string;
    expiryDate: string;
    level: string;
    status: 'active' | 'expired' | 'pending';
}

export interface UpcomingAssessment {
    title: string;
    course: string;
    date: string;
    time: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    type:
        | 'module_completion'
        | 'course_completion'
        | 'streak'
        | 'assessment'
        | 'time_based'
        | 'special';
    icon: string;
    earnedDate: string;
    isNew?: boolean;
}

export interface PendingReview {
    id: string;
    title: string;
    student: string;
    course: string;
}

export interface TrainingPartner {
    id: string;
    name: string;
    stats: {
        activeStudents: number;
        activeCourses: number;
        complianceScore: string;
        lastAudit: string;
    };
}

export interface ComplianceIssue {
    id: string;
    title: string;
    partner: string;
}

export interface PendingApproval {
    id: string;
    title: string;
    organization: string;
}

export interface StudentDashboardData {
    stats: StudentDashboardStats;
    activeCourse?: ActiveCourse | null; // Changed from activeCourses array to single course
    certification?: Certification | null;
    upcomingAssessments: UpcomingAssessment[];
    achievements: Achievement[];
}

export interface PartnerDashboardData {
    stats: PartnerDashboardStats;
    courses: PartnerCourse[];
    pendingReviews: PendingReview[];
}

export interface AdminDashboardData {
    stats: AdminDashboardStats;
    trainingPartners: TrainingPartner[];
    complianceIssues: ComplianceIssue[];
    pendingApprovals: PendingApproval[];
}
