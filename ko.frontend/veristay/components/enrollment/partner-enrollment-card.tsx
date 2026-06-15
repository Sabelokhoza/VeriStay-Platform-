import { Badge } from '@heroui/react';
import { Shield, UserMinus, UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const PartnerEnrollmentCard = ({ course }: { course: any }) => {
    return (
        <Card key={course.courseId}>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    {course.tittle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" /> Enrolled:
                        </span>
                        <span className="font-medium">{course.enrolled}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <UserPlus className="w-4 h-4" /> Capacity:
                        </span>
                        <span className="font-medium">{course.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <UserMinus className="w-4 h-4" /> Available:
                        </span>
                        <span className="font-medium">{course.available}</span>
                    </div>
                    {course.waitlist > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" /> Waitlist:
                            </span>
                            <Badge variant="solid">{course.waitlist}</Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PartnerEnrollmentCard;
