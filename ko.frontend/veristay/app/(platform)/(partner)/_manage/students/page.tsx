'use client';
import Header from '@/components/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { AddStudentModal } from './add-student-modal';
import { columns } from './columns';
import { useAppSelector } from '@/app/store/store';
import Loading from '@/app/(platform)/loading';
import { useGetCentreStudentsDetailsQuery } from '@/app/errors/trainingCenterApi';

export default function StudentsPage() {
    const selectedCentreId = useAppSelector((state) => state.trainingCentreStore?.selectedCentreId);

    const { data, error, isLoading, refetch } = useGetCentreStudentsDetailsQuery(selectedCentreId, {
        skip: !selectedCentreId,
    });

    if (!selectedCentreId) {
        return <div>Please select a training centre first.</div>;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading centre students: {JSON.stringify(error)}</div>;
    }

    return (
        <div>
            <Header title="Manage Students" description="Add, edit, and manage student accounts" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between"></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Student List</h3>
                                <div className="flex flex-row items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        View and manage enrolled students
                                    </p>
                                    <AddStudentModal
                                        onSuccess={() => {
                                            refetch();
                                        }}
                                    />
                                </div>
                            </div>
                            <DataTable columns={columns} data={data.data} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
