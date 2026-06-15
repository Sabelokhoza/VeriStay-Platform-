'use client';

import { montserrat } from '@/lib/fonts';
import { motion } from 'framer-motion';
import { ChevronDown, Home, Shield, Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Hero() {
    const scrollToSection = () => {
        document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            className="relative flex flex-col min-h-screen h-auto w-full items-center justify-center px-4 pt-8 pb-36"
        >
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="z-20 mb-4 sm:mb-6 flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
            >
                <Shield className="h-4 w-4" />
                <span>Verified Student Accommodation Platform</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className={`${montserrat.className} text-3xl sm:text-5xl lg:text-7xl font-bold z-20 py-4 sm:py-6 text-center px-4 leading-tight`}
            >
                Find Verified Student
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                <span className="text-blue-600 dark:text-blue-400"> Accommodation</span>
            </motion.h1>

            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`${montserrat.className} text-xl sm:text-3xl lg:text-5xl font-bold z-20 py-2 sm:py-4 text-center px-4`}
            >
                Safe, Trusted &{' '}
                <span className="text-blue-600 dark:text-blue-400">Stress-Free</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-center text-muted-foreground px-4 max-w-2xl"
            >
                VeriStay connects students with university-verified landlords. Browse authenticated
                listings, submit applications, and manage your tenancy — all in one place.
            </motion.p>

            {/* Stats Strip */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
                className="z-20 mt-8 flex flex-wrap justify-center gap-6 sm:gap-12 text-center"
            >
                {[
                    { value: '500+', label: 'Verified Listings' },
                    { value: '1,200+', label: 'Students Housed' },
                    { value: '100%', label: 'Verified Landlords' },
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center">
                        <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {stat.value}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex mt-8 sm:mt-12 w-full justify-center px-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 max-w-4xl justify-center w-full">
                    {/* Student CTA */}
                    <Link href="/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto sm:min-w-64 bg-blue-600 text-base sm:text-lg rounded-lg p-3 sm:p-4 px-8 inline-flex items-center justify-center gap-2 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
                        >
                            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span>Find Accommodation</span>
                        </motion.button>
                    </Link>

                    {/* Landlord CTA */}
                    <Link href="/landlord-register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto sm:min-w-64 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 text-base sm:text-lg rounded-lg p-3 sm:p-4 px-8 inline-flex items-center justify-center gap-2 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-950 hover:shadow-xl transition-all"
                        >
                            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span>List Your Property</span>
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Trust Note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.9 }}
                className="mt-6 text-xs text-muted-foreground text-center px-4"
            >
                🔒 All landlords are verified by your university before listings go live
            </motion.p>

            {/* Scroll Indicator */}
            <button
                className="absolute bottom-8 sm:bottom-12 flex flex-col items-center space-y-1 cursor-pointer"
                onClick={scrollToSection}
                onKeyDown={(e) => e.key === 'Enter' && scrollToSection()}
                aria-label="Scroll to see how it works"
                tabIndex={0}
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
                    className="text-muted-foreground text-xs sm:text-sm"
                >
                    Choose your role to get started
                </motion.p>

                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 1.1 }}
                    className="text-gray-700 dark:text-gray-300 text-base sm:text-lg font-medium text-center"
                >
                    See How It Works
                </motion.span>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-400" />
                </motion.div>
            </button>
        </section>
    );
}
