"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/animated-section";
import { IconCheck } from "@tabler/icons-react";

export function PricingSection() {
    const t = useTranslations('LandingPage');

    return (
        <AnimatedSection id="pricing" className="py-20 bg-black/95">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">{t('pricing.title')}</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
                </div>
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-white mb-2">{t('pricing.basic_title')}</h3>
                        <p className="text-gray-400 mb-6 flex-grow">{t('pricing.basic_desc')}</p>
                        <p className="text-4xl font-bold text-white mb-6">{t('pricing.basic_price')}<span className="text-lg font-normal text-gray-400">{t('pricing.per_month')}</span></p>
                        <ul className="space-y-4 text-gray-400 mb-8">
                            {['basic.0', 'basic.1', 'basic.2'].map(key => (
                                <li key={key} className="flex items-center gap-3"><IconCheck className="size-5 text-red-600" /> {t(`features.${key}`)}</li>
                            ))}
                        </ul>
                        <Link className="mt-auto w-full inline-block text-center bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg" href="/login">
                            {t('pricing.choose_plan')}
                        </Link>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg border-2 border-red-600 relative flex flex-col h-full shadow-2xl shadow-red-600/10 scale-105">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">{t('pricing.most_popular')}</div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('pricing.professional_title')}</h3>
                        <p className="text-gray-400 mb-6 flex-grow">{t('pricing.professional_desc')}</p>
                        <p className="text-4xl font-bold text-white mb-6">{t('pricing.professional_price')}<span className="text-lg font-normal text-gray-400">{t('pricing.per_month')}</span></p>
                        <ul className="space-y-4 text-gray-400 mb-8">
                            {['professional.0', 'professional.1', 'professional.2'].map(key => (
                                <li key={key} className="flex items-center gap-3"><IconCheck className="size-5 text-red-600" /> {t(`features.${key}`)}</li>
                            ))}
                        </ul>
                        <Link className="mt-auto w-full inline-block text-center bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg" href="/login">
                            {t('pricing.choose_plan')}
                        </Link>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 flex flex-col h-full md:col-span-2 lg:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-2">{t('pricing.agency_title')}</h3>
                        <p className="text-gray-400 mb-6 flex-grow">{t('pricing.agency_desc')}</p>
                        <p className="text-4xl font-bold text-white mb-6">{t('pricing.agency_price')}</p>
                        <ul className="space-y-4 text-gray-400 mb-8">
                            {['agency.0', 'agency.1', 'agency.2'].map(key => (
                                <li key={key} className="flex items-center gap-3"><IconCheck className="size-5 text-red-600" /> {t(`features.${key}`)}</li>
                            ))}
                        </ul>
                        <Link className="mt-auto w-full inline-block text-center bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg" href="/login">
                            {t('pricing.contact_sales')}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
