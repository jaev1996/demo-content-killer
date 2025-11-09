"use client";

import { useTranslations } from "next-intl";

interface LegalLayoutProps {
    titleKey: string;
    children: React.ReactNode;
}

export function LegalLayout({ titleKey, children }: LegalLayoutProps) {
    const t = useTranslations('LandingPage.legal');

    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t(titleKey)}</h1>
                <p className="text-sm text-muted-foreground mb-8">{t('lastUpdated')}</p>
                <div className="prose prose-invert lg:prose-lg max-w-none space-y-6 text-muted-foreground">{children}</div>
            </div>
        </div>
    );
}
