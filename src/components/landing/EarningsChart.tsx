"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    ArrowUpRight,
    CheckCircle2,
    Shield
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function EarningsChart() {
    const t = useTranslations('LandingPage.earnings');
    return (
        <section className="w-full py-16 md:py-28 overflow-visible bg-background relative">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Columna Izquierda: Visual del Teléfono (Imagen Directa) */}
                    <div className="relative flex justify-center lg:justify-end order-2 lg:order-1">

                        {/* Wrapper for Image and Overlays */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-20"
                        >
                            {/* Main Image: Already contains the phone frame */}
                            <div className="relative w-[520px] md:w-[700px]">
                                <Image
                                    src="/charts-phone.webp"
                                    alt="Privaclean Earnings Interface"
                                    width={600}
                                    height={1200}
                                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Columna Derecha: Texto y Acción */}
                    <div className="flex flex-col space-y-10 order-1 lg:order-2 z-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black tracking-[0.2em] uppercase">
                                <Shield className="w-4 h-4" />
                                <span>{t('badge')}</span>
                            </div>

                            <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.85] text-foreground transition-colors uppercase">
                                {t('titleLine1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
                                    {t('titleHighlight')}
                                </span> <br />
                                {t('titleLine2')}
                            </h2>

                            <p className="text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                                {t('description')}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 pt-4"
                        >
                            <Button asChild size="lg" className="h-20 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-12 text-2xl rounded-2xl shadow-[0_25px_50px_-15px_rgba(220,38,38,0.6)] transition-all hover:scale-105 active:scale-95 group border-b-4 border-red-800">
                                <Link href="/register" className="flex items-center gap-3 uppercase">
                                    {t('cta')}
                                    <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </Button>

                            <div className="flex flex-col gap-3 text-left">
                                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground dark:text-slate-200">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span>{t('feature1')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground dark:text-slate-200">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span>{t('feature2')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}