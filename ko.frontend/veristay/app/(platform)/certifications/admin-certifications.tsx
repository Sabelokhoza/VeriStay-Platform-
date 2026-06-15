'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { pdf } from '@react-pdf/renderer';
import { CertificatePDF } from '@/components/certification/certificate-pdf';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileText,
    Search,
    Settings,
    ShieldCheck,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { Certification, CertificationStatus, PSiRAGrade } from './data/mock';
import { mockCertifications } from './data/mock';

const AdminCertifications = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<CertificationStatus | 'all'>('all');

    // Get unique students
    const students = Array.from(new Set(mockCertifications.map((cert) => cert.studentId)))
        .map((studentId) => {
            const studentCerts = mockCertifications.filter((cert) => cert.studentId === studentId);
            return {
                id: studentId,
                name: studentCerts[0]?.studentName || 'Unknown',
                certificationCount: studentCerts.length,
                activeCerts: studentCerts.filter((cert) => cert.status === 'active').length,
                expiredCerts: studentCerts.filter((cert) => cert.status === 'expired').length,
                pendingCerts: studentCerts.filter((cert) => cert.status === 'pending').length,
            };
        })
        .filter((student) => student.id);

    // Filter students based on search
    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to count certifications by PSiRA grade
    const countByGrade = (certifications: Certification[]) => {
        const grades: PSiRAGrade[] = ['A', 'B', 'C', 'D', 'E'];
        return grades.map((grade) => ({
            grade,
            count: certifications.filter((cert) => cert.level === `Grade ${grade}`).length,
        }));
    };

    const gradeStats = countByGrade(mockCertifications);

    // Calculate overall statistics
    const totalCertifications = mockCertifications.length;
    const activeCertifications = mockCertifications.filter(
        (cert) => cert.status === 'active'
    ).length;
    const expiredCertifications = mockCertifications.filter(
        (cert) => cert.status === 'expired'
    ).length;
    const pendingCertifications = mockCertifications.filter(
        (cert) => cert.status === 'pending'
    ).length;

    const handleViewCertificate = async (cert: Certification) => {
        const blob = await pdf(
            <CertificatePDF recipientName={cert.studentName || 'Student'} certification={cert} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleDownloadCertificate = async (cert: Certification) => {
        const blob = await pdf(
            <CertificatePDF recipientName={cert.studentName || 'Student'} certification={cert} />
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

    const handleEditCertificate = (cert: Certification) => {
        // Navigate to edit certificate page or open edit modal
        alert(
            `Edit Certificate: ${cert.title}\nPSiRA Number: ${cert.psiraNumber}\nStatus: ${cert.status}`
        );
        // In a real app, this might open a modal or navigate to an edit form
        // window.location.href = `/admin/certifications/${cert.id}/edit`;
    };

    const handleApproveCertificate = (cert: Certification) => {
        console.log('Approving certificate:', cert);
        // In a real app, this would update the certificate status
    };

    const handleRejectCertificate = (cert: Certification) => {
        console.log('Rejecting certificate:', cert);
        // In a real app, this would update the certificate status
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'expired':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-500" />;
        }
    };

    // Filter certifications for selected student
    const selectedStudentCertifications = selectedStudentId
        ? mockCertifications.filter((cert) => cert.studentId === selectedStudentId)
        : [];

    const filteredCertifications =
        statusFilter === 'all'
            ? selectedStudentCertifications
            : selectedStudentCertifications.filter((cert) => cert.status === statusFilter);

    return (
        <div className="space-y-8">
            {/* Header */}
            <section>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Certification Management</h1>
                    <p className="mt-2 text-muted-foreground">
                        View all certification statistics and manage the certification process
                    </p>
                </div>

                {/* Overall Statistics */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Certificates
                                    </p>
                                    <p className="text-2xl font-bold">{totalCertifications}</p>
                                </div>
                                <div className="ml-auto p-2 bg-blue-50 rounded-lg">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Active
                                    </p>
                                    <p className="text-2xl font-bold">{activeCertifications}</p>
                                </div>
                                <div className="ml-auto p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Expired
                                    </p>
                                    <p className="text-2xl font-bold">{expiredCertifications}</p>
                                </div>
                                <div className="ml-auto p-2 bg-red-50 rounded-lg">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Pending
                                    </p>
                                    <p className="text-2xl font-bold">{pendingCertifications}</p>
                                </div>
                                <div className="ml-auto p-2 bg-yellow-50 rounded-lg">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grade Statistics */}
                <div className="grid gap-4 md:grid-cols-5">
                    {gradeStats.map(({ grade, count }) => {
                        const getGradeColor = (g: string) => {
                            switch (g) {
                                case 'A':
                                    return {
                                        border: 'border-l-purple-500',
                                        bg: 'bg-purple-50',
                                        text: 'text-purple-600',
                                    };
                                case 'B':
                                    return {
                                        border: 'border-l-blue-500',
                                        bg: 'bg-blue-50',
                                        text: 'text-blue-600',
                                    };
                                case 'C':
                                    return {
                                        border: 'border-l-green-500',
                                        bg: 'bg-green-50',
                                        text: 'text-green-600',
                                    };
                                case 'D':
                                    return {
                                        border: 'border-l-yellow-500',
                                        bg: 'bg-yellow-50',
                                        text: 'text-yellow-600',
                                    };
                                case 'E':
                                    return {
                                        border: 'border-l-orange-500',
                                        bg: 'bg-orange-50',
                                        text: 'text-orange-600',
                                    };
                                default:
                                    return {
                                        border: 'border-l-gray-500',
                                        bg: 'bg-gray-50',
                                        text: 'text-gray-600',
                                    };
                            }
                        };
                        const colors = getGradeColor(grade);

                        return (
                            <Card key={grade} className={`border-l-4 ${colors.border}`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                PSiRA Grade {grade}
                                            </p>
                                            <p className="text-2xl font-bold">{count}</p>
                                        </div>
                                        <div className={`ml-auto p-2 ${colors.bg} rounded-lg`}>
                                            <ShieldCheck className={`h-5 w-5 ${colors.text}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Student Management */}
            <section>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">All Certificates</h2>
                    <p className="mt-2 text-muted-foreground">View and manage all certifications</p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                    {/* Students List */}
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
                                    placeholder="Search by name or ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredStudents.map((student) => (
                                        <button
                                            key={student.id}
                                            onClick={() => setSelectedStudentId(student.id || null)}
                                            className={`w-full p-3 text-left rounded-lg border transition-colors cursor-pointer ${
                                                selectedStudentId === student.id
                                                    ? 'bg-primary/5 border-primary'
                                                    : 'hover:bg-muted/50 border-muted'
                                            }`}
                                        >
                                            <div className="font-medium">{student.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {student.id} • {student.certificationCount}{' '}
                                                total
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                <Badge variant="default" className="text-xs">
                                                    {student.activeCerts} active
                                                </Badge>
                                                {student.pendingCerts > 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {student.pendingCerts} pending
                                                    </Badge>
                                                )}
                                                {student.expiredCerts > 0 && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="text-xs"
                                                    >
                                                        {student.expiredCerts} expired
                                                    </Badge>
                                                )}
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
                                        {students.find((s) => s.id === selectedStudentId)?.name}
                                        certifications
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(
                                                e.target.value as CertificationStatus | 'all'
                                            )
                                        }
                                        className="text-sm border rounded px-2 py-1"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {filteredCertifications.map((cert) => (
                                        <div
                                            key={cert.id}
                                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/5"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(cert.status)}
                                                    <div className="font-medium">{cert.title}</div>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}
                                                    >
                                                        {cert.status.charAt(0).toUpperCase() +
                                                            cert.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    PSiRA: {cert.psiraNumber} • Level: {cert.level}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {cert.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleApproveCertificate(cert)
                                                            }
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRejectCertificate(cert)
                                                            }
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
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
                                                    onClick={() => handleDownloadCertificate(cert)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditCertificate(cert)}
                                                >
                                                    <Settings className="h-4 w-4" />
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
                                    Select a student to view their certification details and manage
                                    their certificates.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminCertifications;
