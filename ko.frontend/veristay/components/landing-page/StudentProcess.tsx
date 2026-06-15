import React from 'react';
import { motion } from 'framer-motion';
import ProcessCards, { Step } from './ProcessCards';
import Benefits from './Benefits';

function StudentProcess() {
    const steps: Step[] = [
        {
            title: 'Create Your Student Account',
            description:
                'Register with your institutional email and student number to get verified access to the platform.',
        },
        {
            title: 'Browse Verified Listings',
            description:
                'Search and filter university-approved properties by price, location, amenities, and availability.',
        },
        {
            title: 'Submit an Application',
            description:
                'Apply to your preferred property in a few clicks. Upload any supporting documents if required.',
        },
        {
            title: 'Track Your Application',
            description:
                'Monitor your application status in real time — pending, approved, or rejected — all from your dashboard.',
        },
        {
            title: 'Move In & Manage Your Tenancy',
            description:
                'Once approved, simulate rent payments, log maintenance requests, and access your lease documents online.',
        },
        {
            title: 'Connect With Your Community',
            description:
                'Join your property group, view landlord announcements, and connect with housemates through the community hub.',
        },
    ];

    const benefits: string[] = [
        'University-Verified Landlords Only',
        'Real-Time Application Tracking',
        'All Tenancy Tools in One Place',
    ];

    return (
        <>
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="m-6 text-3xl text-center text-neutral-400"
            >
                Find Your Perfect Place to Stay!
            </motion.p>
            <ProcessCards steps={steps} />
            <Benefits points={benefits} color="blue" />
        </>
    );
}

export default StudentProcess;
