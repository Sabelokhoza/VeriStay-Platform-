'use client';

import { Course } from '@/app/(platform)/data/courses';
import { LearningPath } from '@/app/(platform)/data/learning-paths';
import { useAppSelector } from '@/app/store/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, Clock, Dumbbell, Users } from 'lucide-react';

interface LearningPathCardProps {
    path: LearningPath;
    courses: Course[];
    onViewPath: (path: LearningPath) => void;
}

export function LearningPathCard({ path, courses, onViewPath }: LearningPathCardProps) {
    const trainingCenters = useAppSelector((state) => state.trainingCentreStore.trainingCentres);

    // Calculate additional information for learning paths
    const getPathDetails = (pathCourseIds: number[]) => {
        const pathCourses = courses.filter((course) => pathCourseIds.includes(course.id));
        const totalEnrolled = pathCourses.reduce((sum, course) => sum + course.students, 0);
        const centers = new Set(
            pathCourses
                .map(
                    (course) =>
                        trainingCenters.find((c) => c.id === course.trainingCenterId)?.location
                )
                .filter(Boolean)
        );

        return {
            totalEnrolled,
            locations: Array.from(centers),
        };
    };

    return (
        <Card className="border hover:shadow-md  border-blue-500/40 shadow-sm  rounded-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    {path.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">{path.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {path.careers.map((career) => (
                            <Badge key={career} variant="secondary" className="text-primary">
                                {career}
                            </Badge>
                        ))}
                    </div>

                    {/* Path Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{path.duration} hours</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BookOpen className="h-4 w-4" />
                                <span>{path.courses.length} Courses</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{path.totalEnrolled} enrolled</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="rounded-lg bg-primary/5 p-4 space-y-2">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm font-medium">Total Investment</span>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-primary">
                                    R {path.totalPrice}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            *Payment plans available
                        </div>
                    </div>

                    <Button className="w-full group" onClick={() => onViewPath(path)}>
                        View Path
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
