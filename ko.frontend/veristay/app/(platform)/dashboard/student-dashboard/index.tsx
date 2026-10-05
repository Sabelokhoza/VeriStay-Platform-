'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import {
    useGetStudentDashboardQuery,
    useGetStudentMaintenanceRequestsQuery,
    ApplicationDto,
    MaintenanceRequestDto,
    useGetTenanciesByStudentIdQuery,
    useAcceptDeclineOfferMutation,
    useGetStudentPaymentSummaryQuery,
    useGetDisputesQuery,
    useGetComplaintsQuery,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import { TenancyTab } from '../tenancy-tab';
import { NewMaintenanceRequestModal } from '../new-maintenance-request-modal';
import { CommunityTab } from '../community-tab';
import { PaymentsTab } from '../payments-tab';
import { StudentDisputesTab } from '../student-dashboard-disbutes-tab';
import { StudentComplaintsTab } from '../student-complaints-tab';
import { tabs, Tab } from './utils';
import { OfferModal } from './OfferModal';
import { OfferResultModal } from './OfferResultModal';
import { OverviewTab } from './OverviewTab';
import { ApplicationsTab } from './ApplicationsTab';
import { MaintenanceTab } from './MaintenanceTab';
import { TabBadge, useUnseenCount } from '../tab-badges';

type ModalState =
    | { type: 'none' }
    | { type: 'offer'; app: ApplicationDto }
    | { type: 'result'; outcome: 'accepted' | 'declined' }
    | { type: 'new-maintenance-request' }
    | { type: 'edit-maintenance-request'; request: MaintenanceRequestDto };

export function StudentDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [modal, setModal] = useState<ModalState>({ type: 'none' });
    const [offerLoading, setOfferLoading] = useState(false);

    const userId = useAppSelector((state) => state.userAuthStore?.id);

    const {
        data: dashboardData,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetStudentDashboardQuery(userId, { skip: !userId, refetchOnMountOrArgChange: true });

    const {
        data: maintenanceRequests = [],
        isLoading: maintenanceLoading,
        isError: maintenanceError,
        refetch: refetchMaintenanceRequests,
    } = useGetStudentMaintenanceRequestsQuery(userId ?? '', { skip: !userId });

    const { data: tenancies = [] } = useGetTenanciesByStudentIdQuery(userId ?? '', { skip: !userId });

    const student = dashboardData?.student;
    const applications = dashboardData?.applications ?? [];
    const waitingList = dashboardData?.waitingList ?? [];
    const announcements = dashboardData?.announcementDtos ?? [];

    const activeTenancy = tenancies.find((t) => t.status === 0) ?? tenancies[0] ?? null;
    const activePropertyId = activeTenancy?.propertyId ?? null;

    // ── Tab badges ── action items are plain counts; landlord/admin communication
    // counts as "unseen" until the student opens that tab.
    const { data: paymentSummary } = useGetStudentPaymentSummaryQuery(userId ?? '', { skip: !userId });
    const { data: allDisputes = [] }   = useGetDisputesQuery(undefined, { skip: !userId });
    const { data: allComplaints = [] } = useGetComplaintsQuery(undefined, { skip: !userId });

    const seenKey = (tab: Tab) => `veristay-seen:${userId ?? ''}:${tab}`;

    const offerCount   = applications.filter((a) => a.status === 1).length;
    const unsignedLease =
        activeTenancy && activeTenancy.leaseDocument && !activeTenancy.signedLeaseUploadedAt ? 1 : 0;
    const overdueCount = paymentSummary?.overdueCount ?? 0;

    const unseenMaintenance = useUnseenCount(
        seenKey('maintenance'),
        maintenanceRequests
            .filter((m) => m.status !== 0 || m.landlordResponse)
            .map((m) => `${m.id}:${m.status}:${(m.landlordResponse ?? '').length}`),
        activeTab === 'maintenance',
    );
    const unseenAnnouncements = useUnseenCount(
        seenKey('community'),
        announcements.map((a) => `${a.id}`),
        activeTab === 'community',
    );
    const unseenDisputes = useUnseenCount(
        seenKey('disputes'),
        allDisputes
            .filter((d) => d.studentId === userId && (d.status !== 0 || d.landlordRespondedAt))
            .map((d) => `${d.id}:${d.status}:${d.landlordRespondedAt ?? ''}`),
        activeTab === 'disputes',
    );
    const unseenComplaints = useUnseenCount(
        seenKey('complaints'),
        allComplaints
            .filter((c) => c.submittedById === userId && (c.status !== 0 || c.landlordRespondedAt || c.adminNotes))
            .map((c) => `${c.id}:${c.status}:${c.landlordRespondedAt ?? ''}:${(c.adminNotes ?? '').length}`),
        activeTab === 'complaints',
    );

    const badges: Partial<Record<Tab, { count: number; tone: 'red' | 'orange' | 'green' | 'blue' }>> = {
        applications: { count: offerCount,          tone: 'green'  },
        tenancy:      { count: unsignedLease,       tone: 'orange' },
        payments:     { count: overdueCount,        tone: 'red'    },
        maintenance:  { count: unseenMaintenance,   tone: 'blue'   },
        community:    { count: unseenAnnouncements, tone: 'blue'   },
        disputes:     { count: unseenDisputes,      tone: 'blue'   },
        complaints:   { count: unseenComplaints,    tone: 'blue'   },
    };

    const [acceptDeclineOffer] = useAcceptDeclineOfferMutation();

    function openOfferModal(app: ApplicationDto) {
        setModal({ type: 'offer', app });
    }

    async function respondToOffer(isAccepted: boolean) {
        if (modal.type !== 'offer') return;
        setOfferLoading(true);
        try {
            await acceptDeclineOffer({ applicationId: modal.app.id, isAccepted }).unwrap();
            setModal({ type: 'result', outcome: isAccepted ? 'accepted' : 'declined' });
            refetch();
        } catch {
            // The API layer already shows the error toast.
            // The offer may have changed on the server (e.g. already accepted); close the
            // modal and reload so the student isn't left acting on a stale offer.
            setModal({ type: 'none' });
            refetch();
        } finally {
            setOfferLoading(false);
        }
    }

    const handleAcceptOffer  = () => respondToOffer(true);
    const handleDeclineOffer = () => respondToOffer(false);

    return (
        <>
            <div className="min-h-screen w-full bg-muted/30">
                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="container mx-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                Welcome back,{' '}
                                {isLoading ? (
                                    <span className="inline-block h-5 w-24 animate-pulse rounded bg-muted align-middle" />
                                ) : (
                                    (student?.fullName?.split(' ')[0] ?? 'Student')
                                )}{' '}
                                👋
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {student?.studentNumber ? `${student.studentNumber} · ` : ''}
                                {student?.email ?? ''}
                            </p>
                        </div>
                        <Link
                            href="/listing"
                            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors sm:mt-0"
                        >
                            <Search className="h-4 w-4" />
                            Browse Properties
                        </Link>
                    </div>
                </div>

                <div className="border-b bg-background">
                    <div className="container mx-auto overflow-x-auto px-4 sm:px-8">
                        <div className="flex gap-1 py-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {badges[tab.id] && (
                                        <TabBadge count={badges[tab.id]!.count} tone={badges[tab.id]!.tone} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 sm:px-8">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            dashboardData={dashboardData}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            isError={isError}
                            applications={applications}
                            waitingList={waitingList}
                            onOpenOffer={openOfferModal}
                            onSwitchTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'applications' && (
                        <ApplicationsTab
                            applications={applications}
                            isLoading={isLoading}
                            onOpenOffer={openOfferModal}
                        />
                    )}

                    {activeTab === 'tenancy' && (
                        <TenancyTab studentId={userId ?? ''} />
                    )}

                    {activeTab === 'payments' && (
                        <PaymentsTab studentId={userId ?? ''} />
                    )}

                    {activeTab === 'maintenance' && (
                        <MaintenanceTab
                            studentId={userId ?? ''}
                            maintenanceRequests={maintenanceRequests}
                            isLoading={maintenanceLoading}
                            isError={maintenanceError}
                            onNewRequest={() => setModal({ type: 'new-maintenance-request' })}
                            onEditRequest={(request) => setModal({ type: 'edit-maintenance-request', request })}
                        />
                    )}

                    {activeTab === 'community' && (
                        <CommunityTab
                            studentId={userId ?? ''}
                            activeTenancy={dashboardData?.activeTenancy ?? null}
                            announcements={announcements}
                        />
                    )}

                    {activeTab === 'disputes' && (
                        <StudentDisputesTab
                            activeTenancy={dashboardData?.activeTenancy
                                ? {
                                    landlordId:    dashboardData.activeTenancy.landlordId,
                                    propertyId:    dashboardData.activeTenancy.propertyId,
                                    propertyTitle: dashboardData.activeTenancy.propertyTitle,
                                }
                                : null
                            }
                        />
                    )}

                    {activeTab === 'complaints' && (
                        <StudentComplaintsTab
                            activeTenancy={dashboardData?.activeTenancy
                                ? {
                                    landlordId:    dashboardData.activeTenancy.landlordId,
                                    propertyId:    dashboardData.activeTenancy.propertyId,
                                    propertyTitle: dashboardData.activeTenancy.propertyTitle,
                                }
                                : null
                            }
                        />
                    )}
                </div>
            </div>

            {(modal.type === 'new-maintenance-request' || modal.type === 'edit-maintenance-request') && (
                <NewMaintenanceRequestModal
                    studentId={userId ?? ''}
                    propertyId={activePropertyId}
                    request={modal.type === 'edit-maintenance-request' ? modal.request : undefined}
                    onClose={() => setModal({ type: 'none' })}
                    onSuccess={() => {
                        setModal({ type: 'none' });
                        refetchMaintenanceRequests();
                    }}
                />
            )}

            {modal.type === 'offer' && (
                <OfferModal
                    app={modal.app}
                    onAccept={handleAcceptOffer}
                    onDecline={handleDeclineOffer}
                    onClose={() => setModal({ type: 'none' })}
                    isLoading={offerLoading}
                />
            )}
            {modal.type === 'result' && (
                <OfferResultModal type={modal.outcome} onClose={() => setModal({ type: 'none' })} />
            )}
        </>
    );
}
