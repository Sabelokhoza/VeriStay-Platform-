'use client';

import CourseCardActive from '@/components/course/course-card-active';
import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { CircleCheckBig, Clock, ShieldCheck, Trophy } from 'lucide-react';
import Loading from '../loading';
import { useStudentEnrollmentsQuery } from '@/app/errors/studentApi';
import { useAppSelector } from '@/app/store/store';

const StudentCoursesPage = () => {
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const { data: enrollmentsData, isLoading, error } = useStudentEnrollmentsQuery(userId);
    console.log('Sabelo Enrollments:', enrollmentsData);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading enrollments: {JSON.stringify(error)}</div>;
    }

    // Use the data from the new API
    const activeCourses = enrollmentsData?.data?.activeCourse
        ? [enrollmentsData.data.activeCourse]
        : [];

    return (
        <div className="space-y-8">
            <Header title={'Courses'} description={'Track your progress and continue learning'} />
            <section>
                <div className="grid gap-4 md:grid-cols-4">
                    <EnrollmentCard
                        title="Active courses"
                        totalNumber={activeCourses.length}
                        icon={ShieldCheck}
                        color={'green'}
                    />
                    <EnrollmentCard
                        title="Completed Modules"
                        totalNumber={activeCourses.reduce(
                            (acc, curr) => acc + curr.completedModules.length,
                            0
                        )}
                        icon={CircleCheckBig}
                        color={'blue'}
                    />
                    <EnrollmentCard
                        title="Certificates Earned"
                        totalNumber={enrollmentsData?.data?.certificationEarned || 0}
                        icon={Trophy}
                        color={'yellow'}
                    />
                    <EnrollmentCard
                        title="Average Progress"
                        totalNumber={Math.round(
                            enrollmentsData?.data?.averageProgress || 0
                        ).toPrecision(4)}
                        icon={Clock}
                        color={'red'}
                    />
                </div>
            </section>

            <section id="active-courses">
                <Subheading
                    title="Active Courses"
                    description="View the active courses you are currently enrolled in"
                />
                <CourseCardActive studentEnrollments={activeCourses[0]} />
            </section>
        </div>
    );
};

export default StudentCoursesPage;
