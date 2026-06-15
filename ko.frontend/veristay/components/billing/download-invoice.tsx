'use client';

import { CourseEnrollmentPaymentModel } from '@/app/errors/studentApi';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CircleDot, FileText } from 'lucide-react';
import { StudentInvoicePDF } from './invoice-pdf';
import { StudentModel } from '@/app/api/model/students-model';
import { userDto } from '@/app/api/dtos/dtos';
import { StudentBillingDetails } from '@/app/api/model/billing-model';

interface DownloadInvoiceProps {
    student: userDto | StudentModel;
    coursePayments: CourseEnrollmentPaymentModel[];
    institutionDetails?: {
        name: string;
        registrationNumber: string;
        address: string;
        contactEmail: string;
        phone: string;
    };
    label?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function DownloadInvoice({
    student,
    coursePayments,
    institutionDetails = {
        name: 'Trainers Council',
        registrationNumber: 'Pending',
        address: '123 Training Street, Education City',
        contactEmail: 'accounts@trainerscouncil.co.za',
        phone: '+27 12 345 6789',
    },
    label = 'Download Statement',
    variant = 'outline',
    size = 'sm',
}: Readonly<DownloadInvoiceProps>) {
    // Map CourseEnrollmentPaymentModel to format expected by StudentInvoicePDF (StudentBillingDetails)
    // Note: StudentInvoicePDF expects amount as number, but CourseEnrollmentPaymentModel has it as string
    const mappedPayments: any[] = coursePayments.map((p) => ({
        id: p.id.toString(),
        courseName: p.courseName,
        registrationDate: p.registrationDate,
        amount: parseFloat(p.amount),
        status: p.status,
        method: p.method,
        isManualPayment: p.isManualPayment,
        lastModifiedBy: p.lastModifiedBy,
        lastModifiedDate: p.lastModifiedDate || '',
    }));

    // Adapt student (userDto) to StudentModel format roughly if needed or update PDF to use userDto
    // StudentInvoicePDF expects studentDetails: StudentModel.
    // Let's create a compatible object.
    const studentForPdf: any = {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        address: '', // userDto might not have address
        psiraNumber: '', // userDto might not have psiraNumber unless in claims
    };

    return (
        <div suppressHydrationWarning>
            {typeof window !== 'undefined' && (
                <PDFDownloadLink
                    document={
                        <StudentInvoicePDF
                            invoiceNumber={`INV-${Date.now()}`}
                            dateIssued={new Date().toISOString()}
                            dueDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
                            studentDetails={studentForPdf}
                            institutionDetails={institutionDetails}
                            coursePayments={mappedPayments}
                        />
                    }
                    fileName={`${label.toLowerCase().replace(' ', '-')}-${student.firstName}-${student.lastName}.pdf`}
                >
                    {({ loading }) => (
                        <Button
                            size={size}
                            disabled={loading}
                            variant={variant}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <CircleDot className="animate-spin h-4 w-4" />
                            ) : (
                                <FileText className="h-4 w-4" />
                            )}
                            {label}
                        </Button>
                    )}
                </PDFDownloadLink>
            )}
        </div>
    );
}
