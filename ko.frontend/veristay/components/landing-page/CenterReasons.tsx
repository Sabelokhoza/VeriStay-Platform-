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

let landlordBenefits: Item[] = [
    {
        name: 'Reach Verified Students',
        description: 'Connect with university-enrolled students actively looking for accommodation.',
        time: 'Just now',
        icon: '🎓',
        color: '#4f8ef7',
    },
    {
        name: 'University-Backed Trust',
        description: 'Your verified status gives students confidence to apply to your listings.',
        time: '5m ago',
        icon: '🏛️',
        color: '#00C9A7',
    },
    {
        name: 'Easy Listing Management',
        description: 'Create, update, and manage all your property listings from one dashboard.',
        time: '10m ago',
        icon: '🏠',
        color: '#6A1B9A',
    },
    {
        name: 'Streamlined Applications',
        description: 'Review, approve, or reject student applications with a single click.',
        time: '15m ago',
        icon: '📋',
        color: '#F57C00',
    },
    {
        name: 'Rent Payment Tracking',
        description: 'Monitor payment status and history for all your tenants in one place.',
        time: '20m ago',
        icon: '💳',
        color: '#FF3D71',
    },
    {
        name: 'Maintenance Oversight',
        description: 'Receive, prioritize, and resolve tenant maintenance requests efficiently.',
        time: '25m ago',
        icon: '🔧',
        color: '#E53935',
    },
    {
        name: 'Reputation Building',
        description: 'Collect student reviews and ratings to attract higher-quality tenants.',
        time: '30m ago',
        icon: '⭐',
        color: '#F9A825',
    },
    {
        name: 'Tenant Announcements',
        description: 'Post updates directly to your property community with one broadcast.',
        time: '35m ago',
        icon: '📢',
        color: '#007BFF',
    },
];
landlordBenefits = Array.from({ length: 100 }, () => landlordBenefits).flat();

export function LandlordReasons() {
    return (
        <div className="relative flex h-[550px] w-full flex-col overflow-hidden p-4">
            <h3
                className={`${montserrat.className} text-2xl font-semibold text-center mb-4 dark:text-gray-200 text-gray-800`}
            >
                🏠 Landlord Benefits
            </h3>
            <AnimatedList>
                {landlordBenefits.map((item, idx) => (
                    <Notification {...item} key={idx} />
                ))}
            </AnimatedList>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background"></div>
        </div>
    );
}