"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
    IconUserCheck,
    IconSearch,
    IconGavel,
    IconTrash,
    IconRefresh,
    IconChartBar,
} from "@tabler/icons-react";

export function ProcessSection() {
    const t = useTranslations('LandingPage.process');

    return (
        <AnimatedSection id="services" className="pt-12 pb-20 bg-black/95 border-y border-white/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                        {t('title')}
                    </h2>
                    <div className="hidden md:block h-px flex-grow bg-gradient-to-r from-red-600/50 to-transparent ml-8"></div>
                </div>

                <div className="relative">
                    {/* Horizontal Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600/20 via-red-600 to-red-600/20 z-0"></div>

                    <motion.div
                        className="flex flex-nowrap md:grid md:grid-cols-6 gap-6 md:gap-4 overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {[1, 2, 3, 4, 5, 6].map((step) => {
                            const Icon = [IconUserCheck, IconSearch, IconGavel, IconTrash, IconRefresh, IconChartBar][step - 1];
                            const itemVariants = {
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                            };

                            return (
                                <motion.div
                                    key={step}
                                    variants={itemVariants}
                                    className="flex-shrink-0 w-[280px] md:w-auto snap-center relative z-10"
                                >
                                    <div className="flex flex-col items-center text-center group">
                                        {/* Icon Container */}
                                        <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-transform duration-300 relative z-10 border-4 border-black">
                                            <Icon size={32} />
                                        </div>

                                        {/* Step Info */}
                                        <div className="px-4">
                                            <span className="block text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Paso {step}</span>
                                            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{t(`step${step}_title`)}</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">{t(`step${step}_desc`)}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </AnimatedSection>
    );
}
