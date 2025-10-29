"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/animated-section";
import { AccordionItem } from "@/components/ui/accordion-item";

export function FaqSection() {
    const t = useTranslations('LandingPage.faq');

    return (
        <AnimatedSection id="faq" className="py-20 bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">{t('title')}</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    <div className="space-y-4">
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <AccordionItem title={t('q1_title')} isInitiallyOpen={true}>
                                <p>{t('q1_answer_p1')}</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    {['0', '1', '2', '3', '4'].map(index => (
                                        <li key={index} dangerouslySetInnerHTML={{ __html: t.raw(`q1_answer_li.${index}`) }} />
                                    ))}
                                </ul>
                            </AccordionItem>
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <AccordionItem title={t('q2_title')}>
                                <p>{t('q2_answer')}</p>
                            </AccordionItem>
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <AccordionItem title={t('q3_title')}>
                                <p>{t('q3_answer')}</p>
                            </AccordionItem>
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <AccordionItem title={t('q4_title')}>
                                <p>{t('q4_answer')}</p>
                            </AccordionItem>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
