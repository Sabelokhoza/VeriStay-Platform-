'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@heroui/react';
import { FileDown, Loader2 } from 'lucide-react';
import { SummaryReportPDF } from './summary-report-pdf';
import { StudentModel } from '@/app/api/model/students-model';

interface DownloadSummaryReportProps {
    students: StudentModel[];
    reportTitle: string;
    generatedBy: string;
    institutionDetails?: {
        name: string;
        registrationNumber: string;
        address: string;
        contactEmail: string;
        phone: string;
    };
}

const DownloadSummaryReport: React.FC<DownloadSummaryReportProps> = ({
    students,
    reportTitle,
    generatedBy,
    institutionDetails,
}) => {
    const fileName = `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;

    return (
        <PDFDownloadLink
            document={
                <SummaryReportPDF
                    students={students}
                    reportTitle={reportTitle}
                    generatedBy={generatedBy}
                    institutionDetails={institutionDetails}
                />
            }
            fileName={fileName}
        >
            {({ blob, url, loading, error }) => (
                <Button
                    type="button"
                    variant="solid"
                    color="primary"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <FileDown className="h-4 w-4" />
                    )}
                    {loading ? 'Generating...' : 'Download Summary'}
                </Button>
            )}
        </PDFDownloadLink>
    );
};

export default DownloadSummaryReport;
