'use client';

import {
    GetUserCertificationDto,
    useGetTrainingCenterCertificationsSummaryQuery,
} from '@/app/errors/trainingCenterApi';
import { useAppSelector } from '@/app/store/store';
import { CertificatePDF } from '@/components/certification/certificate-pdf';
import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { pdf } from '@react-pdf/renderer';
import { Download, Eye, FileText, Search, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';
import Loading from '../loading';

const PartnerCertifications = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const selectedCentreId = useAppSelector((state) => state.trainingCentreStore?.selectedCentreId);
    const { data, isLoading, error } = useGetTrainingCenterCertificationsSummaryQuery(
        selectedCentreId || 0
    );

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading certifications summary: {JSON.stringify(error)}</div>;
    }

    const summaryData = data?.data;
    const mockCertifications = summaryData?.certifications || [];

    const students = summaryData?.studentCertificcationsSummaries || [];

    const filteredStudents = students.filter(
        (student) =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.userid?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const colours = ['blue', 'green', 'yellow', 'orange', 'red'];

    const handleViewCertificate = async (cert: GetUserCertificationDto) => {
        const student = students.find((s) => s.userid === cert.studentId);
        const name = cert.studentName || student?.fullName || 'Student';

        // Ensure cert matches CertificatePDF expectations (casting or mapping)
        // GetUserCertificationDto id is number, PDF expects number or string (we updated mock to accept both, but PDF component props still strict?)
        // CertificatePDFProps expects: certification: { title, psiraNumber, issueDate, expiryDate, level, authority }
        // We might need to ensure fields exist.
        const certData = {
            ...cert,
            expiryDate: cert.expiryDate || undefined,
            status: cert.status as any,
        };

        const blob = await pdf(
            <CertificatePDF recipientName={name} certification={certData} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleDownloadCertificate = async (cert: GetUserCertificationDto) => {
        const student = students.find((s) => s.userid === cert.studentId);
        const name = cert.studentName || student?.fullName || 'Student';

        const certData = {
            ...cert,
            expiryDate: cert.expiryDate || undefined,
            status: cert.status as any,
        };

        const blob = await pdf(
            <CertificatePDF recipientName={name} certification={certData} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cert.title}-certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Valid':
                return 'bg-green-100 text-green-800';
            case 'Expired':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <Header
                title={'Student Certifications'}
                description={'Statistics and management of student certifications'}
            />
            <section>
                {/* Grade Statistics */}
                <div className="grid gap-4 md:grid-cols-5 mb-8">
                    {summaryData?.gradesSummaries.map((summary, index) => {
                        return (
                            <EnrollmentCard
                                key={summary.tittle}
                                title={`Grade ${summary.tittle}`}
                                totalNumber={summary.count}
                                icon={ShieldCheck}
                                color={colours[index % colours.length]}
                            />
                        );
                    })}
                </div>
            </section>

            {/* Student Management */}
            <section>
                <Subheading
                    title={'Student Management'}
                    description={'Manage student certifications and view details'}
                />

                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                    {/* Students List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Students
                                </div>
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Search by name or ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredStudents.map((student) => (
                                        <button
                                            key={student.userid}
                                            onClick={() =>
                                                setSelectedStudentId(student.userid || null)
                                            }
                                            className={`w-full p-3 text-left rounded-lg border transition-colors cursor-pointer ${
                                                selectedStudentId === student.userid
                                                    ? 'bg-primary/5 border-primary'
                                                    : 'hover:bg-muted/50 border-muted'
                                            }`}
                                        >
                                            <div className="font-medium">{student.fullName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                • {student.certificationCount} certification(s)
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certificate Details */}
                    {selectedStudentId ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Student Certifications</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {
                                            students.find((s) => s.userid === selectedStudentId)
                                                ?.fullName
                                        }
                                        's certifications
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockCertifications
                                        .filter((cert) => cert.studentId === selectedStudentId)
                                        .map((cert) => (
                                            <div
                                                key={cert.id}
                                                className="flex items-center justify-between p-4 rounded-lg border bg-muted/5"
                                            >
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium">
                                                            {cert.title}
                                                        </div>
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}
                                                        >
                                                            {cert.status.charAt(0).toUpperCase() +
                                                                cert.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        PSiRA: {cert.psiraNumber} • Level:{' '}
                                                        {cert.level}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Issued:{' '}
                                                        {new Date(
                                                            cert.issueDate
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewCertificate(cert)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDownloadCertificate(cert)
                                                        }
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                                <FileText className="h-8 w-8 mb-4" />
                                <h3 className="font-medium mb-2">No Student Selected</h3>
                                <p className="text-sm">
                                    Select a student to view their certification details.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PartnerCertifications;
