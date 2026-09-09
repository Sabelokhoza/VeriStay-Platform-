'use client';

import { useState } from 'react';
import { X, FileText, Loader2, UserCheck, UserX } from 'lucide-react';
import { AdminLandlordDto } from '@/app/errors/listingsApi';
import { formatDate, getLandlordStatusLabel } from './utils';
import { StatusBadge } from './StatusBadge';

export function LandlordReviewModal({
    landlord, onApprove, onReject, onClose, isLoading,
}: {
    landlord:  AdminLandlordDto;
    onApprove: () => void;
    onReject:  () => void;
    onClose:   () => void;
    isLoading: boolean;
}) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">

                <div className="bg-blue-700 px-6 py-5 text-white">
                    <button onClick={onClose} disabled={isLoading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                            {landlord.fullName?.charAt(0)?.toUpperCase() ?? 'L'}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{landlord.fullName ?? 'Landlord'}</h2>
                            <p className="text-sm text-blue-100">{landlord.email}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-b bg-muted/30 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="font-medium">{landlord.phoneNumber || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Registered</p>
                            <p className="font-medium">{formatDate(landlord.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Properties</p>
                            <p className="font-medium">{landlord.propertiesCount}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <StatusBadge
                                label={getLandlordStatusLabel(landlord.verificationStatus).label}
                                style={getLandlordStatusLabel(landlord.verificationStatus).style}
                            />
                        </div>
                    </div>

                    {landlord.documentsUrl && (
                        <a href={landlord.documentsUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                            <FileText className="h-3.5 w-3.5" />
                            View Identification Document
                        </a>
                    )}
                </div>

                <div className="px-6 py-4 border-b">
                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
                        <p className="font-semibold mb-1">Admin Review Required</p>
                        <p>
                            Review the landlord's identification document and personal details.
                            Approving will give them full access to list properties. Rejecting
                            will notify them via email with instructions to reapply.
                        </p>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-3">
                    <button
                        onClick={() => { setAction('approve'); onApprove(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'approve'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <UserCheck className="h-4 w-4" />
                        }
                        Approve Landlord
                    </button>
                    <button
                        onClick={() => { setAction('reject'); onReject(); }}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                        {isLoading && action === 'reject'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <UserX className="h-4 w-4" />
                        }
                        Reject Application
                    </button>
                    <button onClick={onClose} disabled={isLoading}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
