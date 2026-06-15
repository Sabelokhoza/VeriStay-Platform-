'use client';

import { montserrat } from '@/lib/fonts';
import { motion } from 'framer-motion';
import { ChevronDown, GraduationCap, Shield } from 'lucide-react';
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
            {/* Heading Animations */}
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`${montserrat.className} text-3xl sm:text-5xl lg:text-7xl font-bold z-20 py-4 sm:py-8 text-center px-4`}
            >
                Get PSIRA Certified <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>Security Training
            </motion.p>

            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`${montserrat.className} text-2xl sm:text-4xl lg:text-6xl font-bold z-20 py-4 sm:py-8 text-center px-4`}
            >
                Anytime, Anywhere!
            </motion.p>

            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-center text-muted-foreground px-4 max-w-2xl"
            >
                Enroll in PSiRA-accredited security training courses from leading centers
                nationwide.
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex mt-8 sm:mt-16 w-full justify-center px-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 max-w-4xl justify-center w-full">
                    <Link href="/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto sm:min-w-72 bg-green-600 text-base sm:text-lg lg:text-xl rounded-lg p-3 sm:p-4 pl-6 sm:pl-8 inline-flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                            <span className="text-center">Enroll as a Student</span>
                        </motion.button>
                    </Link>

                    <Link href="/center-register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto bg-blue-600 text-base sm:text-lg lg:text-xl rounded-lg p-3 sm:p-4 inline-flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                            <span className="text-center">Become a Training Partner</span>
                        </motion.button>
                    </Link>
                </div>
            </div>

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
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                    className="text-muted-foreground text-xs sm:text-sm"
                >
                    Choose your role to get started
                </motion.p>

                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
                    className="text-gray-700 text-base sm:text-lg font-medium text-center"
                >
                    See How It Works
                </motion.span>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </motion.div>
                
            </button>
        </section>
    );
}
