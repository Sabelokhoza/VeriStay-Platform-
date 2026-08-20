'use client';
import { Hero, Reasons, Process, Footer } from '@/components/landing-page';

export default function LandingPage() {

    return (
        <div className="pt-20">
            <div className="flex flex-col gap-12 sm:gap-24">
                <Hero />
                <Process />
                <Reasons />
                <Footer />
            </div>
        </div>
    );
}
