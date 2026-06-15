'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Home, GraduationCap } from 'lucide-react';
import StudentProcess from './StudentProcess';
import LandlordProcess from './CenterProcess';
import { montserrat } from '@/lib/fonts';

export default function Process() {
    return (
        <section
            id="process"
            className="min-h-screen flex flex-col w-full pt-10 relative items-center justify-normal scroll-snap-start px-4"
        >
            <h2
                className={`${montserrat.className} text-2xl sm:text-4xl lg:text-6xl font-bold relative z-20 bg-clip-text text-transparent bg-linear-to-b from-neutral-500 dark:from-neutral-200 to-neutral-800 dark:to-neutral-500 py-6 sm:py-8 text-center`}
            >
                How It Works
            </h2>

            <Tabs defaultValue="student" className="w-full max-w-5xl h-auto pt-4 sm:pt-10">
                {/* Tabs Navigation */}
                <TabsList className="grid grid-cols-2 rounded-lg m-2 sm:m-4 items-center justify-center">
                    <TabsTrigger
                        value="student"
                        className="gap-1 sm:gap-2 text-xs sm:text-base hover:cursor-pointer"
                    >
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">For</span> Students
                    </TabsTrigger>
                    <TabsTrigger
                        value="landlord"
                        className="gap-1 sm:gap-2 text-xs sm:text-base hover:cursor-pointer"
                    >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">For</span> Landlords
                    </TabsTrigger>
                </TabsList>

                {/* Student Workflow */}
                <TabsContent value="student">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 space-y-6 text-center"
                    >
                        <StudentProcess />
                    </motion.div>
                </TabsContent>

                {/* Landlord Workflow */}
                <TabsContent value="landlord">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 space-y-6 text-center"
                    >
                        <LandlordProcess />
                    </motion.div>
                </TabsContent>
            </Tabs>
        </section>
    );
}

