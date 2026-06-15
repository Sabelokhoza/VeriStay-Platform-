'use client';

import { AnimatedList } from '@/components/magicui/animated-list';
import { Notification } from './Notification';
import { montserrat } from '@/lib/fonts';

type Item = {
    name: string;
    description: string;
    time: string;
    icon?: string;
    color?: string;
};

let studentBenefits: Item[] = [
    {
        name: 'Verified Listings Only',
        description:
            'Every property is reviewed and approved by your university before going live.',
        time: 'Just now',
        icon: '✅',
        color: '#4f8ef7',
    },
    {
        name: 'Safe & Fraud-Free',
        description:
            'No more scams — only university-vetted landlords are allowed on the platform.',
        time: '5m ago',
        icon: '🔒',
        color: '#00C9A7',
    },
    {
        name: 'Easy Applications',
        description: 'Apply to multiple properties in minutes directly from your dashboard.',
        time: '10m ago',
        icon: '📋',
        color: '#6A1B9A',
    },
    {
        name: 'Real-Time Status Tracking',
        description: 'Know instantly when your application is approved, rejected, or pending.',
        time: '15m ago',
        icon: '📡',
        color: '#F57C00',
    },
    {
        name: 'Simulated Rent Payments',
        description: 'Practice managing rent payments and view full transaction history.',
        time: '20m ago',
        icon: '💳',
        color: '#FF3D71',
    },
    {
        name: 'Maintenance Requests',
        description: 'Log issues with photos and track resolution progress end-to-end.',
        time: '25m ago',
        icon: '🔧',
        color: '#E53935',
    },
    {
        name: 'Digital Lease Access',
        description: 'View and download your lease agreement anytime from your account.',
        time: '30m ago',
        icon: '📄',
        color: '#007BFF',
    },
    {
        name: 'Community Hub',
        description: 'Connect with housemates and stay updated via landlord announcements.',
        time: '35m ago',
        icon: '🏘️',
        color: '#00897B',
    },
];
studentBenefits = Array.from({ length: 100 }, () => studentBenefits).flat();

export function StudentReasons() {
    return (
        <div className="relative flex h-[550px] w-full flex-col overflow-hidden p-4">
            <h3
                className={`${montserrat.className} text-2xl font-semibold text-center mb-4 dark:text-gray-200 text-gray-800`}
            >
                🎓 Student Benefits
            </h3>
            <AnimatedList>
                {studentBenefits.map((item, idx) => (
                    <Notification {...item} key={idx} />
                ))}
            </AnimatedList>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background"></div>
        </div>
    );
}
