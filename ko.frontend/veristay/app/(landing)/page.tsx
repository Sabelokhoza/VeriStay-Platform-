'use client';
import { useEffect } from 'react';
import { Hero, Reasons, Process, PsiraInfo, Footer } from '@/components/landing-page';
import { useLearningPathsData, useTrainingCentresData } from '../(platform)/data';

export default function LandingPage() {
    const learningPathsData = useLearningPathsData();
    const trainingCentresData = useTrainingCentresData();

    useEffect(() => {
        console.log('Landing page mounted, data initialized');

        return () => {
            console.log('Landing page unmounting');
        };
    }, []);

    useEffect(() => {
        const isLoading = learningPathsData?.isLoadings || trainingCentresData?.isLoading;

        if (isLoading) {
            console.log('Loading data...');
        } else {
            console.log('All data loaded');
        }
    }, [learningPathsData, trainingCentresData]);

    return (
        <div className="pt-20">
            <div className="flex flex-col gap-12 sm:gap-24">
                <Hero />
                <Process />
                <PsiraInfo />
                <Reasons />
                <Footer />
            </div>
        </div>
    );
}
