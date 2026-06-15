'use client';
import { Role, useUser } from '@/hooks/use-user';
import AdminCoursesPage from './admin-courses';
import PartnerCoursesPage from './partner-courses';
import StudentCoursesPage from './student-courses';

export default function CoursesPage() {
    const user = useUser();
    if (user.role === Role.Student) return <StudentCoursesPage />;
    if (user.role === Role.Partner) return <PartnerCoursesPage />;
    if (user.role === Role.Admin) return <AdminCoursesPage />;
}
