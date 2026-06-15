'use client';

import { Role, useUser } from '@/hooks/use-user';
import { AdminDashboard } from './admin-dashboard';
import { PartnerDashboard } from './partner-dashboard';
import { StudentDashboard } from './student-dashboard';

export default function DashboardPage() {
    const user = useUser();

    console.log('User Role in DashboardPage:', user.role);

    if (user.role === Role.Student) return <StudentDashboard />;
    if (user.role === Role.Partner) return <PartnerDashboard />;
    if (user.role === Role.Admin) return <AdminDashboard />;
}
