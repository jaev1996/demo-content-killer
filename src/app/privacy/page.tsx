"use client";

import { LegalLayout } from "@/components/legal/LegalLayout";
import { LegalHeader } from "@/components/landing/LegalHeader";
import { Footer } from "@/components/landing/Footer";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations('LandingPage.legal.privacy');
    const sections = [
        { key: "intro" },
        { key: "collection", list: ["li1", "li2", "li3"] },
        { key: "usage", list: ["li1", "li2", "li3"] },
        { key: "sharing", list: ["li1", "li2", "li3"] },
        { key: "security" },
        { key: "rights" },
        { key: "changes" },
        { key: "contact" }
    ];

    return (
        <>
            <LegalHeader />
            <LegalLayout titleKey="privacyTitle">
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <section key={index} aria-labelledby={`section-title-${index}`}>
                            <h2 id={`section-title-${index}`} className="text-2xl font-semibold text-foreground mb-3">
                                {t(`${section.key}_title`)}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {t.rich(`${section.key}_p1`, {
                                        strong: (chunks) => <strong>{chunks}</strong>,
                                    })}
                                </p>
                                {section.list && (
                                    <ul className="list-disc list-inside space-y-2 pl-4">
                                        {section.list.map((item, itemIndex) => (
                                            <li key={itemIndex} dangerouslySetInnerHTML={{ __html: t.raw(`${section.key}_${item}`) }} />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </LegalLayout>
            <Footer />
        </>
    );
}
