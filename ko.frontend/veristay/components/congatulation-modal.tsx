'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download } from 'lucide-react';

interface CongratulationModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle?: string;
    score?: number;
    onNavigate?: () => void;
}

export function CongratulationModal({
    isOpen,
    onClose,
    courseTitle = 'the course',
    score,
    onNavigate,
}: CongratulationModalProps) {
    const handleGetCertificate = () => {
        onClose();
        window.location.href = '/certifications';
    };

    const handleContinueDashboard = () => {
        onClose();
        window.location.href = '/dashboard';
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] text-center">
                <DialogHeader className="flex flex-col items-center gap-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <DialogTitle className="text-2xl">🎉 CONGRATULATIONS! 🎉</DialogTitle>
                    <DialogDescription className="text-base">
                        You have successfully completed {courseTitle}!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-6">
                    <div className="rounded-lg bg-green-50 p-4">
                        <p className="text-sm text-muted-foreground">Course Status</p>
                        <p className="mt-2 text-lg font-semibold text-green-700">✓ Completed</p>
                    </div>

                    <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
                        <div className="flex items-start gap-3">
                            <Download className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-amber-900">
                                    Certificate Available
                                </p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Your certificate of completion is now available for download on
                                    the platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Great job! You've successfully completed all the course materials and
                        assessments.
                    </p>
                </div>

                <DialogFooter className="flex gap-3 sm:justify-center">
                    <Button onClick={handleGetCertificate}>Get Certificate</Button>
                    <Button onClick={handleContinueDashboard}>Continue to Dashboard</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
