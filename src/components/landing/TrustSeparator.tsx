"use client";

import { useTranslations } from "next-intl";

export function TrustSeparator() {
    const t = useTranslations('LandingPage.trust');
    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center space-x-4">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-red-600 to-red-600/50"></div>
                    <p className="text-center text-lg font-semibold text-red-600">{t('title')}</p>
                    <div className="h-px flex-grow bg-gradient-to-l from-transparent via-red-600 to-red-600/50"></div>
                </div>
            </div>
        </div>
    );
}
