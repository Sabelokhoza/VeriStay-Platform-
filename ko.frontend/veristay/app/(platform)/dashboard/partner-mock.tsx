import { ColumnDef } from '@tanstack/react-table';

type Course = {
    id: string;
    tittle: string; // ✅ back to your actual field name
    inProgress: number;
    completed: number;
    status: string;
};

const mockcolumns: ColumnDef<Course>[] = [
    {
        id: 'course',
        header: 'PSIRA Course',
        accessorKey: 'tittle', // ✅ reverted back
    },
    {
        id: 'inProgress',
        header: 'In Progress',
        accessorKey: 'inProgress',
    },
    {
        id: 'completed',
        header: 'Completed',
        accessorKey: 'completed',
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        filterFn: (row, id, value) => value.includes(row.getValue(id)), // ✅ filter fix
    },
];

export { mockcolumns };
