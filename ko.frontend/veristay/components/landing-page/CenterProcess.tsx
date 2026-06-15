import React from 'react';
import { motion } from 'framer-motion';
import ProcessCards, { Step } from './ProcessCards';
import Benefits from './Benefits';

function LandlordProcess() {
    const steps: Step[] = [
        {
            title: 'Register & Get Verified',
            description:
                'Create your landlord account and submit your documents for university verification before listing any properties.',
        },
        {
            title: 'List Your Property',
            description:
                'Add your property details, upload photos, set your rental price, and specify available amenities.',
        },
        {
            title: 'Await Admin Approval',
            description:
                'Our admin team reviews your listing to ensure it meets the platforms standards before it goes live.',
        },
        {
            title: 'Review Student Applications',
            description:
                'Browse incoming applications, review student profiles, and accept or reject applicants directly from your dashboard.',
        },
        {
            title: 'Manage Your Tenants',
            description:
                'Track rent payments, respond to maintenance requests, and post announcements to keep your tenants informed.',
        },
        {
            title: 'Grow Your Reputation',
            description:
                'Build trust through student reviews and ratings, making your listings more attractive to future applicants.',
        },
    ];

    const benefits: string[] = [
        'Reach Verified Student Tenants',
        'Streamlined Application Management',
        'Built-In Maintenance & Payment Tracking',
    ];

    return (
        <>
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="m-6 text-3xl text-center text-neutral-400"
            >
                List, Manage & Grow Your Property!
            </motion.p>
            <ProcessCards steps={steps} />
            <Benefits points={benefits} color="green" />
        </>
    );
}

export default LandlordProcess;