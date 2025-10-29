"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroSection() {
    const t = useTranslations('LandingPage.hero');

    return (
        <motion.section
            className="py-20 md:py-32 bg-black flex items-center min-h-[calc(100vh-5rem)]"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.2 } }
            }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h1
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight"
                >
                    {t('title')}<span className="text-red-600">{t('titleHighlight')}</span>
                </motion.h1>
                <motion.p
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                    className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-400"
                >
                    {t('subtitle')}
                </motion.p>
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                    className="mt-10"
                >
                    <Link className="bg-red-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-red-700 transition-colors transform hover:scale-105 inline-block" href="/login">
                        {t('cta')}
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
}
