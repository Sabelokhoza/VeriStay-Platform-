'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Shield, MapPin } from 'lucide-react';

interface TrainingCenter {
    id: string;
    name: string;
    location: string;
    address: string;
    contactNumber: string;
    email: string;
}

interface Prerequisite {
    id: string;
    title: string;
    status: 'completed' | 'pending' | 'missing';
}

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        duration: number;
        students: number;
        psiraLevel: string;
        price: number;
        prerequisites: Prerequisite[];
        trainingCenter: TrainingCenter;
    };
    onEnroll: (courseId: string) => void;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <Badge variant="secondary">{course.psiraLevel}</Badge>
                </div>
            </CardHeader>
            <CardContent className="grow">
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {course.duration} hours
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        {course.students} enrolled
                    </div>
                    {/* course.prerequisites && course.prerequisites.length > 0 */}
                    {
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Shield className="mr-2 h-4 w-4" />
                            {course.prerequisites.length} prerequisites
                        </div>
                    }
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="line-clamp-1">{course.trainingCenter.name}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="rounded-lg w-[250px] bg-primary/5 p-4 space-y-2">
                    <div className="text-lg font-semibold">
                        <span className="text-2xl font-bold text-primary">
                            R{course.price.toLocaleString()}
                        </span>
                    </div>
                </div>
                <Button onClick={() => onEnroll(course.id)}>Enroll Now</Button>
            </CardFooter>
        </Card>
    );
}
