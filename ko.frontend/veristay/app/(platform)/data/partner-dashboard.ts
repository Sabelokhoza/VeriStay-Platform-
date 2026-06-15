import { PartnerDashboardData } from '../../../types/dashboard';

export const partnerDashboardData: PartnerDashboardData = {
    stats: {
        activeCourses: {
            count: 3,
            label: '2 in draft',
        },
        totalStudents: {
            count: 128,
            label: '+12 this month',
        },
        certifications: {
            count: 45,
            label: 'Issued this month',
        },
        pendingReviews: {
            count: 8,
            label: 'Assessments to review',
        },
    },
    courses: [
        {
            id: '1',
            title: 'PSiRA Grade E Training',
            enrolledStudents: 156,
            averageProgress: 78,
            completionRate: 92,
        },
        {
            id: '2',
            title: 'PSiRA Grade D Training',
            enrolledStudents: 89,
            averageProgress: 65,
            completionRate: 88,
        },
        {
            id: '3',
            title: 'PSiRA Grade C Training',
            enrolledStudents: 45,
            averageProgress: 42,
            completionRate: 85,
        },
    ],
    pendingReviews: [
        {
            id: '1',
            title: 'Practical Assessment Review',
            student: 'John Doe',
            course: 'PSiRA Grade E',
        },
        {
            id: '2',
            title: 'Theory Test Submission',
            student: 'Mary Smith',
            course: 'PSiRA Grade D',
        },
    ],
};
