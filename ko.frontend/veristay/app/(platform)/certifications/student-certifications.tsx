'use client';

import { useGetUserCertificatesDashboardDataQuery } from '@/app/errors/studentApi';
import { useAppSelector } from '@/app/store/store';
import CertificationCard from '@/components/certification/certification-card';
import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, ShieldCheck, XCircle } from 'lucide-react';
import Loading from '../loading';
import type { Certification } from './data/mock';

const StudentCertifications = () => {
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const {
        data: dashboardData,
        isLoading,
        isError,
    } = useGetUserCertificatesDashboardDataQuery(userId);
    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <div>Error loading certifications</div>;
    }

    console.log('Dashboard Data:', dashboardData);

    // Filter certifications for current student
    const studentCertifications = dashboardData?.data?.certificates || [];

    // Calculate statistics
    const activeCount = dashboardData?.data?.active || 0;
    const expiringSoonCount = dashboardData?.data?.expiring || 0;

    const expiredCount = dashboardData?.data?.expired || 0;
    const pendingCount = studentCertifications.filter(
        (cert: Certification) => cert.status === 'pending'
    ).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <Header
                title="My Certifications"
                description="View and manage your PSiRA certifications"
            />
            <div className="grid gap-4 md:grid-cols-4">
                {/* Statistics Cards */}
                <EnrollmentCard
                    title="Active Certificates"
                    totalNumber={activeCount}
                    icon={ShieldCheck}
                    color="green"
                />
                <EnrollmentCard
                    title="Expiring Soon"
                    totalNumber={expiringSoonCount}
                    icon={AlertCircle}
                    color="yellow"
                />
                <EnrollmentCard
                    title="Expired"
                    totalNumber={expiredCount}
                    icon={XCircle}
                    color="red"
                />
                <EnrollmentCard
                    title="Pending Review"
                    totalNumber={pendingCount}
                    icon={Clock}
                    color="blue"
                />
            </div>

            {/* Certificates List */}
            <section>
                <Subheading
                    title={'Platform Certificates'}
                    description={'View and manage your certifications'}
                />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {studentCertifications.map((cert: Certification) => (
                        <CertificationCard key={cert.id} cert={cert} />
                    ))}
                </div>
            </section>

            {/* Official Certificates List */}
            <section>
                <Subheading
                    title={'Official PSIRA certificates'}
                    description={
                        'Certificates issued by the Private Security Industry Regulatory Authority (PSIRA)   '
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {studentCertifications.map((cert: Certification) => (
                        <CertificationCard key={cert.id} cert={cert} />
                    ))}
                </div>

                {studentCertifications.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                            <ShieldCheck className="h-12 w-12 mb-4 opacity-50" />
                            <h3 className="font-medium mb-2">No Certifications Found</h3>
                            <p className="text-sm">
                                You dont have any certifications yet. Complete your courses to earn
                                certificates.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
};

export default StudentCertifications;
