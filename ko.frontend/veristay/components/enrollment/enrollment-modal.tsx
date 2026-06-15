'use client';

import { useAddCourseEnrollmentMutation } from '@/app/errors/coursesApi';
import { useAppSelector } from '@/app/store/store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, Phone, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

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

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    course: {
        id: string;
        title: string;
        price: number;
        prerequisites: Prerequisite[];
        trainingCenter: TrainingCenter;
    };
}

export function EnrollmentModal({ isOpen, onClose, onSuccess, course }: EnrollmentModalProps) {
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const [addCourseEnrollment, { isLoading, error, reset }] = useAddCourseEnrollmentMutation();

    const hasPrerequisites = course.prerequisites && course.prerequisites.length > 0;
    const allPrerequisitesMet = course.prerequisites?.every((p) => p.status === 'completed');

    const handleClose = () => {
        reset(); // Clear the error state
        onClose();
    };

    const handleConfirmEnrollment = async () => {
        if (!userId) {
            toast.error('Please log in to enroll in courses');
            return;
        }

        try {
            const enrollmentData = {
                applicationUserId: userId,
                courseId: parseInt(course.id),
            };

            const result = await addCourseEnrollment(enrollmentData).unwrap();

            // Success handling
            if (result.success) {
                toast.success(`Space reserved (Proceed to payment)!`);
                onClose();
                window.location.href = '/billing';
            }
            toast.success(`Space reserved (Proceed to payment)!`);
            onSuccess?.();
            handleClose();
        } catch (error: any) {
            // Error handling
            console.error('Enrollment failed:', error);
            const errorMessage =
                error?.data?.message || 'Failed to enroll in course. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enroll in Course</DialogTitle>
                    <DialogDescription>Confirm your enrollment in {course.title}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Course Price</span>
                        <span className="text-lg font-semibold">
                            R{course.price.toLocaleString()}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Training Center</h4>
                        <div className="rounded-md border p-3">
                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{course.trainingCenter.name}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <span className="ml-6">{course.trainingCenter.address}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Phone className="mr-2 h-4 w-4" />
                                    <span>{course.trainingCenter.contactNumber}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>{course.trainingCenter.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {hasPrerequisites && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Prerequisites</h4>
                            <div className="space-y-2">
                                {course.prerequisites?.map((prerequisite) => (
                                    <div
                                        key={prerequisite.id}
                                        className="flex items-center justify-between rounded-md border p-2"
                                    >
                                        <span className="text-sm">{prerequisite.title}</span>
                                        {prerequisite.status === 'completed' ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : prerequisite.status === 'pending' ? (
                                            <Badge variant="secondary">In Progress</Badge>
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasPrerequisites && !allPrerequisitesMet && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                You need to complete all prerequisites before enrolling in this
                                course.
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {(error as any)?.data?.message ||
                                    'An error occurred during enrollment. Please try again.'}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmEnrollment}
                        disabled={
                            (hasPrerequisites && !allPrerequisitesMet) || isLoading || !userId
                        }
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Enrolling...' : 'Confirm Enrollment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
