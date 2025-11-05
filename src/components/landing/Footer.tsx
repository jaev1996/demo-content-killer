"use client";

import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations('LandingPage.footer');

    return (
        <footer className="bg-gray-950 text-gray-400">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <p>{t('copyright')}</p>
                <p className="text-sm mt-2 text-gray-500">{t('privacy')}</p>
            </div>
        </footer>
    );
}
