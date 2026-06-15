'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { Badge, BookOpen, Clock } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { ActiveCourse } from '@/app/api/dtos/dtos';
import { useAppSelector } from '@/app/store/store';

const CourseCardActive = ({ studentEnrollments }: { studentEnrollments: ActiveCourse }) => {
    const courses = useAppSelector((state) => state.coursesStore.courses);

    // Check if enrollment exists and is active
    if (!studentEnrollments) {
        return <div className="text-center py-8 text-muted-foreground">No active course found</div>;
    }

    console.log('Student Enrollments:', studentEnrollments);
    console.log('All Courses:', courses);

    const course = courses.find((c) => c.id == studentEnrollments.courseId);

    if (!course) {
        console.warn('Course not found for enrollment:', studentEnrollments);
        return (
            <div className="text-center py-8 text-muted-foreground">
                Course information not available
            </div>
        );
    }

    console.log('Course for Enrollment:', course);

    const currentModule = course.modules.find((m) => m.id == studentEnrollments.currentModule);

    if (!currentModule) {
        console.warn('Current module not found:', studentEnrollments.currentModule);
        return (
            <div className="text-center py-8 text-muted-foreground">
                Module information not available
            </div>
        );
    }

    console.log('Current Module:', currentModule);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Link href={`/courses/${course.id}`} className="hover:underline">
                            <CardTitle>{course.title}</CardTitle>
                        </Link>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground w-[90%] line-clamp-2">
                            {course.description}
                        </p>
                        <div className="p-2 rounded bg-green-100">
                            <Badge className="text-green-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm text-primary">
                                <span>Overall Progress</span>
                                <span>{studentEnrollments.progress}%</span>
                            </div>
                            <Progress value={studentEnrollments.progress} />
                        </div>

                        <div className="space-y-2">
                            <Link
                                href={`/courses/${course.id}/content/${currentModule.id}`}
                                className="hover:underline"
                            >
                                <h3 className="text-sm font-medium">
                                    Current Module: {currentModule.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                {currentModule.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                {course.modules.length} Modules
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {course.duration}
                            </div>
                        </div>

                        {studentEnrollments.grades && studentEnrollments.grades.length > 0 && (
                            <div className="rounded-lg bg-muted p-4">
                                <h4 className="mb-2 text-sm font-medium">Latest Assessment</h4>
                                <p className="text-sm font-medium">
                                    Grade: {studentEnrollments.grades.slice(-1)[0].grade}%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {studentEnrollments.grades.slice(-1)[0].feedback}
                                </p>
                            </div>
                        )}

                        <Link
                            href={`/courses/${course.id}/content/${studentEnrollments.currentModule}`}
                        >
                            <Button className="w-full">Continue Learning</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseCardActive;
