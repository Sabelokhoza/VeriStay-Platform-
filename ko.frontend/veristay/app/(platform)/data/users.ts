export type User = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'student' | 'instructor' | 'admin';
    status: 'active' | 'inactive' | 'pending';
    profile: {
        phone?: string;
        address?: string;
        organization?: string;
        position?: string;
    };
    progress?: {
        coursesEnrolled: number;
        coursesCompleted: number;
        certificates: number;
    };
    enrolledCourses?: string[];
};

export const users: User[] = [
    {
        id: 'user1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/avatars/john-doe.jpg',
        role: 'student',
        status: 'active',
        profile: {
            phone: '+1 (555) 123-4567',
            address: '123 Main St, Anytown, USA 12345',
            organization: 'ABC Corporation',
            position: 'Safety Coordinator',
        },
        progress: {
            coursesEnrolled: 3,
            coursesCompleted: 1,
            certificates: 1,
        },
        enrolledCourses: ['course1', 'course2'],
    },
    {
        id: 'user2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: '/avatars/jane-smith.jpg',
        role: 'instructor',
        status: 'active',
        profile: {
            phone: '+1 (555) 987-6543',
            address: '456 Oak Ave, Springfield, USA 54321',
            organization: 'Training Academy Inc.',
            position: 'Senior Instructor',
        },
        progress: {
            coursesEnrolled: 0,
            coursesCompleted: 15,
            certificates: 8,
        },
    },
    {
        id: 'user3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        avatar: '/avatars/mike-johnson.jpg',
        role: 'admin',
        status: 'active',
        profile: {
            phone: '+1 (555) 246-8135',
            address: '789 Pine Rd, Capital City, USA 67890',
            organization: 'Training Platform Ltd.',
            position: 'Platform Administrator',
        },
    },
];
