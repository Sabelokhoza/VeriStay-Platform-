'use client';

import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import { StudentInvoicePDF } from '@/components/billing/invoice-pdf';
import { StudentModel } from '@/app/api/model/students-model';

// Dynamically import PDFDownloadLink with no SSR
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

interface InstitutionDetails {
    name: string;
    registrationNumber: string;
    address: string;
    contactEmail: string;
    phone: string;
}

interface GenerateInvoiceButtonProps {
    readonly student: StudentModel;
    readonly institutionDetails: InstitutionDetails;
}

export function GenerateInvoiceButton({
    student,
    institutionDetails,
}: Readonly<GenerateInvoiceButtonProps>) {
    return (
        <PDFDownloadLink
            document={
                <StudentInvoicePDF
                    invoiceNumber={`INV-${Date.now()}`}
                    dateIssued={new Date().toISOString()}
                    dueDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
                    studentDetails={student}
                    institutionDetails={institutionDetails}
                    coursePayments={student.coursePayments}
                />
            }
            fileName={`invoice-${student.id}-${new Date().toISOString().split('T')[0]}.pdf`}
        >
            {({ loading }) => (
                <Button size="sm" disabled={loading}>
                    <FileText className="h-4 w-4 mr-2" />
                    {loading ? 'Generating...' : 'Generate Invoice'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
