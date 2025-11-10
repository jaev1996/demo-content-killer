"use client";

import { LegalLayout } from "@/components/legal/LegalLayout";
import { LegalHeader } from "@/components/landing/LegalHeader";
import { Footer } from "@/components/landing/Footer";
import { useTranslations } from "next-intl";

export default function TermsPage() {
    const t = useTranslations('LandingPage.legal.terms');
    const sections = [
        "intro", "services", "obligations", "confidentiality",
        "payments", "liability", "governing_law", "modifications", "contact"
    ];

    return (
        <>
            <LegalHeader />
            <LegalLayout titleKey="termsTitle">
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <section key={index} aria-labelledby={`section-title-${index}`}>
                            <h2 id={`section-title-${index}`} className="text-2xl font-semibold text-foreground mb-3">
                                {t(`${section}_title`)}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>{t(`${section}_p1`)}</p>
                            </div>
                        </section>
                    ))}
                </div>
            </LegalLayout>
            <Footer />
        </>
    );
}
