import React from 'react';
import { StudentReasons } from './StudentReasons';
import { montserrat } from '@/lib/fonts';
import { LandlordReasons } from './CenterReasons';

export default function Reasons() {
    return (
        <section
            id="reasons"
            className="min-h-screen flex flex-col w-full pt-10 relative items-center justify-normal scroll-snap-start px-4"
        >
            <h2
                className={`${montserrat.className} text-2xl sm:text-4xl lg:text-6xl font-bold relative z-20 bg-clip-text text-transparent bg-linear-to-b from-neutral-500 dark:from-neutral-200 to-neutral-800 dark:to-neutral-500 py-6 sm:py-12 text-center`}
            >
                Why VeriStay?
            </h2>
            <p className="text-sm md:text-lg text-neutral-500 text-center max-w-2xl mx-auto py-4 px-4">
                VeriStay is built to make student accommodation safe, transparent, and effortless —
                for students looking for a home and landlords looking for trusted tenants.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl gap-8 lg:gap-4 text-center justify-center items-start mt-8">
                <div className="w-full">
                    <StudentReasons />
                </div>
                <div className="w-full">
                    <LandlordReasons />
                </div>
            </div>
        </section>
    );
}
