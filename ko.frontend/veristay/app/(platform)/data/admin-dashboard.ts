import { AdminDashboardData } from '../../../types/dashboard';

export const adminDashboardData: AdminDashboardData = {
    stats: {
        trainingPartners: {
            count: 12,
            label: '2 pending approval',
        },
        totalUsers: {
            count: 1234,
            label: '+89 this month',
        },
        activeCourses: {
            count: 45,
            label: 'Across all partners',
        },
        complianceIssues: {
            count: 3,
            label: 'Require attention',
        },
    },
    trainingPartners: [
        {
            id: '1',
            name: 'Security Academy',
            stats: {
                activeStudents: 156,
                activeCourses: 4,
                complianceScore: '98%',
                lastAudit: '2 weeks ago',
            },
        },
        {
            id: '2',
            name: 'Elite Guards Training',
            stats: {
                activeStudents: 89,
                activeCourses: 3,
                complianceScore: '95%',
                lastAudit: '1 month ago',
            },
        },
    ],
    complianceIssues: [
        {
            id: '1',
            title: 'Course Material Update Required',
            partner: 'Security Academy - PSiRA Grade E',
        },
        {
            id: '2',
            title: 'Instructor Certification Expiring',
            partner: 'Elite Guards Training',
        },
    ],
    pendingApprovals: [
        {
            id: '1',
            title: 'New Training Partner Application',
            organization: 'Secure Solutions Academy',
        },
        {
            id: '2',
            title: 'Course Certification Request',
            organization: 'Elite Guards - Advanced Security',
        },
    ],
};
