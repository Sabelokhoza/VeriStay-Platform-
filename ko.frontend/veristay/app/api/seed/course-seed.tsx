import { CourseInformation } from '../model/course-model';

export const courseSeedData: CourseInformation[] = [
    {
        id: '1',
        courseId: 'A',
        title: 'PSIRA Grade A',
        description:
            'Training for supervisory and management roles in the security industry, focusing on leadership and operational oversight.',
        status: true,
        totalEnrollments: 150,
        totalActiveEnrollments: 100,
        totalCompleted: 50,
        totalCompletedPercentage: 33.3,
        totalModules: 12,
        averageProgress: 60.0,
        courseDuration: 40,
    },
    {
        id: '2',
        courseId: 'E',
        title: 'PSIRA Grade E',
        description:
            'Training for entry-level security officers, covering basic principles and responsibilities.',
        status: false,
        totalEnrollments: 200,
        totalActiveEnrollments: 120,
        totalCompleted: 80,
        totalCompletedPercentage: 40.0,
        totalModules: 8,
        averageProgress: 55.0,
        courseDuration: 30,
    },
    {
        id: '3',
        courseId: 'D',
        title: 'PSIRA Grade D',
        description:
            'Training for security officers, focusing on access control, patrolling, and incident response.',
        status: true,
        totalEnrollments: 180,
        totalActiveEnrollments: 90,
        totalCompleted: 90,
        totalCompletedPercentage: 50.0,
        totalModules: 10,
        averageProgress: 70.0,
        courseDuration: 35,
    },
];
