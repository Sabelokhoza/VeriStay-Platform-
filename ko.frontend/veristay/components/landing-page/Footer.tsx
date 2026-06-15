import React from 'react';
import { Shield } from 'lucide-react';

function Footer() {
    return (
        <footer id="footer" className="w-full py-8 sm:py-12 border-t bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* About Section */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">
                            Trainers Council
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Empowering security professionals through accredited online training.
                        </p>
                    </div>

                    {/* PSiRA Compliance */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            <h3 className="font-bold text-base sm:text-lg">PSiRA Compliant</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            All courses meet Private Security Industry Regulatory Authority
                            standards.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-right">
                        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">
                            Get in Touch
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Questions? Contact our support team for assistance.
                        </p>
                    </div>
                </div>

                <div className="border-t pt-4 sm:pt-6 text-center">
                    <p className="text-xs sm:text-sm">
                        © {new Date().getFullYear()} Trainers Council. All rights reserved.
                    </p>
                    <p className="font-thin text-xs sm:text-sm p-2 sm:p-4 text-center">
                        Powered by{' '}
                        <a
                            href="https://kodeonce.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-inherit inline hover:text-green-600 transition-colors cursor-pointer"
                        >
                            K O D E <span className="text-green-600">O N C E</span>
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
