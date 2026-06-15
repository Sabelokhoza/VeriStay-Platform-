'use client';

import StudentBilling from './student-billing';
import PartnerBilling from './partner-billing';
import AdminBilling from './admin-billing';
import { Role, useUser } from '@/hooks/use-user';

export default function BillingPage() {
    const user = useUser();
    if (user.role === Role.Student) return <StudentBilling />;
    if (user.role === Role.Partner) return <PartnerBilling />;
    if (user.role === Role.Admin) return <AdminBilling />;
}
