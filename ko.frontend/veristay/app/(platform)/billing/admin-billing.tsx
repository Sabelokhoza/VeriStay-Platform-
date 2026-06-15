import { StudentModel } from '@/app/api/model/students-model';
import DownloadInvoice from '@/components/billing/download-invoice';
import DownloadSummaryReport from '@/components/billing/download-summary-report';
import PaymentStatusUpdater from '@/components/billing/payment-status-updater';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, FileText, Loader2, Search, Shield, Users, XCircle } from 'lucide-react';
import { Suspense, useState } from 'react';
import { CoursePayment, mockInstitutionDetails, mockStudents } from './data';

const AdminBilling = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentModel | null>(null);
    const [students, setStudents] = useState<StudentModel[]>(mockStudents);

    const filteredStudents = students.filter(
        (student) =>
            student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toString().includes(searchTerm.toLowerCase()) ||
            student.psiraNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePaymentStatusUpdate = (
        paymentId: string,
        newStatus: 'paid' | 'pending' | 'overdue',
        paymentMethod?: any,
        reason?: string
    ) => {
        const now = new Date();
        const statusChange: any = {
            id: `change_${paymentId}_${now.getTime()}`,
            paymentId,
            oldStatus: '',
            newStatus,
            changedBy: 'admin',
            changedAt: now,
            changedByRole: 'admin',
            previousStatus: '',
            changeDate: now,
            reason: reason || '',
            paymentMethod,
            isManual: paymentMethod !== 'automatic',
        };

        const updateStudentPayments = (student: StudentModel) => ({
            ...student,
            coursePayments: student.coursePayments.map((payment: any) => {
                if (payment.id === paymentId) {
                    statusChange.oldStatus = payment.status;
                    statusChange.previousStatus = payment.status;
                    return {
                        ...payment,
                        status: newStatus,
                        statusHistory: [...(payment.statusHistory || []), statusChange],
                    };
                }
                return payment;
            }),
        });

        setStudents((prevStudents: any) => prevStudents.map(updateStudentPayments));

        if (selectedStudent) {
            setSelectedStudent((prevSelected) => ({
                ...prevSelected!,
                coursePayments: prevSelected!.coursePayments.map((payment: { id: string }) =>
                    payment.id === paymentId ? { ...payment, status: newStatus } : payment
                ),
            }));
        }
    };

    // Calculate billing statistics
    const totalRevenue = students.reduce(
        (sum, student) =>
            sum +
            student.coursePayments.reduce(
                (courseSum: number, payment: CoursePayment) => courseSum + payment.amount,
                0
            ),
        0
    );
    const paidPayments = students
        .flatMap((s) => s.coursePayments)
        .filter((p) => p.status === 'paid').length;
    const pendingPayments = students
        .flatMap((s) => s.coursePayments)
        .filter((p) => p.status === 'pending').length;
    const overduePayments = students
        .flatMap((s) => s.coursePayments)
        .filter((p) => p.status === 'overdue').length;

    return (
        <div className="space-y-8">
            {/* Billing Statistics */}
            <section>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">System Billing Management</h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage all student payments and billing across the platform
                    </p>
                </div>

                {/* Summary Report Download */}
                <div className="mb-6 flex justify-end">
                    <DownloadSummaryReport
                        students={students}
                        reportTitle="System-wide Billing Summary"
                        generatedBy="System Administrator"
                        institutionDetails={mockInstitutionDetails}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Revenue
                                    </p>
                                    <p className="text-2xl font-bold">
                                        R {totalRevenue.toLocaleString()}
                                    </p>
                                </div>
                                <Shield className="h-4 w-4 text-muted-foreground ml-auto" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Paid Payments
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {paidPayments}
                                    </p>
                                </div>
                                <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Pending Payments
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {pendingPayments}
                                    </p>
                                </div>
                                <Loader2 className="h-4 w-4 text-yellow-500 ml-auto" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Overdue Payments
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {overduePayments}
                                    </p>
                                </div>
                                <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section>
                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    All Students
                                </div>
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Search by name, ID or PSiRA number"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="space-y-2 max-h-96 overflow-y-auto">
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
                                            <div className="font-medium">
                                                {student.firstName} {student.lastName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {student.id}
                                                {student.psiraNumber &&
                                                    ` • PSiRA: ${student.psiraNumber}`}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {student.coursePayments.length} payments • R{' '}
                                                {student.coursePayments
                                                    .reduce(
                                                        (sum: number, payment: CoursePayment) =>
                                                            sum + payment.amount,
                                                        0
                                                    )
                                                    .toLocaleString()}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedStudent ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Course Payments</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedStudent.firstName} {selectedStudent.lastName}
                                        &apos;s billing information
                                    </p>
                                </div>
                                <Suspense
                                    key={selectedStudent.id}
                                    fallback={
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center justify-between"
                                            disabled={true}
                                        >
                                            <Loader2 className="animate-spin" />
                                            Please wait
                                        </Button>
                                    }
                                >
                                    <DownloadInvoice
                                        student={selectedStudent}
                                        coursePayments={selectedStudent.coursePayments}
                                        institutionDetails={mockInstitutionDetails}
                                    />
                                </Suspense>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {selectedStudent.coursePayments.map(
                                        (payment: CoursePayment) => (
                                            <div
                                                key={payment.id}
                                                className="flex items-center justify-between p-4 rounded-lg border bg-muted/5"
                                            >
                                                <div className="space-y-1 flex-1">
                                                    <div className="font-medium">
                                                        {payment.courseName}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Registered:{' '}
                                                        {new Date(
                                                            payment.registrationDate
                                                        ).toLocaleDateString('en-ZA')}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <PaymentStatusUpdater
                                                        payment={payment}
                                                        onStatusUpdate={handlePaymentStatusUpdate}
                                                        userRole="admin"
                                                        userName="Administrator"
                                                    />
                                                    <span className="font-medium">
                                                        R {payment.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    <div className="flex justify-between items-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                                        <div className="font-medium">Total Amount</div>
                                        <div className="font-bold">
                                            R{' '}
                                            {selectedStudent.coursePayments
                                                .reduce(
                                                    (sum: number, payment: CoursePayment) =>
                                                        sum + payment.amount,
                                                    0
                                                )
                                                .toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                                <FileText className="h-8 w-8 mb-4" />
                                <h3 className="font-medium mb-2">No Student Selected</h3>
                                <p className="text-sm">
                                    Select a student to view their billing information and generate
                                    invoices.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminBilling;
