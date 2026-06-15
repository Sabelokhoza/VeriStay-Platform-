import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const gradeColors: Record<string, string> = {
    'Grade A': 'bg-green-100 text-green-800',
    'Grade B': 'bg-blue-100 text-blue-800',
    'Grade C': 'bg-yellow-100 text-yellow-800',
    'Grade D': 'bg-orange-100 text-orange-800',
    'Grade E': 'bg-red-100 text-red-800',
};

type CentreStudent = {
    personId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    grade?: string | null;
    isActive?: boolean | null;
};

export const columns: ColumnDef<CentreStudent>[] = [
    {
        id: 'course',
        accessorFn: (row) => row.name,
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'grade',
        header: 'PSiRA Grade',
        cell: ({ row }) => {
            const grade = row.getValue('grade') as string;
            return grade ? (
                <Badge variant="outline" className={`font-mono ${gradeColors[grade] || ''}`}>
                    {grade}
                </Badge>
            ) : (
                <span className="text-muted-foreground text-sm">Not enrolled</span>
            );
        },
    },
    {
        id: 'status',
        accessorKey: 'isActive',
        header: 'Status',
        filterFn: (row, id, value) => {
            const status = row.getValue(id) ? 'Active' : 'Inactive';
            return value.includes(status);
        },
        cell: ({ row }) => {
            const status = (row.getValue('status') as boolean) ? 'Active' : 'Inactive';
            return (
                <Badge
                    variant={status === 'Active' ? 'default' : 'secondary'}
                    className="capitalize"
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const student = row.original;
            return (
                <Link href={`/students/${student.personId}`}>
                    <Button variant="default" size="sm" className="border-primary">
                        View Details
                    </Button>
                </Link>
            );
        },
    },
];
