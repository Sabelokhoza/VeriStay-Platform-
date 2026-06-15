'use client';

import { montserrat } from '@/lib/fonts';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Award, FileCheck } from 'lucide-react';

export default function PsiraInfo() {
    const features = [
        {
            icon: Shield,
            title: 'PSiRA Accredited',
            description:
                'All courses comply with Private Security Industry Regulatory Authority standards',
        },
        {
            icon: Award,
            title: 'Recognized Certifications',
            description:
                "Earn certificates accepted across South Africa's private security industry",
        },
        {
            icon: FileCheck,
            title: 'Compliance Tracking',
            description: 'Automated compliance monitoring and reporting for training partners',
        },
        {
            icon: CheckCircle,
            title: 'Quality Assured',
            description: 'Regular audits ensure training meets PSiRA regulatory requirements',
        },
    ];

    return (
        <section
            id="psira-info"
            className="min-h-screen flex flex-col w-full py-12 sm:py-20 relative items-center justify-center px-4 bg-gradient-to-b from-background to-muted/20"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto text-center"
            >
                <div className="flex items-center justify-center gap-3 mb-6">
                    <Shield className="w-10 h-10 sm:w-16 sm:h-16 text-blue-600" />
                    <h2
                        className={`${montserrat.className} text-2xl sm:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-500 dark:from-neutral-200 to-neutral-800 dark:to-neutral-500`}
                    >
                        PSiRA Compliance
                    </h2>
                </div>

                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
                    The Private Security Industry Regulatory Authority (PSiRA) regulates the private
                    security industry in South Africa. Our platform ensures all training meets their
                    stringent requirements for quality and compliance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow"
                        >
                            <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mb-3 sm:mb-4" />
                            <h3 className="text-base sm:text-lg font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        <strong className="text-foreground">About PSiRA:</strong> Established under
                        the Private Security Industry Regulation Act, PSiRA ensures professional
                        standards, proper training, and ethical conduct in South Africa's private
                        security sector. All security personnel must be registered with PSiRA to
                        work legally in the industry.
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
}
