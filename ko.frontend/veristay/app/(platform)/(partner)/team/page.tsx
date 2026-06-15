'use client';

import { DataTable } from '@/components/shared/data-table';
import React from 'react';
import { getColumns } from './mock';
import Header from '@/components/shared/header';
import { useAppSelector } from '@/app/store/store';
import { useGetCentreAdminByCentreQuery } from '@/app/errors/trainingCenterApi';
import Loading from '../../loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AddMemberModal } from './add-member-modal';

const TeamPage = () => {
    const selectedCentreId = useAppSelector((state) => state.trainingCentreStore?.selectedCentreId);
    console.log('Selected Centre ID:', selectedCentreId);

    const { isLoading, data, error, refetch } = useGetCentreAdminByCentreQuery(selectedCentreId, {
        skip: !selectedCentreId,
    });

    const columns = getColumns(refetch);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading team members: {JSON.stringify(error)}</div>;
    }

    return (
        <div>
            <Header title="Team Members" description="Manage your team members here." />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between"></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Team Members</h3>
                                <div className="flex flex-row items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        View and manage team members
                                    </p>
                                    <AddMemberModal
                                        onSuccess={() => {
                                            refetch();
                                        }}
                                    />
                                </div>
                            </div>
                            <DataTable columns={columns} data={data?.data || []} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamPage;
