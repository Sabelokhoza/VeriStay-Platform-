import React from 'react';
import { Home, Mail, Phone, Shield } from 'lucide-react';
import Link from 'next/link';

function Footer() {
    return (
        <footer id="footer" className="w-full py-8 sm:py-12 border-t bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 sm:mb-3">
                            <Home className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-base sm:text-lg">
                                Veri<span className="text-blue-600">Stay</span>
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Verified student accommodation — connecting students with trusted,
                            university-approved landlords.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Quick Links</h3>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/register"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Register as Student
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/landlord-register"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    List Your Property
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#process"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    How It Works
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Trust & Safety */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 sm:mb-3">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            <h3 className="font-bold text-base sm:text-lg">Trust & Safety</h3>
                        </div>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                            <li>✅ University-verified landlords</li>
                            <li>✅ Fraud-free listings</li>
                            <li>✅ Secure document handling</li>
                            <li>✅ Admin-moderated platform</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">
                            Get in Touch
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                            <li className="flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                                <a
                                    href="mailto:support@veristay.co.za"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    support@veristay.co.za
                                </a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-2">
                                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                                <a
                                    href="tel:+27000000000"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    +27 00 000 0000
                                </a>
                            </li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3">
                            Our support team is available Monday – Friday, 8am – 5pm SAST.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t pt-4 sm:pt-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        © {new Date().getFullYear()} VeriStay. All rights reserved.
                    </p>
                    <p className="font-thin text-xs sm:text-sm p-2 sm:p-4 text-center text-muted-foreground">
                        Powered by{' '}
                        <a
                            href="https://kodeonce.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-inherit inline hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            K O D E <span className="text-blue-600">O N C E</span>
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
