'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Award,
    BookOpen,
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
import { notFound } from 'next/navigation';
import { mockStudentCertifications, mockStudentEnrollments, mockStudents } from '../data';
import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';

export default async function StudentDetailsPage({
    params,
}: {
    params: Promise<{ studentId: string }>;
}) {
    // Await the params promise
    const { studentId: studentIdString } = await params;

    // Find student data
    console.error(`Student with ID ${studentIdString} not found`);

    const studentId = parseInt(studentIdString);
    const student = mockStudents.find((s) => s.id === studentId);

    if (!student) {
        notFound();
    }

    // Get student's enrollments and certifications
    const enrollments = mockStudentEnrollments.filter((e) => e.studentId === studentId);
    const certifications = mockStudentCertifications.filter((c) => c.studentId === studentId);

    // Calculate statistics
    const activeCourses = enrollments.filter((e) => e.status === 'active').length;
    const completedCourses = enrollments.filter((e) => e.status === 'completed').length;
    const averageProgress =
        enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length;
    const totalCompletedModules = enrollments.reduce(
        (acc, curr) => acc + curr.completedModules.length,
        0
    );

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
                            variant={student.status === 'Active' ? 'default' : 'secondary'}
                            className="capitalize "
                        >
                            {student.status}
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
                        title={'Completed Modules'}
                        totalNumber={totalCompletedModules}
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
                        totalNumber={certifications.length}
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
                        <Card key={enrollment.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Course {enrollment.courseId}</CardTitle>
                                    <Badge
                                        variant={
                                            enrollment.status === 'active' ? 'default' : 'secondary'
                                        }
                                        className="capitalize"
                                    >
                                        {enrollment.status}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Started {enrollment.startDate.toLocaleDateString()}
                                </CardDescription>
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
                                                {enrollment.completedModules.length}
                                            </p>
                                        </div>
                                    </div>

                                    {enrollment.grades.length > 0 && (
                                        <div>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Module Grades
                                            </p>
                                            <div className="space-y-2">
                                                {enrollment.grades.map((grade) => (
                                                    <div
                                                        key={grade.moduleId}
                                                        className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-1 text-sm"
                                                    >
                                                        <span>{grade.moduleName}</span>
                                                        <span className="font-medium">
                                                            {grade.grade}%
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/courses/${enrollment.courseId}/content/${enrollment.currentModule}`}
                                            >
                                                View Content
                                            </Link>
                                        </Button>
                                        {enrollment.certificateId && (
                                            <Button variant="secondary" asChild>
                                                <Link
                                                    href={`/certifications/${enrollment.certificateId}`}
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
            {certifications.length > 0 && (
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
                                        <CardTitle>PSiRA Grade {cert.grade}</CardTitle>
                                        <Badge
                                            variant={
                                                cert.status === 'active' ? 'default' : 'secondary'
                                            }
                                            className="capitalize"
                                        >
                                            {cert.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>Course {cert.courseId}</CardDescription>
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
                                                    <p className="font-medium">
                                                        {cert.issueDate.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Expiry Date
                                                    </p>
                                                    <p className="font-medium">
                                                        {cert.expiryDate.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                                <ListChecks className="h-4 w-4 text-muted-foreground" />
                                                Acquired Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
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
                                            </div>
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
