export type CertificationStatus = 'active' | 'expired' | 'pending';
export type PSiRAGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export const getStatusColor = (status: string) => {
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

export interface Certification {
    id: string | number;
    title: string;
    psiraNumber: string;
    issueDate: string;

    level: string;
    status: CertificationStatus | string;
    authority: string;
    studentId?: string | null;
    studentName?: string | null;
}

export const mockCertifications: Certification[] = [
    {
        id: '1',
        title: 'PSiRA Grade E Certification',
        psiraNumber: 'PSIRA-123456',
        issueDate: '2023-01-15',
        level: 'Grade E',
        status: 'active',
        authority: 'Private Security Industry Regulatory Authority',
        studentId: '1',
        studentName: 'John Doe',
    },
    {
        id: '2',
        title: 'PSiRA Grade D Certification',
        psiraNumber: 'PSIRA-789012',
        issueDate: '2023-06-01',
        level: 'Grade D',
        status: 'active',
        authority: 'Private Security Industry Regulatory Authority',
        studentId: 'STD002',
        studentName: 'Jane Smith',
    },
    {
        id: '3',
        title: 'PSiRA Grade C Certification',
        psiraNumber: 'PSIRA-345678',
        issueDate: '2022-12-01',
        level: 'Grade C',
        status: 'expired',
        authority: 'Private Security Industry Regulatory Authority',
        studentId: 'STD003',
        studentName: 'Mike Johnson',
    },
    {
        id: '4',
        title: 'PSiRA Grade B Certification',
        psiraNumber: 'PSIRA-901234',
        issueDate: '2023-09-01',
        level: 'Grade B',
        status: 'pending',
        authority: 'Private Security Industry Regulatory Authority',
        studentId: 'STD004',
        studentName: 'Sarah Wilson',
    },
    {
        id: '5',
        title: 'PSiRA Grade A Certification',
        psiraNumber: 'PSIRA-567890',
        issueDate: '2023-07-15',
        level: 'Grade A',
        status: 'active',
        authority: 'Private Security Industry Regulatory Authority',
        studentId: 'STD005',
        studentName: 'Robert Brown',
    },
];
