'use client';

import { useAppSelector } from '@/app/store/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, Upload } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock assignments data
const mockAssignments = [
    {
        id: '1',
        title: 'Security Protocol Analysis',
        description: 'Analyze and document the security protocols discussed in Module 1.',
        dueDate: '2024-03-20T23:59:59Z',
        moduleId: 'module-1',
        status: 'pending',
        grade: null,
    },
    {
        id: '2',
        title: 'Practical Exercise Report',
        description: 'Submit a detailed report of the practical exercise completed in Module 2.',
        dueDate: '2024-03-25T23:59:59Z',
        moduleId: 'module-2',
        status: 'submitted',
        grade: null,
    },
    {
        id: '3',
        title: 'Final Assessment',
        description: 'Complete the final assessment covering all course materials.',
        dueDate: '2024-04-01T23:59:59Z',
        moduleId: 'module-3',
        status: 'graded',
        grade: 'A',
    },
];

export default async function CourseAssignmentsPage({
    params,
}: {
    params: Promise<{ courseId: number }>;
}) {
    const { courseId } = await params;
    const courses = useAppSelector((state) => state.coursesStore.courses);
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
        notFound();
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline">Pending</Badge>;
            case 'submitted':
                return <Badge variant="secondary">Submitted</Badge>;
            case 'graded':
                return <Badge variant="default">Graded</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Course Assignments</h1>
                <Link href={`/courses/${course.id}`}>
                    <Button variant="outline">Back to Course</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {mockAssignments.map((assignment) => (
                    <Card key={assignment.id} className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold">{assignment.title}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {assignment.description}
                                    </p>
                                </div>
                                {getStatusBadge(assignment.status)}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </div>
                                {assignment.grade && (
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Grade: {assignment.grade}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-4">
                                {assignment.status === 'pending' && (
                                    <Button>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Submit Assignment
                                    </Button>
                                )}
                                {assignment.status === 'submitted' && (
                                    <Button variant="outline" disabled>
                                        Submitted
                                    </Button>
                                )}
                                {assignment.status === 'graded' && (
                                    <Button variant="outline">View Feedback</Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
