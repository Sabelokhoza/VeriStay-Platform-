'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CertificationFormValues, certificationSchema } from './admin-manage-page';

interface Student {
    id: string;
    name: string;
    email: string;
    studentId: string;
    certifications: Array<
        CertificationFormValues & { status: 'pending' | 'approved' | 'rejected' }
    >;
}

// Mock data - replace with actual API call
const mockStudents: Student[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        studentId: 'STU001',
        certifications: [
            {
                psiraGrade: 'A',
                certificateNumber: 'CERT001',
                issueDate: '2025-07-01',
                issuer: 'PSIRA',
                status: 'approved',
                file: new File([], 'dummy.pdf'),
            },
        ],
    },
];

export default function PartnerManagePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm({
        resolver: zodResolver(certificationSchema),
        defaultValues: {
            psiraGrade: 'A' as const,
            issueDate: '',
            certificateNumber: '',
            issuer: '',
            file: undefined,
        },
    });

    const getStatusClassNames = (status: 'pending' | 'approved' | 'rejected') => {
        if (status === 'approved') return 'bg-green-100 text-green-800';
        if (status === 'rejected') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    async function onSubmit(data: CertificationFormValues) {
        if (!selectedStudent) return;

        try {
            setIsUploading(true);
            // TODO: Implement certificate upload logic
            selectedStudent.certifications.push({ ...data, status: 'pending' });
            setSelectedStudent({ ...selectedStudent });

            toast({
                title: 'Success',
                description: 'Certificate uploaded successfully',
            });
            form.reset();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to upload certificate',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    }

    const filteredStudents = mockStudents.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <section>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Student Certifications</h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage certifications for your enrolled students
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Students</span>
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Search by name, ID or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="space-y-2">
                                    {filteredStudents.map((student) => (
                                        <button
                                            key={student.id}
                                            onClick={() => setSelectedStudent(student)}
                                            className={`w-full p-3 text-left rounded-lg border transition-colors cursor-pointer ${
                                                selectedStudent?.id === student.id
                                                    ? 'bg-primary/5 border-primary'
                                                    : 'hover:bg-muted/50 border-muted'
                                            }`}
                                        >
                                            <div className="font-medium">{student.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {student.studentId} • {student.email}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedStudent ? (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upload New Certificate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="space-y-4"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="psiraGrade"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>PSIRA Grade</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select grade" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="A">
                                                                    Grade A
                                                                </SelectItem>
                                                                <SelectItem value="B">
                                                                    Grade B
                                                                </SelectItem>
                                                                <SelectItem value="C">
                                                                    Grade C
                                                                </SelectItem>
                                                                <SelectItem value="D">
                                                                    Grade D
                                                                </SelectItem>
                                                                <SelectItem value="E">
                                                                    Grade E
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="issueDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Issue Date</FormLabel>
                                                        <Input type="date" {...field} />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="certificateNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Certificate Number</FormLabel>
                                                        <Input {...field} />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="issuer"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Issuer</FormLabel>
                                                        <Input {...field} />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="file"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Certificate File</FormLabel>
                                                        <FileUpload
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={field.onChange}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" disabled={isUploading}>
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Upload Certificate
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Certifications</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedStudent.name}&apos;s certifications
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Certificate #</TableHead>
                                                <TableHead>Issue Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedStudent.certifications.map((cert) => (
                                                <TableRow key={cert.certificateNumber}>
                                                    <TableCell>
                                                        PSIRA Grade {cert.psiraGrade}
                                                    </TableCell>
                                                    <TableCell>{cert.certificateNumber}</TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            cert.issueDate
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassNames(cert.status)}`}
                                                        >
                                                            {cert.status.charAt(0).toUpperCase() +
                                                                cert.status.slice(1)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const index =
                                                                    selectedStudent.certifications.findIndex(
                                                                        (c) =>
                                                                            c.certificateNumber ===
                                                                            cert.certificateNumber
                                                                    );
                                                                if (index > -1) {
                                                                    selectedStudent.certifications.splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                    setSelectedStudent({
                                                                        ...selectedStudent,
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                                <h3 className="font-medium mb-2">No Student Selected</h3>
                                <p className="text-sm">
                                    Select a student to view and manage their certifications.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
}
