'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Course = {
    id: string;
    title: string;
    description: string;
    duration: number;
    students: number;
    psiraLevel: string;
    price: number;
    status: 'active' | 'draft' | 'archived';
};

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: 'title',
        header: 'Course Title',
    },
    {
        accessorKey: 'psiraLevel',
        header: 'PSiRA Level',
        cell: ({ row }) => {
            return <Badge variant="secondary">{row.getValue('psiraLevel')}</Badge>;
        },
    },
    {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => {
            return `${row.getValue('duration')} hours`;
        },
    },
    {
        accessorKey: 'students',
        header: 'Students',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            return `R${row.getValue<string>('price').toLocaleString()}`;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge
                    variant={
                        status === 'active'
                            ? 'default'
                            : status === 'draft'
                              ? 'secondary'
                              : 'destructive'
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const course = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course.id)}>
                            Copy course ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => (window.location.href = `/courses/${course.id}/edit`)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                // TODO: Implement delete functionality
                                if (confirm('Are you sure you want to delete this course?')) {
                                    // await deleteCourse(course.id);
                                }
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
