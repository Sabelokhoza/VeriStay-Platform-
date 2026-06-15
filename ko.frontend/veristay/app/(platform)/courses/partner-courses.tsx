'use client';

import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import {
    BarChart,
    BookOpen,
    Boxes,
    CheckCircle,
    Component,
    GraduationCap,
    TrendingUp,
    Users,
} from 'lucide-react';
import { mockStudents } from '../billing/data';

import { enrollments } from '../data/enrollments';

import { CentreCourse } from '@/app/api/dtos/dtos';
import { useGetCentreCoursesDataQuery } from '@/app/errors/trainingCenterApi';
import { useAppSelector } from '@/app/store/store';
import CoursePartnerCard from '@/components/course/course-partner-card';
import Subheading from '@/components/shared/subheading';
import Loading from '../loading';
import { AddCourseModal } from './add-course-modal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useStudentCoursesData } from '../data';

const PartnerCoursesPage = () => {
    const selectedCentreId = useAppSelector((state) => state.trainingCentreStore?.selectedCentreId);
    const { courses, isLoading: refetchLoading, refetch: refetchData } = useStudentCoursesData();
    const { data, error, isLoading, refetch } = useGetCentreCoursesDataQuery(selectedCentreId);

    if (refetchLoading || isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading centre courses: {JSON.stringify(error)}</div>;
    }

    console.log('Centre Courses Data:', data);

    const centreData = data.data;

    // Calculate comprehensive statistics
    const totalCourses = centreData.totalCourses;
    const totalStudents = centreData.totalStudents;
    const activeStudents = centreData.activeStudents;
    const completedCourses = centreData.completedCourses;
    const averageProgress = centreData.averageProgress;
    const inActiveStudents = centreData.inActiveStudents;

    return (
        <div className="space-y-8">
            {/* Header */}
            <Header title="Courses" description="Manage courses for your institution" />
            <section>
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-2">
                    <EnrollmentCard
                        title={'Total Courses'}
                        totalNumber={totalCourses}
                        icon={BookOpen}
                        color={'blue'}
                    />
                    <EnrollmentCard
                        title={'Active Courses'}
                        totalNumber={activeStudents}
                        icon={GraduationCap}
                        color={'green'}
                    />
                    <EnrollmentCard
                        title={'Completed Courses'}
                        totalNumber={completedCourses}
                        icon={CheckCircle}
                        color={'yellow'}
                    />
                    <EnrollmentCard
                        title={'Average Progress'}
                        totalNumber={averageProgress}
                        icon={BarChart}
                        color={'red'}
                    />
                </div>

                <Subheading
                    title={'Student Statistics'}
                    description={'More insights into student performance and course engagement'}
                />
                <div className="grid gap-4 md:grid-cols-4 mb-2">
                    <EnrollmentCard
                        title={'Active Students'}
                        totalNumber={activeStudents}
                        icon={Users}
                        color={'green'}
                    />
                    <EnrollmentCard
                        title={'Inactive Students'}
                        totalNumber={inActiveStudents}
                        icon={TrendingUp}
                        color={'red'}
                    />
                    <EnrollmentCard
                        title={'Total Students'}
                        totalNumber={totalStudents}
                        icon={Boxes}
                        color={'blue'}
                    />
                    <EnrollmentCard
                        title={'Total Enrollments'}
                        totalNumber={centreData.totalEnrollments}
                        icon={Component}
                        color={'yellow'}
                    />
                </div>
            </section>

            {/* Course Management */}
            <section>
                <div>
                    <Header
                        title="Manage Courses"
                        description="Add, edit, and manage course details"
                    />
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between"></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">Course List</h3>
                                        <div className="flex flex-row items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                View and manage courses
                                            </p>
                                            <AddCourseModal
                                                onSuccess={() => {
                                                    refetch();
                                                    refetchData();
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {centreData.courses.map((course: CentreCourse) => (
                                            <CoursePartnerCard
                                                key={course.courseId}
                                                course={course}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default PartnerCoursesPage;
