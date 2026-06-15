import { useAppSelector } from '@/app/store/store';
import { Certification, getStatusColor } from '@/app/(platform)/certifications/data/mock';
import { Card, CardHeader } from '@heroui/react';
import { pdf } from '@react-pdf/renderer';
import { BadgeCheck, CalendarDays, Download, Eye, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { CardContent, CardTitle } from '../ui/card';
import { CertificatePDF } from './certificate-pdf';

const CertificationCard = ({ cert }: { cert: Certification }) => {
    const user = useAppSelector((state) => state.userAuthStore);

    // Logic to determine the best display name
    let displayName = 'Student';

    if (user.firstName && user.lastName) {
        displayName = `${user.firstName} ${user.lastName}`;
    } else if (cert.studentName) {
        displayName = cert.studentName;
    }

    const studentName = displayName;

    const handleViewCertificate = async (cert: Certification) => {
        const blob = await pdf(
            <CertificatePDF recipientName={studentName} certification={cert} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleDownloadCertificate = async (cert: Certification) => {
        const blob = await pdf(
            <CertificatePDF recipientName={studentName} certification={cert} />
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
    return (
        <Card
            key={cert.id}
            className="border hover:shadow-md border-blue-500/40 shadow-sm rounded mb-4 gap-6"
        >
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="px-2 flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5 text-blue-500" />
                        {cert.title}
                    </span>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}
                    >
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <dt className="text-muted-foreground min-w-[100px]">PSiRA Number</dt>
                        <dd className="font-medium">{cert.psiraNumber}</dd>
                    </div>
                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <dt className="text-muted-foreground min-w-[100px]">Issue Date</dt>
                        <dd className="font-medium">
                            {new Date(cert.issueDate).toLocaleDateString()}
                        </dd>
                    </div>
                    <div className="flex items-center gap-3">
                        <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                        <dt className="text-muted-foreground min-w-[100px]">Level</dt>
                        <dd className="font-medium">{cert.level}</dd>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCertificate(cert)}
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCertificate(cert)}
                        className="flex-1 flex items-center justify-center gap-2 border-primary"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CertificationCard;
