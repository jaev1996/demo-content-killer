"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/animated-section";
import { IconUserShield, IconGauge, IconTrendingUp } from "@tabler/icons-react";
import Image from "next/image";

export function TrustStatsSection() {
    const t = useTranslations('LandingPage.trust');

    return (
        <AnimatedSection className="py-20 bg-black/95">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight uppercase transition-colors mb-4">
                        {t('stats_title')}
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">{t('stats_subtitle')}</p>
                </div>
                <motion.div
                    className="mt-16 grid md:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg text-center flex flex-col items-center">
                        <IconUserShield className="text-red-600 size-12" />
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 mt-4">{t('stat1_value')}</p>
                        <p className="text-gray-400 mt-2">{t('stat1_desc')}</p>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg text-center flex flex-col items-center">
                        <IconGauge className="text-red-500 size-12" />
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 mt-4">{t('stat2_value')}</p>
                        <p className="text-gray-400 mt-2">{t('stat2_desc')}</p>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg text-center flex flex-col items-center">
                        <IconTrendingUp className="text-red-400 size-12" />
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mt-4">{t('stat3_value')}</p>
                        <p className="text-gray-400 mt-2">{t('stat3_desc')}</p>
                    </motion.div>
                </motion.div>

                {/* --- New Section: Protected Platforms Logos --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-24 pb-16 border-b border-white/5"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-xl md:text-4xl font-black text-white tracking-tight uppercase">
                            {t('platforms_title')}
                        </h3>
                        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
                            {t('platforms_subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-50 hover:opacity-100 transition-opacity duration-700">
                        <div className="relative w-32 md:w-80 h-40">
                            <Image
                                src="/images/logos-paginas/Onlyfans-Logo-2016-300x169.webp"
                                alt="OnlyFans"
                                fill
                                className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                        <div className="relative w-32 md:w-40 h-10">
                            <Image
                                src="/images/logos-paginas/Fansly_logo.svg-300x84.webp"
                                alt="Fansly"
                                fill
                                className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                        <div className="relative w-32 md:w-40 h-10">
                            <Image
                                src="/images/logos-paginas/fanvue.webp"
                                alt="Fanvue"
                                fill
                                className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                        <div className="relative w-32 md:w-40 h-10">
                            <Image
                                src="/images/logos-paginas/Chaturbate_logocop.svg-300x90.webp"
                                alt="Chaturbate"
                                fill
                                className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
