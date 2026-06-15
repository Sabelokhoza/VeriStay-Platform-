'use client';

import { Role, useUser } from '@/hooks/use-user';
import AdminEnrollmentPage from './admin-enrollment';
import PartnerEnrollmentPage from './partner-enrollment';
import StudentEnrollmentPage from './student-enrollment';

export default function EnrollmentPage() {
    const user = useUser();
    console.log('User Role in EnrollmentPage:', user.role);

    if (user.role === Role.Student) return <StudentEnrollmentPage />;
    if (user.role === Role.Partner) return <PartnerEnrollmentPage />;
    if (user.role === Role.Admin) return <AdminEnrollmentPage />;
}
