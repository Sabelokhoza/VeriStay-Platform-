import { Student } from '@/types/student';

export interface StudentEnrollment {
    id: string;
    studentId: number;
    courseId: string;
    courseName: string;
    courseDescription: string;
    courseGrade: 'A' | 'B' | 'C' | 'D' | 'E';
    status: 'active' | 'completed' | 'dropped';
    progress: number;
    currentModule: string;
    startDate: Date;
    lastAccessDate: Date;
    completedModules: string[];
    grades: { moduleId: string; moduleName: string; grade: number }[];
    certificateId?: string;
}

export interface StudentCertification {
    id: string;
    studentId: number;
    courseId: string;
    courseName: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    issueDate: Date;
    expiryDate: Date;
    status: 'active' | 'expired' | 'revoked';
    skills: string[];
}

// PSIRA Course Content
const PSIRA_COURSES = {
    A: {
        modules: [
            'Strategic Security Management',
            'Advanced Risk Assessment',
            'Crisis Management',
            'Leadership in Security Operations',
            'Security Technology Integration',
        ],
        skills: [
            'Leadership',
            'Risk Management',
            'Crisis Response',
            'Team Management',
            'Strategic Planning',
        ],
    },
    B: {
        modules: [
            'Advanced Security Operations',
            'Emergency Response Protocols',
            'Investigation Techniques',
            'Access Control Management',
        ],
        skills: [
            'Advanced Security Operations',
            'Emergency Response',
            'Investigation',
            'Access Control',
        ],
    },
    C: {
        modules: [
            'Patrol Management',
            'Investigation Basics',
            'Report Writing',
            'Security Systems Overview',
        ],
        skills: ['Patrol Procedures', 'Basic Investigation', 'Report Writing', 'Security Systems'],
    },
    D: {
        modules: [
            'Security Fundamentals',
            'Communication in Security',
            'Basic Report Writing',
            'Security Procedures',
        ],
        skills: ['Basic Security Procedures', 'Communication Skills', 'Basic Report Writing'],
    },
    E: {
        modules: ['Introduction to Security', 'Basic Communication', 'Observation Skills Training'],
        skills: ['Security Awareness', 'Basic Communication', 'Observation Skills'],
    },
};

export const mockStudentEnrollments: StudentEnrollment[] = [
    {
        id: 'enr1',
        studentId: 1,
        courseId: 'psira-a1',
        courseName: 'Strategic Security Management and Leadership',
        courseDescription:
            'Top-level security officer training for high-risk environments and management positions',
        courseGrade: 'A',
        status: 'active',
        progress: 75,
        currentModule: PSIRA_COURSES.A.modules[3],
        startDate: new Date('2025-01-15'),
        lastAccessDate: new Date('2025-08-01'),
        completedModules: PSIRA_COURSES.A.modules.slice(0, 3),
        grades: [
            { moduleId: 'mod1', moduleName: PSIRA_COURSES.A.modules[0], grade: 92 },
            { moduleId: 'mod2', moduleName: PSIRA_COURSES.A.modules[1], grade: 88 },
            { moduleId: 'mod3', moduleName: PSIRA_COURSES.A.modules[2], grade: 90 },
        ],
    },
    {
        id: 'enr2',
        studentId: 1,
        courseId: 'PSIRA Grade B',
        courseName: 'Advanced Security Operations and Emergency Response',
        courseDescription: 'Advanced security officer training for specialized security operations',
        courseGrade: 'B',
        status: 'completed',
        progress: 100,
        currentModule: PSIRA_COURSES.B.modules[3],
        startDate: new Date('2024-11-01'),
        lastAccessDate: new Date('2025-02-01'),
        completedModules: PSIRA_COURSES.B.modules,
        grades: PSIRA_COURSES.B.modules.map((module, index) => ({
            moduleId: `mod${index + 1}`,
            moduleName: module,
            grade: 85 + Math.floor(Math.random() * 10),
        })),
        certificateId: 'cert1',
    },
];

export const mockStudentCertifications: StudentCertification[] = [
    {
        id: 'cert1',
        studentId: 1,
        courseId: 'psira-b1',
        courseName: 'Advanced Security Operations and Emergency Response',
        grade: 'B',
        issueDate: new Date('2025-02-01'),
        expiryDate: new Date('2026-02-01'),
        status: 'active',
        skills: PSIRA_COURSES.B.skills,
    },
];

export const mockStudents: Student[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+27 71 234 5678',
        status: 'Active',
        currentGrade: 'A',
        enrolledCourseId: 'course1',
        psiraNumber: 'PSR123456',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '+27 82 345 6789',
        status: 'Active',
        currentGrade: 'B',
        enrolledCourseId: 'course2',
        psiraNumber: 'PSR234567',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
    },
    {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phoneNumber: '+27 83 456 7890',
        status: 'Inactive',
        currentGrade: 'C',
        psiraNumber: 'PSR345678',
        createdAt: new Date('2025-01-03'),
        updatedAt: new Date('2025-01-03'),
    },
    {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah@example.com',
        phoneNumber: '+27 84 567 8901',
        status: 'Active',
        currentGrade: 'B',
        enrolledCourseId: 'course3',
        psiraNumber: 'PSR456789',
        createdAt: new Date('2025-01-04'),
        updatedAt: new Date('2025-01-04'),
    },
    {
        id: 5,
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@example.com',
        phoneNumber: '+27 85 678 9012',
        status: 'Active',
        currentGrade: 'A',
        enrolledCourseId: 'course1',
        psiraNumber: 'PSR567890',
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-05'),
    },
];
