'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, AlertCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import {
    useGetLandlordDashboardQuery,
    useMarkMaintenanceResolvedMutation,
    MaintenanceStatus,
    ApplicationDto,
    LandlordMaintenanceDto,
} from '@/app/errors/listingsApi';
import { useAppSelector } from '@/app/store/store';
import ReputationSection, { LandlordPaymentsTab } from '../landlord-payments-tab';
import AnnouncementsTab from '../announcement-tab';
import { isPlaceholder, tabs, Tab } from './utils';
import { DashboardSkeleton } from './DashboardSkeleton';
import { AddPropertyModal } from './AddPropertyModal';
import { ApplicationReviewModal } from './ApplicationReviewModal';
import { MaintenanceResponseModal } from './MaintenanceResponseModal';
import { OverviewTab } from './OverviewTab';
import { PropertiesTab } from './PropertiesTab';
import { ApplicationsList } from './ApplicationsList';
import { TenantsTab } from './TenantsTab';
import { MaintenanceTab } from './MaintenanceTab';

export function LandlordDashboard() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [selectedApp, setSelectedApp]                   = useState<ApplicationDto | null>(null);
    const [selectedMaint, setSelectedMaint]               = useState<LandlordMaintenanceDto | null>(null);
    const [actionLoading, setActionLoading]               = useState(false);
    const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

    const userId = useAppSelector((state: any) => state.userAuthStore?.id ?? '');

    const { data, isLoading, isError, isFetching, refetch } =
        useGetLandlordDashboardQuery(userId, { skip: !userId });

    const landlord     = data?.landlord;
    const properties   = data?.propertiesDto       ?? [];
    const applications = data?.recentApplications  ?? [];
    const maintenance  = data?.openMantainances     ?? [];

    const tenants = Array.from(
        new Map((data?.tenants ?? []).map(t => [t.id, t])).values()
    );

    const pendingApps = applications.filter(a => a.status === 0);
    const openMaint   = maintenance.filter(m => m.status === 0 || m.status === 1);

    function goToProperty(id: number) {
        router.push(`/dashboard/property/${id}`);
    }

    async function handleApprove() {
        if (!selectedApp) return;
        setActionLoading(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            setSelectedApp(null);
            refetch();
        } finally {
            setActionLoading(false);
        }
    }

    async function handleReject() {
        if (!selectedApp) return;
        setActionLoading(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            setSelectedApp(null);
            refetch();
        } finally {
            setActionLoading(false);
        }
    }

    const [markMaintenanceResolved] = useMarkMaintenanceResolvedMutation();

    async function handleResolve(response: string) {
        if (!selectedMaint) return;
        setActionLoading(true);
        try {
            await markMaintenanceResolved({
                id: selectedMaint.id,
                status: MaintenanceStatus.Resolved,
                landlordResponse: response,
            }).unwrap();
            setSelectedMaint(null);
            refetch();
        } finally {
            setActionLoading(false);
        }
    }

    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen w-full bg-muted/30">
                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="container mx-auto px-4 py-6 sm:px-8">
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen w-full bg-muted/30 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <AlertCircle className="h-10 w-10 mx-auto text-red-500" />
                    <p className="font-medium">Failed to load dashboard</p>
                    <button onClick={refetch}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen w-full bg-muted/30">

                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="container mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold sm:text-2xl">
                                    Welcome, {isPlaceholder(landlord?.fullName) ? 'Landlord' : landlord?.fullName?.split(' ')[0]} 👋
                                </h1>
                                <span className="inline-flex items-center gap-1 rounded-full border bg-blue-50 border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                    <ShieldCheck className="h-3 w-3" /> Landlord
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {landlord?.email}{landlord?.phoneNumber && ` · ${landlord.phoneNumber}`}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddPropertyModal(true)}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors sm:mt-0"
                        >
                            <Plus className="h-4 w-4" /> Add Property
                        </button>
                    </div>
                </div>

                {pendingApps.length > 0 && (
                    <div
                        className="border-b bg-orange-50 px-4 py-3 sm:px-8 cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setActiveTab('applications')}
                    >
                        <div className="container mx-auto flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                            <p className="text-sm text-orange-800 flex-1">
                                <span className="font-semibold">Action required —</span>{' '}
                                {pendingApps.length} student {pendingApps.length === 1 ? 'application is' : 'applications are'} waiting.
                            </p>
                            <ChevronRight className="h-4 w-4 text-orange-600 shrink-0" />
                        </div>
                    </div>
                )}

                <div className="border-b bg-background">
                    <div className="container mx-auto overflow-x-auto px-4 sm:px-8">
                        <div className="flex gap-1 py-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {tab.id === 'applications' && pendingApps.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            {pendingApps.length}
                                        </span>
                                    )}
                                    {tab.id === 'maintenance' && openMaint.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                            {openMaint.length}
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
                            data={data}
                            properties={properties}
                            applications={applications}
                            maintenance={maintenance}
                            tenants={tenants}
                            pendingApps={pendingApps}
                            onSwitchTab={setActiveTab}
                            onSelectApp={setSelectedApp}
                            onSelectMaint={setSelectedMaint}
                            onGoToProperty={goToProperty}
                            onAddProperty={() => setShowAddPropertyModal(true)}
                        />
                    )}

                    {activeTab === 'properties' && (
                        <PropertiesTab
                            properties={properties}
                            onAddProperty={() => setShowAddPropertyModal(true)}
                            onGoToProperty={goToProperty}
                        />
                    )}

                    {activeTab === 'applications' && (
                        <ApplicationsList
                            title="Student Applications"
                            applications={applications}
                            pendingCount={pendingApps.length}
                            onSelectApp={setSelectedApp}
                        />
                    )}

                    {activeTab === 'pending' && (
                        <ApplicationsList
                            title="Student Applications"
                            applications={applications.filter(app => app.status === 0)}
                            pendingCount={pendingApps.length}
                            onSelectApp={setSelectedApp}
                        />
                    )}

                    {activeTab === 'tenants' && (
                        <TenantsTab tenants={tenants} />
                    )}

                    {activeTab === 'maintenance' && (
                        <MaintenanceTab
                            maintenance={maintenance}
                            openCount={openMaint.length}
                            onSelectMaint={setSelectedMaint}
                        />
                    )}

                    {activeTab === 'payments' && (
                        <LandlordPaymentsTab landlordId={landlord?.id ?? userId} />
                    )}

                    {activeTab === 'announcements' && (
                        <AnnouncementsTab
                            landlordId={landlord?.id ?? userId}
                            properties={properties}
                        />
                    )}

                    {activeTab === 'reputation' && (
                        <ReputationSection landlordId={landlord?.id ?? userId} />
                    )}

                </div>
            </div>

            {selectedApp && (
                <ApplicationReviewModal
                    app={selectedApp}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onClose={() => setSelectedApp(null)}
                    isLoading={actionLoading}
                />
            )}
            {selectedMaint && (
                <MaintenanceResponseModal
                    item={selectedMaint}
                    onClose={() => setSelectedMaint(null)}
                    onResolve={handleResolve}
                    isLoading={actionLoading}
                />
            )}
            {showAddPropertyModal && (
                <AddPropertyModal
                    landlordId={landlord?.id ?? userId}
                    onClose={() => setShowAddPropertyModal(false)}
                    onSuccess={(id) => {
                        setShowAddPropertyModal(false);
                        goToProperty(id);
                    }}
                />
            )}
        </>
    );
}
