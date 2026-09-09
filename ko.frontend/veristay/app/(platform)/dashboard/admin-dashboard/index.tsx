'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import {
    useGetAdminDashboardQuery,
    useApproveLandlordMutation,
    useRejectLandlordMutation,
    useAdminApprovePropertyMutation,
    useAdminRejectPropertyMutation,
    AdminLandlordDto,
    AdminPropertyDto,
} from '@/app/errors/listingsApi';
import DisputesTab from '../DisputesTab';
import ComplaintsTab from '../ComplaintsTab';
import UsersTab from '../UsersTab';
import ReportTab from '../ReportTab';
import { tabs, Tab } from './utils';
import { DashboardSkeleton } from './DashboardSkeleton';
import { LandlordReviewModal } from './LandlordReviewModal';
import { PropertyReviewModal } from './PropertyReviewModal';
import { OverviewTab } from './OverviewTab';
import { LandlordsTab } from './LandlordsTab';
import { PropertiesTab } from './PropertiesTab';
import { AnalyticsTab } from './AnalyticsTab';

export function AdminDashboard() {
    const [activeTab, setActiveTab]               = useState<Tab>('overview');
    const [selectedLandlord, setSelectedLandlord] = useState<AdminLandlordDto | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<AdminPropertyDto | null>(null);
    const [actionLoading, setActionLoading]       = useState(false);

    const { data, isLoading, isError, isFetching, refetch } = useGetAdminDashboardQuery();

    const [approveLandlord] = useApproveLandlordMutation();
    const [rejectLandlord]  = useRejectLandlordMutation();
    const [approveProperty] = useAdminApprovePropertyMutation();
    const [rejectProperty]  = useAdminRejectPropertyMutation();

    const pendingLandlords  = data?.pendingLandlordsList  ?? [];
    const pendingProperties = data?.pendingPropertiesList ?? [];
    const cityDistribution  = data?.cityBreakdown      ?? [];

    async function handleApproveLandlord() {
        if (!selectedLandlord) return;
        setActionLoading(true);
        try {
            await approveLandlord(selectedLandlord.id).unwrap();
            setSelectedLandlord(null);
            refetch();
        } catch {
            // toast handled globally
        } finally {
            setActionLoading(false);
        }
    }

    async function handleRejectLandlord() {
        if (!selectedLandlord) return;
        setActionLoading(true);
        try {
            await rejectLandlord(selectedLandlord.id).unwrap();
            setSelectedLandlord(null);
            refetch();
        } catch {
            // toast handled globally
        } finally {
            setActionLoading(false);
        }
    }

    async function handleApproveProperty() {
        if (!selectedProperty) return;
        setActionLoading(true);
        try {
            await approveProperty(selectedProperty.id).unwrap();
            setSelectedProperty(null);
            refetch();
        } catch {
            // toast handled globally
        } finally {
            setActionLoading(false);
        }
    }

    async function handleRejectProperty() {
        if (!selectedProperty) return;
        setActionLoading(true);
        try {
            await rejectProperty(selectedProperty.id).unwrap();
            setSelectedProperty(null);
            refetch();
        } catch {
            // toast handled globally
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
                    <p className="font-medium">Failed to load admin dashboard</p>
                    <button onClick={refetch}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const hasUrgentItems = pendingLandlords.length > 0 || pendingProperties.length > 0;

    return (
        <>
            <div className="min-h-screen w-full bg-muted/30">

                <div className="border-b bg-background px-4 py-4 sm:px-8">
                    <div className="container mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold sm:text-2xl">Admin Dashboard</h1>
                                <span className="inline-flex items-center gap-1 rounded-full border bg-blue-50 border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                    <ShieldCheck className="h-3 w-3" /> VeriStay Admin
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Platform oversight · Landlord verification · Property compliance
                            </p>
                        </div>
                        <button onClick={refetch}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors sm:mt-0">
                            Refresh Data
                        </button>
                    </div>
                </div>

                {hasUrgentItems && (
                    <div className="border-b bg-red-50 px-4 py-3 sm:px-8">
                        <div className="container mx-auto flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                            <p className="text-sm text-red-800 flex-1">
                                <span className="font-semibold">Action required — </span>
                                {pendingLandlords.length > 0 && `${pendingLandlords.length} landlord${pendingLandlords.length > 1 ? 's' : ''} awaiting verification`}
                                {pendingLandlords.length > 0 && pendingProperties.length > 0 && ' · '}
                                {pendingProperties.length > 0 && `${pendingProperties.length} propert${pendingProperties.length > 1 ? 'ies' : 'y'} awaiting approval`}
                            </p>
                        </div>
                    </div>
                )}

                <div className="border-b bg-background">
                    <div className="container mx-auto overflow-x-auto px-4 sm:px-8">
                        <div className="flex gap-1 py-2">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    {tab.id === 'landlords' && pendingLandlords.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            {pendingLandlords.length}
                                        </span>
                                    )}
                                    {tab.id === 'properties' && pendingProperties.length > 0 && (
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                            {pendingProperties.length}
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
                            pendingLandlords={pendingLandlords}
                            pendingProperties={pendingProperties}
                            cityDistribution={cityDistribution}
                            onSwitchTab={setActiveTab}
                            onSelectLandlord={setSelectedLandlord}
                            onSelectProperty={setSelectedProperty}
                        />
                    )}

                    {activeTab === 'landlords' && (
                        <LandlordsTab
                            pendingLandlords={pendingLandlords}
                            onSelectLandlord={setSelectedLandlord}
                        />
                    )}

                    {activeTab === 'properties' && (
                        <PropertiesTab
                            pendingProperties={pendingProperties}
                            onSelectProperty={setSelectedProperty}
                        />
                    )}

                    {activeTab === 'disputes'   && <DisputesTab   />}
                    {activeTab === 'complaints' && <ComplaintsTab  />}
                    {activeTab === 'users'      && <UsersTab       />}
                    {activeTab === 'report'     && <ReportTab      />}

                    {activeTab === 'analytics' && (
                        <AnalyticsTab data={data} />
                    )}

                </div>
            </div>

            {selectedLandlord && (
                <LandlordReviewModal
                    landlord={selectedLandlord}
                    onApprove={handleApproveLandlord}
                    onReject={handleRejectLandlord}
                    onClose={() => setSelectedLandlord(null)}
                    isLoading={actionLoading}
                />
            )}
            {selectedProperty && (
                <PropertyReviewModal
                    property={selectedProperty}
                    onApprove={handleApproveProperty}
                    onReject={handleRejectProperty}
                    onClose={() => setSelectedProperty(null)}
                    isLoading={actionLoading}
                />
            )}
        </>
    );
}
