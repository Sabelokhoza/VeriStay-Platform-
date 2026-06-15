'use client';

import { useGetCentreDashboardDataQuery } from '@/app/errors/trainingCenterApi';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setSelectedCentreId } from '@/app/store/trainingCentreSlice';
import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, BookOpen, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';
import { Key } from 'react';
import Loading from '../loading';
import BaseCard from '@/components/shared/base-card';
import { DataTable } from '@/components/ui/data-table';
import { mockcolumns } from './partner-mock';
import { useStudentCoursesData } from '../data';

export function PartnerDashboard() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const { data, error, isLoading } = useGetCentreDashboardDataQuery(userId);
    const { courses, isLoading: refetchLoading, refetch: refetchData } = useStudentCoursesData();

    if (isLoading || refetchLoading) return <Loading />;
    if (error) return <div>Error loading dashboard data</div>;

    const dashboardData = data.data;

    dispatch(setSelectedCentreId(dashboardData.centreId));

    return (
        <div className="space-y-8">
            <Header
                title={'Dashboard'}
                description={'Dashboard overview of your training center'}
            />
            {/* Stats Overview */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                <EnrollmentCard
                    title={'Active Courses'}
                    totalNumber={dashboardData.activeCourses}
                    icon={BookOpen}
                    color={'blue'}
                />
                <EnrollmentCard
                    title={'Total Students'}
                    totalNumber={dashboardData.totalStudents}
                    icon={Users}
                    color={'green'}
                />
                <EnrollmentCard
                    title={'Certifications'}
                    totalNumber={dashboardData.certifications}
                    icon={GraduationCap}
                    color={'yellow'}
                />
                <EnrollmentCard
                    title={'Pending Reviews'}
                    totalNumber={dashboardData.pendingReviews}
                    icon={AlertCircle}
                    color={'red'}
                />
            </div>

            {/* Active Courses */}
            <section>
                <BaseCard>
                    <div className="mb-4 flex items-center justify-between">
                        <Subheading
                            title={'Active Courses'}
                            description={'Manage and track your active courses.'}
                        />
                        <Link
                            href="/courses"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Button>View all courses</Button>
                        </Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {dashboardData.courses.map(
                            (course: {
                                courseId?: Key | null;
                                tittle: string;
                                totalEnrollments: number;
                                averageProgress?: number | null;
                                completionRate?: number | null;
                            }) => (
                                <Card key={course.courseId}>
                                    <CardHeader>
                                        <CardTitle>{course.tittle}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between text-sm">
                                                    <span>Enrolled Students</span>
                                                    <span>{course.totalEnrollments}</span>
                                                </div>
                                                <Progress value={course.averageProgress ?? 0} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Average Progress
                                                    </p>
                                                    <p className="font-medium">
                                                        {course.averageProgress ?? 0}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Completion Rate
                                                    </p>
                                                    <p className="font-medium">
                                                        {course.completionRate ?? 0}%
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/courses/${course.courseId}`}
                                                className="inline-block text-sm text-primary hover:underline"
                                            >
                                                <Button>View Details</Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>
                </BaseCard>
            </section>

            {/* Pending Reviews */}
            <section>
                <Subheading
                    title={'Application Updates'}
                    description={'Notifications and updates on course and assessments.'}
                />
                <BaseCard>
                    <DataTable columns={mockcolumns} data={dashboardData.courses} />
                </BaseCard>
            </section>
        </div>
    );
}
