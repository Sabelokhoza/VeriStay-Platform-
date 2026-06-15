import React from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'] });

const Subheading = ({ title, description }: Readonly<{ title: string; description: string }>) => {
    return (
        <div>
            <section>
                <div className="mb-6">
                    <h1 className={`${montserrat.className} text-2xl font-bold text-primary`}>
                        {title}
                    </h1>
                    <p className={`${montserrat.className} mt-2 `}>{description}</p>
                </div>
            </section>
        </div>
    );
};

export default Subheading;
