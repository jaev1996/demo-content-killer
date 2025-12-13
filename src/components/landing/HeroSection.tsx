"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function HeroSection() {
    const t = useTranslations('LandingPage.hero');

    return (
        <motion.section
            className="relative py-20 md:py-32 flex items-center min-h-[calc(100vh-5rem)] bg-background overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.2 } }
            }}
        >
            {/* Background Animated Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: [0.08, 0.15, 0.08],
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-[500px] h-[500px] md:w-[900px] md:h-[900px]"
                >
                    <Image
                        src="/privaclean.svg"
                        alt="PrivaClean Background"
                        fill
                        className="object-contain"
                        style={{ filter: 'invert(18%) sepia(88%) saturate(5854%) hue-rotate(356deg) brightness(93%) contrast(116%)' }}
                        priority
                    />
                </motion.div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.h1
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                    className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                >
                    {t('title')}<span className="text-red-600 dark:text-red-500">{t('titleHighlight')}</span>
                </motion.h1>
                <motion.p
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                    className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground"
                >
                    {t('subtitle')}
                </motion.p>
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                    className="mt-10"
                >
                    <Link className="bg-red-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-red-700 transition-colors transform hover:scale-105 inline-block shadow-lg hover:shadow-red-600/20" href="/login">
                        {t('cta')}
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
}
