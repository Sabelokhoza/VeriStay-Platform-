'use client';

import { useState } from 'react';
import { Flag, MessageSquare } from 'lucide-react';
import { useGetComplaintsQuery, ComplaintDto } from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import { ActiveTenancyRef } from './utils';
import { AddComplaintModal } from './AddComplaintModal';
import { ComplaintDetailModal } from './ComplaintDetailModal';
import { ComplaintListItem } from './ComplaintListItem';

export function StudentComplaintsTab({
    activeTenancy,
}: {
    activeTenancy: ActiveTenancyRef | null;
}) {
    const [showAddModal,      setShowAddModal]      = useState(false);
    const [selectedComplaint, setSelectedComplaint]  = useState<ComplaintDto | null>(null);

    const userId = useAppSelector((state: any) => state.userAuthStore?.id ?? '');

    const { data: allComplaints = [], isLoading, refetch } = useGetComplaintsQuery();

    const myComplaints = allComplaints.filter(c => c.submittedById === userId);

    const openCount     = myComplaints.filter(c => c.status === 0).length;
    const reviewCount   = myComplaints.filter(c => c.status === 1).length;
    const resolvedCount = myComplaints.filter(c => c.status === 2).length;

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 rounded bg-muted" />
                <div className="h-32 rounded-xl bg-muted" />
                <div className="h-24 rounded-xl bg-muted" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        My Complaints {myComplaints.length > 0 && `(${myComplaints.length})`}
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                    >
                        <Flag className="h-4 w-4" />
                        File Complaint
                    </button>
                </div>

                {myComplaints.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl border bg-background p-3 text-center shadow-sm">
                            <p className="text-xl font-bold text-red-600">{openCount}</p>
                            <p className="text-xs text-muted-foreground">Open</p>
                        </div>
                        <div className="rounded-xl border bg-background p-3 text-center shadow-sm">
                            <p className="text-xl font-bold text-yellow-600">{reviewCount}</p>
                            <p className="text-xs text-muted-foreground">Under Review</p>
                        </div>
                        <div className="rounded-xl border bg-background p-3 text-center shadow-sm">
                            <p className="text-xl font-bold text-green-600">{resolvedCount}</p>
                            <p className="text-xs text-muted-foreground">Resolved</p>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <Flag className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-orange-800">
                        <p className="font-semibold mb-0.5">About Complaints</p>
                        <p>
                            Use complaints to report issues like vacant properties being
                            falsely listed, poor property conditions, or unprofessional
                            landlord behaviour. The admin team reviews all complaints and
                            notifies relevant parties.
                        </p>
                    </div>
                </div>

                {myComplaints.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No complaints filed
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            If you've experienced issues with a property or landlord,
                            you can submit a complaint for admin review.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                        >
                            <Flag className="h-4 w-4" />
                            File Your First Complaint
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myComplaints.map(complaint => (
                            <ComplaintListItem key={complaint.id} complaint={complaint} onSelect={setSelectedComplaint} />
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddComplaintModal
                    studentId={userId}
                    activeTenancy={activeTenancy}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        refetch();
                    }}
                />
            )}

            {selectedComplaint && (
                <ComplaintDetailModal
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                />
            )}
        </>
    );
}
