import * as React from 'react';
import { Clock, GraduationCap } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LearningPath } from '@/app/(platform)/data/learning-paths';
import { Course } from '@/app/(platform)/data/courses';

interface CustomizePathModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedCourses: number[]) => void;
    path: LearningPath;
    allCourses: Course[];
}

export function CustomizePathModal({
    isOpen,
    onClose,
    onConfirm,
    path,
    allCourses,
}: Readonly<CustomizePathModalProps>) {
    React.useEffect(() => {
        setSelectedCourseIds(path.courses);
    }, [path]);

    const [selectedCourseIds, setSelectedCourseIds] = React.useState<number[]>(path.courses);

    // Calculate totals when selection changes
    const totalPrice = React.useMemo(() => {
        return allCourses
            .filter((course) => selectedCourseIds.includes(course.id))
            .reduce((sum, course) => sum + course.price, 0);
    }, [selectedCourseIds, allCourses]);

    const totalDuration = React.useMemo(() => {
        return allCourses
            .filter((course) => selectedCourseIds.includes(course.id))
            .reduce((sum, course) => sum + course.duration, 0);
    }, [selectedCourseIds, allCourses]);

    const handleToggleCourse = (courseId: number) => {
        setSelectedCourseIds((prev) => {
            if (prev.includes(courseId)) {
                return prev.filter((id) => id !== courseId);
            }
            return [...prev, courseId];
        });
    };

    const handleConfirm = () => {
        onConfirm(selectedCourseIds);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{path.title}</DialogTitle>
                    <DialogDescription>{path.description}</DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 flex flex-col gap-4">
                    {/* Summary Section */}
                    <Card>
                        <CardHeader className="py-3">
                            <div className="flex justify-between items-baseline">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">Selected Courses</div>
                                    <div className="text-sm text-muted-foreground">
                                        {selectedCourseIds.length} courses • {totalDuration} hours
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">
                                        R {totalPrice}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Total Investment
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Course Selection */}
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                            {allCourses.map((course) => (
                                <Card key={course.id} className="transition-all">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Checkbox
                                            className="cursor-pointer"
                                            checked={selectedCourseIds.includes(course.id)}
                                            onCheckedChange={() => handleToggleCourse(course.id)}
                                            id={`course-${course.id}`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor={`course-${course.id}`}
                                                    className="font-medium cursor-pointer"
                                                >
                                                    {course.title}
                                                </label>
                                                <Badge variant="outline">R {course.price}</Badge>
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {course.description}
                                            </div>
                                            <div className="mt-2 flex items-center gap-3">
                                                <Badge variant="secondary">{course.level}</Badge>
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {course.duration} hours
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedCourseIds.length === 0}>
                        Enroll Now • R {totalPrice}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Re-export for backward compatibility
export { CustomizePathModal as LearningPathModal };
