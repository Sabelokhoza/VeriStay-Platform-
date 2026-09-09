'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import {
    useGetStudentDashboardQuery,
    useGetStudentMaintenanceRequestsQuery,
    ApplicationDto,
    useGetTenanciesByStudentIdQuery,
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

type ModalState =
    | { type: 'none' }
    | { type: 'offer'; app: ApplicationDto }
    | { type: 'result'; outcome: 'accepted' | 'declined' }
    | { type: 'new-maintenance-request' };

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
    } = useGetStudentDashboardQuery(userId, { skip: !userId });

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

    function openOfferModal(app: ApplicationDto) {
        setModal({ type: 'offer', app });
    }

    async function handleAcceptOffer() {
        setOfferLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 1000));
            setModal({ type: 'result', outcome: 'accepted' });
            refetch();
        } finally {
            setOfferLoading(false);
        }
    }

    async function handleDeclineOffer() {
        setOfferLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 1000));
            setModal({ type: 'result', outcome: 'declined' });
            refetch();
        } finally {
            setOfferLoading(false);
        }
    }

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
                                    {tab.id === 'applications' &&
                                        applications.filter((a) => a.status === 1).length > 0 && (
                                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                                                {applications.filter((a) => a.status === 1).length}
                                            </span>
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
                            maintenanceRequests={maintenanceRequests}
                            isLoading={maintenanceLoading}
                            isError={maintenanceError}
                            onNewRequest={() => setModal({ type: 'new-maintenance-request' })}
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
                                    landlordId:    dashboardData.activeTenancy.landlordName,
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
                                    landlordId:    dashboardData.activeTenancy.landlordName,
                                    propertyId:    dashboardData.activeTenancy.propertyId,
                                    propertyTitle: dashboardData.activeTenancy.propertyTitle,
                                }
                                : null
                            }
                        />
                    )}
                </div>
            </div>

            {modal.type === 'new-maintenance-request' && (
                <NewMaintenanceRequestModal
                    studentId={userId ?? ''}
                    propertyId={activePropertyId}
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
