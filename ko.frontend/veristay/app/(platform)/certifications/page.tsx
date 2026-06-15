'use client';

import { Role, useUser } from '@/hooks/use-user';
import AdminCertifications from './admin-certifications';
import PartnerCertifications from './partner-certifications';
import StudentCertifications from './student-certifications';

export default function CertificationsPage() {
    const user = useUser();

    if (user.role === Role.Student) return <StudentCertifications />;
    if (user.role === Role.Partner) return <PartnerCertifications />;
    if (user.role === Role.Admin) return <AdminCertifications />;
}
