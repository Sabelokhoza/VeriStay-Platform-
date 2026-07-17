import '@/style/globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto, Varela_Round } from 'next/font/google';
import Script from 'next/script';
import { Providers } from './providers';

const varelaRound = Varela_Round({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-varela-round',
});

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-roboto',
});

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: "VeriStay",
    description:
        "VeriStay is a verified student accommodation platform that helps students find safe, trusted, and verified accommodation near their campus.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${varelaRound.className}`}>
                <Providers>
                    <main>{children}</main>
                </Providers>
                <Script
                  src="https://rybbit.kodeonce.com/api/script.js"
                  data-site-id="2"
                  strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
