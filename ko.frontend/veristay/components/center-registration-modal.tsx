'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Phone } from 'lucide-react';

interface CentreRegistrationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    centreName?: string;
}

export function CentreRegistrationSuccessModal({
    isOpen,
    onClose,
    centreName = 'your training centre',
}: CentreRegistrationSuccessModalProps) {
    const handleClose = () => {
        onClose();
        window.location.href = '/login';
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] text-center">
                <DialogHeader className="flex flex-col items-center gap-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <DialogTitle className="text-2xl">Application Submitted!</DialogTitle>
                    <DialogDescription className="text-base">
                        Your registration application for <strong>{centreName}</strong> has been
                        successfully received by Trainers Council.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-6">
                    <div className="rounded-lg bg-green-50 p-4">
                        <p className="text-sm text-muted-foreground">Application Status</p>
                        <p className="mt-2 text-lg font-semibold text-green-700">
                            ✓ Successfully Submitted
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-blue-900">
                                    What Happens Next?
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    One of our consultants will reach out to you shortly to take you
                                    through our onboarding process and get your centre up and
                                    running.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Please expect to hear from us within <strong>2–3 business days</strong>.
                        Check your email for a confirmation of your submission.
                    </p>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button onClick={handleClose}>Back to Login</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
