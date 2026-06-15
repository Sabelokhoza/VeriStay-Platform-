'use client';

import { Role, useUser } from '@/hooks/use-user';
import AdminManagePage from './admin-manage-page';
import PartnerManagePage from './partner-manage-page';
import StudentManagePage from './student-manage-page';

export default function page() {
    const user = useUser();
    if (user.role === Role.Student) return <StudentManagePage />;
    if (user.role === Role.Partner) return <PartnerManagePage />;
    if (user.role === Role.Admin) return <AdminManagePage />;
}
