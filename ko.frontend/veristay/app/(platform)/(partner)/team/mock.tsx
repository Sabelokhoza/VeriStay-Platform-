import {
    ProfileDto,
    useDeactivateOrActivateCentreAdminMutation,
} from '@/app/errors/trainingCenterApi';
import { Button } from '@heroui/react';
import { ColumnDef } from '@tanstack/react-table';

function ActionCell({ row, refetch }: { row: { original: ProfileDto }; refetch: () => void }) {
    const { id, isActive } = row.original;
    const [deactivateOrActivate, { isLoading }] = useDeactivateOrActivateCentreAdminMutation();

    const handleToggle = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this user? They wont be able to access your centre information!`
        );
        if (!confirmed) return;

        try {
            await deactivateOrActivate(id).unwrap();
            refetch();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    return (
        <Button
            disabled={isLoading}
            onClick={handleToggle}
            className={`
                inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium
                transition-all duration-150 cursor-pointer border
                ${
                    isActive
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            <span className={`size-1.5 rounded-full ${isActive ? 'bg-red-500' : 'bg-blue-500'}`} />
            {isLoading ? 'Updating…' : isActive ? 'Deactivate' : 'Activate'}
        </Button>
    );
}
export const getColumns = (refetch: () => void): ColumnDef<ProfileDto>[] => [
    { header: 'First Name', accessorKey: 'firstName' },
    { header: 'Last Name', accessorKey: 'lastName' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Phone Number', accessorKey: 'phoneNumber' },
    { header: 'Date Added', accessorKey: 'dateCreated' },
    { header: 'Added By', accessorKey: 'assistantName' },
    { header: 'Is Active', accessorKey: 'isActive' },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => <ActionCell row={row} refetch={refetch} />,
    },
];

export const data = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: 'Teacher',
    },
    {
        id: 3,
        firstName: 'Asha',
        lastName: 'Khan',
        email: 'asha.khan@example.com',
        role: 'Designer',
    },
    {
        id: 4,
        firstName: 'Miguel',
        lastName: 'Perez',
        email: 'miguel.perez@example.com',
        role: 'Manager',
    },
    { id: 5, firstName: 'Liu', lastName: 'Wang', email: 'liu.wang@example.com', role: 'QA' },
    {
        id: 6,
        firstName: 'Olivia',
        lastName: 'Brown',
        email: 'olivia.brown@example.com',
        role: 'Support',
    },
    {
        id: 7,
        firstName: 'Noah',
        lastName: 'Wilson',
        email: 'noah.wilson@example.com',
        role: 'Developer',
    },
    {
        id: 8,
        firstName: 'Emma',
        lastName: 'Johnson',
        email: 'emma.johnson@example.com',
        role: 'Teacher',
    },
    {
        id: 9,
        firstName: 'Carlos',
        lastName: 'Garcia',
        email: 'carlos.garcia@example.com',
        role: 'Admin',
    },
    {
        id: 10,
        firstName: 'Sofia',
        lastName: 'Martinez',
        email: 'sofia.martinez@example.com',
        role: 'Product',
    },
];
