export type Certification = {
    id: string;
    title: string;
    type: string;
    description: string;
    validity: string;
    requirements: string[];
    issuedBy: string;
    psiraCompliant: boolean;
    courses: string[];
    level?: string;
    industry?: string;
    renewalProcess?: string;
};

export const certifications: Certification[] = [
    {
        id: 'cert1',
        title: 'Workplace Safety Specialist',
        type: 'Professional Certification',
        description:
            'Comprehensive certification for workplace safety professionals, covering all essential safety protocols and emergency procedures.',
        validity: '2 years',
        requirements: [
            'Complete all required training modules',
            'Pass final assessment with 80% or higher',
            'Submit workplace safety project',
            'Attend mandatory practical session',
        ],
        issuedBy: 'Training Excellence Center',
        psiraCompliant: true,
        courses: ['course1'],
        level: 'Intermediate',
        industry: 'General Industry',
        renewalProcess: 'Complete 16 hours of continuing education and pass renewal exam',
    },
    {
        id: 'cert2',
        title: 'Advanced Risk Management Professional',
        type: 'Advanced Certification',
        description:
            'Advanced certification for risk management professionals in high-risk environments.',
        validity: '3 years',
        requirements: [
            'Hold basic safety certification',
            'Complete advanced training modules',
            'Pass comprehensive examination',
            'Document 2 years of relevant experience',
            'Complete capstone project',
        ],
        issuedBy: 'Professional Safety Institute',
        psiraCompliant: true,
        courses: ['course1', 'course2'],
        level: 'Advanced',
        industry: 'High-Risk Industries',
        renewalProcess: 'Complete 24 hours of advanced continuing education',
    },
];
