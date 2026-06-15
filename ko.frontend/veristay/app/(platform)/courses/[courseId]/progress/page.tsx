'use client';

import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/app/store/store';

export default async function CourseProgressPage({
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

    // Mock progress data - this should come from the user's actual progress
    const mockProgress = {
        completedModules: [1, 2],
        currentModule: 3,
        overallProgress: 40,
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Course Progress</h1>
                <Link href={`/courses/${course.id}`}>
                    <Button variant="outline">Back to Course</Button>
                </Link>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Overall Progress</h2>
                        <span className="text-sm text-muted-foreground">
                            {mockProgress.overallProgress}% Complete
                        </span>
                    </div>
                    <Progress value={mockProgress.overallProgress} className="h-2" />
                </div>
            </Card>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Module Progress</h2>
                <div className="space-y-4">
                    {course.modules.map((module, index) => {
                        const isCompleted = mockProgress.completedModules.includes(module.id);
                        const isCurrent = mockProgress.currentModule === module.id;

                        return (
                            <Card key={module.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <Circle className="h-6 w-6 text-muted-foreground" />
                                        )}
                                        <div>
                                            <h3 className="font-medium">
                                                Module {index + 1}: {module.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Duration: {module.duration}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/courses/${course.id}/content/${module.id}`}
                                        className={isCompleted ? 'pointer-events-none' : ''}
                                    >
                                        <Button
                                            variant={isCurrent ? 'default' : 'outline'}
                                            disabled={isCompleted}
                                        >
                                            {isCompleted
                                                ? 'Completed'
                                                : isCurrent
                                                  ? 'Continue'
                                                  : 'Start Module'}
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
