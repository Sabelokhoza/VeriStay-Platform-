import { Badge, BookOpen, Clock, Eye, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { CentreCourse } from '@/app/api/dtos/dtos';
import { cn } from '@/lib/utils';

const handleViewCourse = (courseId: number) => {
    window.open(`/courses/${courseId}`, '_blank');
};

const handleManageCourse = (courseId: number) => {
    window.open(`/courses/${courseId}`, '_blank');
};

const CoursePartnerCard = ({ course }: { course: CentreCourse }) => {
    return (
        <Card
            key={course.courseId}
            className="relative  hover:shadow-lg shadow-sm shadow-primary/10"
        >
            <CardHeader>
                {
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-primary/80">{course.tittle}</CardTitle>
                        <div
                            className={cn(
                                course.isActive ? 'bg-green-100' : 'bg-red-100',
                                'flex items-center gap-2 px-2 py-1 rounded'
                            )}
                        >
                            <Badge
                                className={cn(course.isActive ? 'text-green-500' : 'text-red-500')}
                            />
                        </div>
                    </div>
                }
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Enrollment Statistics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-bold">Total Students</p>
                            <p className="font-medium">{course.totalEnrollments}</p>
                        </div>
                        <div>
                            <p className="font-bold">Active</p>
                            <p className="font-medium">{course.activeEnrollments}</p>
                        </div>
                        <div>
                            <p className="font-bold">Completed</p>
                            <p className="font-medium">{course.completedEnrollments}</p>
                        </div>
                        <div>
                            <p className="font-bold">Completion Rate</p>
                            <p className="font-medium">{course.completionRate}%</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span>Average Progress</span>
                            <span>{course.averageProgress}%</span>
                        </div>
                        <Progress value={course.averageProgress} />
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {course.modulesCount} Modules
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewCourse(course.courseId)}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleManageCourse(course.courseId)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CoursePartnerCard;
