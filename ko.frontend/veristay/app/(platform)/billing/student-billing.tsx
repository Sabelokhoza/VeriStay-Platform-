'use client';
import { useGetStudentBillingPageInfoQuery, useGetUserByIdQuery } from '@/app/errors/studentApi';
import { useAppSelector } from '@/app/store/store';
import BillingStudentCard from '@/components/billing/billing-student-card';
import BillingStudentInfo from '@/components/billing/billing-student-info';
import Header from '@/components/shared/header';
import { useStudentUser } from '@/hooks/use-user';
import Loading from '../loading';

const StudentBilling = () => {
    const student = useStudentUser();
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const { data, isLoading, error } = useGetUserByIdQuery(userId ?? '', {
        skip: !userId,
    });
    const {
        isLoading: isBillingLoading,
        data: billingData,
        error: billingError,
        refetch: refetchBilling,
    } = useGetStudentBillingPageInfoQuery(userId ?? '', {
        skip: !userId,
    });

    if (isLoading || isBillingLoading || !userId) {
        return <Loading />;
    }
    if (error || !data || billingError || !billingData) {
        return <div>Error loading student data</div>;
    }

    const studentBillingInfo = billingData.data;

    return (
        <div className="space-y-8">
            <section>
                <Header
                    title={'Billing'}
                    description={'View your course payments and download invoices'}
                />
                <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                    <BillingStudentCard student={studentBillingInfo?.student} />
                    <BillingStudentInfo
                        student={studentBillingInfo?.student}
                        coursePayments={studentBillingInfo?.enrollments}
                        onPaymentSuccess={refetchBilling}
                    />
                </div>
            </section>
        </div>
    );
};

export default StudentBilling;
