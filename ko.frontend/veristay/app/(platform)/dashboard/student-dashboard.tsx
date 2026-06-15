'use client';

import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useStudentCoursesData, useStudentDashboardData } from '../data';
import Loading from '../loading';

export function StudentDashboard() {
    const { data, error, loading } = useStudentDashboardData();
    const { courses, isLoading: refetchLoading, refetch: refetchData } = useStudentCoursesData();

    if (loading || refetchLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading dashboard: {JSON.stringify(error)}</div>;
    }

    console.log('Dashboard data:', data);

    return (
        <div className="space-y-8">
            <Header title={'Application Dashboard'} description={'Welcome back!'} />
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <EnrollmentCard
                    title="Courses Enrolled"
                    totalNumber={data?.stats.enrolledCourses.count}
                    icon={BookOpen}
                    color="blue"
                />
                <EnrollmentCard
                    title="Courses Completed"
                    totalNumber={data?.stats.certifications.count}
                    icon={Trophy}
                    color="green"
                />
            </div>

            {/* Active Course */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <Subheading
                        title={'Your Learning Journey'}
                        description={'Track your progress and stay motivated!'}
                    />
                    <Link
                        href="/courses"
                        className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        View all courses
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
                {data?.activeCourse ? (
                    <Card className="group hover:shadow-lg transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {data.activeCourse.title}
                                <span className="text-sm font-normal text-muted-foreground">
                                    {data.activeCourse.progress}% Complete
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Progress
                                    value={data.activeCourse.progress}
                                    className="h-2 transition-all group-hover:h-3"
                                />
                                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">Next lesson</p>
                                        <p>{data.activeCourse.nextLesson}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">Due date</p>
                                        <p>{data.activeCourse.dueDate}</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/courses/${data?.activeCourse?.id}/content/${data.activeCourse?.nextLessonId}`}
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    Continue Learning
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-dashed border-2">
                        <CardContent className="pt-6 text-center">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Active Course</h3>
                            <p className="text-muted-foreground mb-4">
                                Start your learning journey by enrolling in a course
                            </p>
                            <Link
                                href="/enrollments"
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Explore Courses
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </section>

            <section>
                <Subheading
                    title={'Recent Updates'}
                    description={'Stay updated with the latest changes and announcements.'}
                />
            </section>
        </div>
    );
}
