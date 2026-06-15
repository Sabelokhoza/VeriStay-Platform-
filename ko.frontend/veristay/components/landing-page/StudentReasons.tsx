'use client';

import { AnimatedList } from '@/components/magicui/animated-list';
import { Item } from '@/types/landing';
import { Notification } from './Notification';
import { montserrat } from '@/lib/fonts';

let studentBenefits: Item[] = [
    {
        name: 'Learn Anytime, Anywhere',
        description: 'Access courses online from any device.',
        time: 'Just now',
        icon: '📖',
        color: '#4CAF50',
    },
    {
        name: 'Accredited Certifications',
        description: 'Earn recognized security training certifications.',
        time: '5m ago',
        icon: '🎓',
        color: '#FFB800',
    },
    {
        name: 'Interactive Learning',
        description: 'Engage with instructors & classmates.',
        time: '10m ago',
        icon: '💬',
        color: '#1E86FF',
    },
    {
        name: 'Affordable Pricing',
        description: 'Secure payments via Paystack with no hidden fees.',
        time: '15m ago',
        icon: '💰',
        color: '#00C9A7',
    },
    {
        name: 'PSIRA-Aligned Curriculum',
        description: 'Study content structured around PSIRA registration requirements.',
        time: '20m ago',
        icon: '🛡️',
        color: '#E53935',
    },
    {
        name: 'Grade-Based Training',
        description: 'Complete PSIRA Grade E to A courses and advance your security career.',
        time: '25m ago',
        icon: '📋',
        color: '#5C6BC0',
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
