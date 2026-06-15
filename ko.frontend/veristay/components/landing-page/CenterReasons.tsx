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

let trainingCenterBenefits: Item[] = [
    {
        name: 'Expand Your Reach',
        description: 'Enroll students from anywhere, increasing revenue.',
        time: 'Just now',
        icon: '🌍',
        color: '#007BFF',
    },
    {
        name: 'Automated Payments',
        description: 'Collect fees securely via Paystack.',
        time: '5m ago',
        icon: '💳',
        color: '#FF3D71',
    },
    {
        name: 'Course Management',
        description: 'Seamlessly manage students & course content.',
        time: '10m ago',
        icon: '🖥️',
        color: '#6A1B9A',
    },
    {
        name: 'Lower Overhead Costs',
        description: 'Reduce classroom expenses & manual administration.',
        time: '15m ago',
        icon: '🏢',
        color: '#00C9A7',
    },
    {
        name: 'PSIRA-Accredited Delivery',
        description: 'Deliver training that meets PSIRA compliance standards effortlessly.',
        time: '20m ago',
        icon: '✅',
        color: '#E53935',
    },
    {
        name: 'Streamlined PSIRA Reporting',
        description: 'Generate and submit PSIRA learner reports with ease.',
        time: '25m ago',
        icon: '📊',
        color: '#F57C00',
    },
];
trainingCenterBenefits = Array.from({ length: 100 }, () => trainingCenterBenefits).flat();

export function TrainingCenterReasons() {
    return (
        <div className="relative flex h-[550px] w-full flex-col overflow-hidden p-4">
            <h3
                className={`${montserrat.className} text-2xl font-semibold text-center mb-4 dark:text-gray-200 text-gray-800`}
            >
                🏢 Training Center Benefits
            </h3>
            <AnimatedList>
                {trainingCenterBenefits.map((item, idx) => (
                    <Notification {...item} key={idx} />
                ))}
            </AnimatedList>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background"></div>
        </div>
    );
}
