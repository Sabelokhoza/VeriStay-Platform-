import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import { Clock, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function PartnerManagePage() {
    return (
        <div className="space-y-8">
            <Header title={'Manage'} description={'Manage your courses and enrollments.'} />
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/manage/compliance">
                    <EnrollmentCard
                        title={'Compliance'}
                        totalNumber={5}
                        icon={Users}
                        color={'blue'}
                    />
                </Link>
                <Link href="/manage/students">
                    <EnrollmentCard
                        title={'Students'}
                        totalNumber={3}
                        icon={Shield}
                        color={'green'}
                    />
                </Link>
                <Link href="/manage/reports">
                    <EnrollmentCard
                        title={'reports'}
                        totalNumber={2}
                        icon={Clock}
                        color={'yellow'}
                    />
                </Link>
            </div>
        </div>
    );
}
