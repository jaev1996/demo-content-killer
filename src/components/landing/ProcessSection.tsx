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
        <AnimatedSection id="services" className="py-20 bg-black/95">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-6xl font-black text-center text-white tracking-tighter leading-tight mb-16 uppercase transition-colors">
                    {t('title')}
                </h2>
                <motion.div
                    className="relative roadmap"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                >
                    <div className="absolute top-16 bottom-16 left-[calc(2.5rem-1px)] md:left-1/2 md:-translate-x-1/2 w-0.5 bg-gray-800"></div>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 relative">
                        {[1, 2, 3, 4, 5, 6].map((step) => {
                            const isOdd = step % 2 !== 0;
                            const Icon = [IconUserCheck, IconSearch, IconGavel, IconTrash, IconRefresh, IconChartBar][step - 1];
                            const itemVariants = {
                                hidden: { opacity: 0, x: isOdd ? -30 : 30 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                            };

                            const content = (
                                <motion.div variants={itemVariants}>
                                    <div className={`flex items-center w-full ${isOdd ? 'md:flex-row-reverse' : 'flex-row'}`}>
                                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center z-10">
                                            <Icon size={36} />
                                        </div>
                                        {isOdd ? (
                                            <div className="text-left md:text-right pl-6 md:pl-0 md:pr-8">
                                                <h3 className="text-xl font-bold text-white mb-2">{t(`step${step}_title`)}</h3>
                                                <p className="text-gray-400">{t(`step${step}_desc`)}</p>
                                            </div>
                                        ) : (
                                            <div className="pl-6">
                                                <h3 className="text-xl font-bold text-white mb-2">{t(`step${step}_title`)}</h3>
                                                <p className="text-gray-400">{t(`step${step}_desc`)}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );

                            if (isOdd) {
                                return <React.Fragment key={step}><div className="md:text-right">{content}</div><div></div></React.Fragment>;
                            } else {
                                return <React.Fragment key={step}><div></div><div>{content}</div></React.Fragment>;
                            }
                        })}
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
