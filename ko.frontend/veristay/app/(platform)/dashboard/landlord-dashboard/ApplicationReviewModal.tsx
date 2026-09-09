'use client';

import { useState } from 'react';
import { X, MapPin, FileText, Loader2, Download, CheckCircle, XCircle } from 'lucide-react';
import {
    ApplicationDto,
    useGetStudentApplicationQuery,
    useAcceptDeclineOfferMutation,
} from '@/app/errors/listingsApi';
import { formatRent, formatDate, isPlaceholder } from './utils';

export function ApplicationReviewModal({
    app, onApprove, onReject, onClose, isLoading,
}: {
    app: ApplicationDto; onApprove: () => void; onReject: () => void;
    onClose: () => void; isLoading: boolean;
}) {
    const {
        data: details,
        isLoading: isLoadingDetails,
        isError: isDetailsError,
    } = useGetStudentApplicationQuery(app.id, { skip: !app.id });
    const [acceptDeclineOffer] = useAcceptDeclineOfferMutation();
    const [pending, setPending] = useState<'accept' | 'decline' | null>(null);

    async function handleApprove() {
        setPending('accept');
        try {
            await acceptDeclineOffer({ applicationId: app.id, isAccepted: true });
        } finally {
            setPending(null);
        }
    }

    async function handleReject() {
        setPending('decline');
        try {
            await acceptDeclineOffer({ applicationId: app.id, isAccepted: false });
        } finally {
            setPending(null);
        }
    }

    const studentName = details?.studentName ?? app.studentName;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
                <div className="bg-blue-600 px-6 py-5 text-white shrink-0">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold">Review Application</h2>
                    <p className="text-sm text-blue-100 mt-0.5">
                        {isPlaceholder(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                    </p>
                </div>

                <div className="overflow-y-auto">
                    <div className="px-6 py-4 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                {(studentName ?? app.studentId)?.charAt(0).toUpperCase() ?? 'S'}
                            </div>
                            <div>
                                <p className="font-semibold">{studentName ?? `Student #${app.studentId.slice(0, 8)}`}</p>
                                <p className="text-sm text-muted-foreground">Applied {formatDate(app.appliedAt)}</p>
                                {app.price > 0 && (
                                    <p className="text-sm font-bold text-blue-600">R {formatRent(app.price)} / month</p>
                                )}
                            </div>
                        </div>
                        {!isPlaceholder(app.propertyLocation) && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                {app.propertyLocation}
                            </p>
                        )}
                        {!isPlaceholder(app.supportingDocumentUrl) && (
                            <a href={app.supportingDocumentUrl} target="_blank" rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <FileText className="h-3.5 w-3.5" /> View Supporting Document
                            </a>
                        )}
                    </div>

                    <div className="px-6 py-4 border-b">
                        <p className="text-sm font-medium mb-2">Documents</p>

                        {isLoadingDetails ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading documents...
                            </div>
                        ) : isDetailsError ? (
                            <p className="text-sm text-red-600">Couldn't load this application's documents.</p>
                        ) : (
                            <div className="space-y-2">
                                {details && !isPlaceholder(details.proofOfRegistrationUrl) ? (
                                    <a
                                        href={details.proofOfRegistrationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            Proof of Registration
                                        </span>
                                        <Download className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No proof of registration uploaded.</p>
                                )}

                                {details && !isPlaceholder(details.proofOfIncomeUrl) ? (
                                    <a
                                        href={details.proofOfIncomeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            Proof of Income
                                        </span>
                                        <Download className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No proof of income uploaded.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-5 space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Review this application and choose to approve or reject it.
                            The student will be notified of your decision via email.
                        </p>
                        <button onClick={handleApprove} disabled={isLoading || pending === 'accept'}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                            {isLoading || pending === 'accept' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            Approve Application
                        </button>
                        <button onClick={handleReject} disabled={isLoading || pending === 'decline'}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50">
                            {isLoading || pending === 'decline' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                            Reject Application
                        </button>
                        <button onClick={onClose} disabled={isLoading}
                            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
