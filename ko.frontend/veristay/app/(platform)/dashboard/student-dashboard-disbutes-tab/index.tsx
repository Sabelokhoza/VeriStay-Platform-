'use client';

import { useState } from 'react';
import { AlertTriangle, MessageSquare, ShieldCheck } from 'lucide-react';
import { useGetDisputesQuery, DisputeDto } from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import { ActiveTenancyRef } from './utils';
import { AddDisputeModal } from './AddDisputeModal';
import { DisputeDetailModal } from './DisputeDetailModal';
import { DisputeListItem } from './DisputeListItem';

export function StudentDisputesTab({
    activeTenancy,
}: {
    activeTenancy: ActiveTenancyRef | null;
}) {
    const [showAddModal,    setShowAddModal]    = useState(false);
    const [selectedDispute, setSelectedDispute] = useState<DisputeDto | null>(null);

    const userId = useAppSelector((state: any) => state.userAuthStore?.id ?? '');

    const { data: allDisputes = [], isLoading, refetch } = useGetDisputesQuery();

    const myDisputes = allDisputes.filter(d => d.studentId === userId);

    const openCount     = myDisputes.filter(d => d.status === 0).length;
    const reviewCount   = myDisputes.filter(d => d.status === 1).length;
    const resolvedCount = myDisputes.filter(d => d.status === 2).length;

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
                        My Disputes {myDisputes.length > 0 && `(${myDisputes.length})`}
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        File Dispute
                    </button>
                </div>

                {myDisputes.length > 0 && (
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

                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-0.5">Dispute Resolution Process</p>
                        <p>
                            VeriStay mediates disputes between students and landlords.
                            File a dispute if your landlord is not meeting their obligations.
                            Our admin team will review and notify both parties of the outcome.
                        </p>
                    </div>
                </div>

                {myDisputes.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No disputes filed
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            If you're experiencing issues with your landlord or property,
                            you can file a dispute for admin review.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            File Your First Dispute
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myDisputes.map(dispute => (
                            <DisputeListItem key={dispute.id} dispute={dispute} onSelect={setSelectedDispute} />
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddDisputeModal
                    studentId={userId}
                    activeTenancy={activeTenancy}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        refetch();
                    }}
                />
            )}

            {selectedDispute && (
                <DisputeDetailModal
                    dispute={selectedDispute}
                    onClose={() => setSelectedDispute(null)}
                />
            )}
        </>
    );
}
