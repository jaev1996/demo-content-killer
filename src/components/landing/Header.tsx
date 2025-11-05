"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { IconShield, IconMenu2, IconX } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const t = useTranslations('LandingPage.nav');

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <IconShield className="text-red-600 size-8" />
                        <span className="ml-2 text-2xl font-bold text-foreground">PrivaClean</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a className="text-muted-foreground hover:text-red-600 transition-colors" href="#services">{t('services')}</a>
                        <a className="text-muted-foreground hover:text-red-600 transition-colors" href="#pricing">{t('pricing')}</a>
                        <a className="text-muted-foreground hover:text-red-600 transition-colors" href="#faq">{t('faq')}</a>
                        <Link className="text-muted-foreground hover:text-red-600 transition-colors" href="/login">{t('clientAccess')}</Link>
                        <div className="border-l border-border h-6"></div>
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </nav>
                    <div className="md:hidden">
                        <button className="text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <IconX /> : <IconMenu2 />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-background/95" id="mobile-menu">
                    <nav className="px-4 pt-2 pb-4 space-y-2">
                        <a className="block text-white hover:text-red-600 transition-colors py-2" href="#services">{t('services')}</a>
                        <a className="block text-white hover:text-red-600 transition-colors py-2" href="#pricing">{t('pricing')}</a>
                        <a className="block text-white hover:text-red-600 transition-colors py-2" href="#faq">{t('faq')}</a>
                        <Link className="block text-white hover:text-red-600 transition-colors py-2" href="/login">{t('clientAccess')}</Link>
                        <div className="border-t border-gray-800 pt-4 mt-2 flex items-center justify-between">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
