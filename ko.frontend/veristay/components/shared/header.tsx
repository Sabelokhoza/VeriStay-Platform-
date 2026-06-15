import { Montserrat } from 'next/font/google';
import React from 'react';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'] });

const Header = ({ title, description }: Readonly<{ title: string; description: string }>) => {
    return (
        <section className="mb-6">
            <h1
                className={`${montserrat.className} text-3xl font-bold tracking-tight text-primary`}
            >
                {title}
            </h1>
            <p className={`${montserrat.className}`}>{description}</p>
        </section>
    );
};

export default Header;
