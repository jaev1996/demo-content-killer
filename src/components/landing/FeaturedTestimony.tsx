"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { IconBrandInstagram, IconBrandTiktok, IconExternalLink, IconQuote } from "@tabler/icons-react";

export function FeaturedTestimony() {
    const t = useTranslations('LandingPage.testimony');

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background blobs for aesthetics */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-12 lg:gap-24 items-center text-center lg:text-left">

                    {/* Content Column (Lighter weight) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col space-y-6 lg:max-w-md order-last lg:order-first"
                    >
                        <div>
                            {/* Section Title */}
                            <h3 className="text-red-600 font-black text-xs uppercase tracking-[0.4em] mb-4">
                                {t('title')}
                            </h3>

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                                </span>
                                {t('badge')}
                            </div>

                            <div className="relative">
                                <IconQuote className="absolute -top-10 -left-6 size-12 text-red-600/10 -z-10 hidden lg:block" />
                                <h2 className="text-base md:text-lg font-medium text-foreground/90 leading-relaxed italic mb-8 text-pretty">
                                    &ldquo;{t('content')}&rdquo;
                                </h2>
                            </div>

                            <div className="flex flex-col border-l-4 border-red-600 pl-4 space-y-1 items-center lg:items-start">
                                <span className="text-xl font-black text-foreground tracking-tighter uppercase leading-none">{t('name')}</span>
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em]">{t('role')}</span>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <Link
                                href="/register"
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white bg-red-600 rounded-full overflow-hidden transition-all duration-300 hover:bg-red-700 shadow-xl shadow-red-600/20 hover:shadow-red-600/30 transform hover:-translate-y-1 active:scale-95 uppercase tracking-tighter text-base"
                            >
                                <span className="relative z-10">{t('cta')}</span>
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Visual Column (Heavier weight) */}
                    <div className="relative group flex flex-col items-center order-first lg:order-last">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative w-[350px] max-w-md"
                        >
                            {/* Gradient Glow */}
                            <div className="absolute -inset-10 bg-gradient-to-tr from-red-600/20 to-purple-600/20 rounded-[3rem] blur-3xl opacity-30" />

                            <div className="relative aspect-[3/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-black/5">
                                <Image
                                    src="/mmmarian.webp"
                                    alt="Mmmariangel Testimony"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* Social Media Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4 mt-10 relative z-10"
                        >
                            <a
                                href="https://onlyfans.com/mmmariangel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-white/5 hover:bg-red-600/10 text-muted-foreground hover:text-red-600 transition-all border border-white/5 hover:border-red-600/20 shadow-xl group/icon"
                                title="OnlyFans"
                            >
                                <div className="flex items-center gap-2">
                                    <IconExternalLink size={32} className="transition-transform group-hover/icon:scale-110" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">OnlyFans</span>
                                </div>
                            </a>
                            <a
                                href="https://www.instagram.com/mmmariangel?igsh=MXFxMnloYnF2ZGtjeQ%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-white/5 hover:bg-red-600/10 text-muted-foreground hover:text-red-600 transition-all border border-white/5 hover:border-red-600/20 shadow-xl group/icon"
                                title="Instagram"
                            >
                                <IconBrandInstagram size={32} className="transition-transform group-hover/icon:scale-110" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@mmmariangel23?_r=1&_t=ZS-93ZDdgvaBtc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-white/5 hover:bg-red-600/10 text-muted-foreground hover:text-red-600 transition-all border border-white/5 hover:border-red-600/20 shadow-xl group/icon"
                                title="TikTok"
                            >
                                <IconBrandTiktok size={32} className="transition-transform group-hover/icon:scale-110" />
                            </a>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
