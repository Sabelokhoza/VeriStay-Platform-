'use client';

import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Award,
    Calendar,
    CalendarClock,
    CheckCircle2,
    Clock,
    GraduationCap,
    ListChecks,
    Mail,
    Phone,
    Shield,
    Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useGetStudentInformationQuery } from '@/app/errors/trainingCenterApi';
import Loading from '@/app/(platform)/loading';

export default function StudentDetailsPage() {
    const params = useParams();
    const studentIdString = params.studentId as string;

    // Use RTK Query hook
    const { isLoading, data, error } = useGetStudentInformationQuery(studentIdString);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        console.error(`Error fetching student data:`, error);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Error loading student information</p>
            </div>
        );
    }

    // Find student data
    const studentPageData = data?.data;
    if (!studentPageData) {
        return notFound();
    }
    const student = studentPageData.profile;
    const enrollments = studentPageData.enrollments;
    const certifications = studentPageData.certificates;

    // Calculate statistics
    const completedCourses = studentPageData.summary.completedCourses;
    const averageProgress = studentPageData.summary.averageProgress;
    const activeCourses = studentPageData.summary.activeCourses;
    const completedCertifications = studentPageData.summary.completedCertificates;

    return (
        <div className="space-y-8">
            {/* Student Overview */}
            <section>
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Header
                                title={`${student.firstName} ${student.lastName}`}
                                description={'Student profile and progress overview'}
                            />
                        </div>
                        <Badge
                            variant={student.isActive ? 'default' : 'secondary'}
                            className="capitalize "
                        >
                            {student.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{student.phoneNumber}</span>
                        </div>
                        {student.psiraNumber && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Shield className="h-4 w-4 text-primary" />
                                <span>PSiRA: {student.psiraNumber}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <EnrollmentCard
                        title={'Average Progress'}
                        totalNumber={Math.round(averageProgress).toPrecision(4)}
                        icon={Clock}
                        color={'blue'}
                    />
                    <EnrollmentCard
                        title={'Active Courses'}
                        totalNumber={activeCourses}
                        icon={Trophy}
                        color={'yellow'}
                    />
                    <EnrollmentCard
                        title={'Completed Courses'}
                        totalNumber={completedCourses}
                        icon={GraduationCap}
                        color={'purple'}
                    />
                    <EnrollmentCard
                        title={'Certifications'}
                        totalNumber={completedCertifications}
                        icon={Shield}
                        color={'red'}
                    />
                </div>
            </section>

            {/* Course Progress */}
            <section>
                <Subheading
                    title={'Course Progress'}
                    description={"Track student's course completion"}
                />

                <div className="grid gap-6">
                    {enrollments.map((enrollment) => (
                        <Card key={enrollment.courseId}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Course {enrollment.courseName}</CardTitle>
                                    <Badge
                                        variant={enrollment.isCompleted ? 'default' : 'secondary'}
                                        className="capitalize"
                                    >
                                        {enrollment.isCompleted ? 'Completed' : 'In Progress'}
                                    </Badge>
                                </div>
                                <CardDescription>Started {enrollment.dateStarted}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span>Progress</span>
                                            <span className="text-muted-foreground">
                                                {enrollment.progress}%
                                            </span>
                                        </div>
                                        <Progress value={enrollment.progress} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Current Module</p>
                                            <p className="font-medium">
                                                {enrollment.currentModule}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Completed Modules
                                            </p>
                                            <p className="font-medium">
                                                {enrollment.completedModules}
                                            </p>
                                        </div>
                                    </div>

                                    {enrollment.studentModuleMarks && (
                                        <div>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Module Grades
                                            </p>
                                            <div className="space-y-2">
                                                {enrollment.studentModuleMarks.map((grade) => (
                                                    <div
                                                        key={grade.modeuleName}
                                                        className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-1 text-sm"
                                                    >
                                                        <span>{grade.modeuleName}</span>
                                                        <span className="font-medium">
                                                            {grade.moduleResult}%
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        {enrollment.courseId && (
                                            <Button variant="secondary" asChild>
                                                <Link
                                                    href={`/certifications/${enrollment.courseId}`}
                                                >
                                                    View Certificate
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Certifications */}
            {certifications && (
                <section>
                    <Subheading
                        title={'Certifications'}
                        description={"Student's earned certifications"}
                    />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {certifications.map((cert) => (
                            <Card key={cert.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{cert.title}</CardTitle>
                                        <Badge
                                            variant={
                                                cert.status === 'Valid' ? 'default' : 'secondary'
                                            }
                                            className="capitalize"
                                        >
                                            {cert.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>Course {cert.level}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Issue Date
                                                    </p>
                                                    <p className="font-medium">{cert.issueDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Expiry Date
                                                    </p>
                                                    <p className="font-medium">{cert.expiryDate}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                                <ListChecks className="h-4 w-4 text-muted-foreground" />
                                                Acquired Skills
                                            </h4>
                                            {/* <div className="flex flex-wrap gap-2">
                                                {cert.skills.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="outline"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div> */}
                                        </div>

                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/certifications/${cert.id}`}>
                                                <Award className="h-4 w-4 mr-2" />
                                                View Certificate
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
