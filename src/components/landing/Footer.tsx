"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { IconBrandInstagram, IconMail } from "@tabler/icons-react";
import Image from "next/image";

export function Footer() {
    const t = useTranslations('LandingPage.footer');
    const navT = useTranslations('LandingPage.nav');

    const linkGroups = [
        {
            header: t('links.resources.title'),
            links: [
                { label: navT('services'), href: '#services' },
                { label: navT('pricing'), href: '#pricing' },
                { label: navT('faq'), href: '#faq' },
            ]
        },
        {
            header: t('links.legal.title'),
            links: [
                { label: t('links.legal.terms'), href: '/terms' },
                { label: t('links.legal.privacy'), href: '/privacy' },
            ]
        }
    ];

    return (
        <footer className="relative z-10 bg-black/95 pb-10 pt-10 lg:pb-10 lg:pt-[60px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full px-4 sm:w-2/3 lg:w-4/12">
                        <div className="flex items-center mb-4">
                            <Image src="/privaclean.svg" alt="PrivaClean Logo" width={64} height={64} className="size-16" />
                            <span className="ml-2 text-2xl font-bold text-white">PrivaClean</span>
                        </div>
                        <p className="mb-7 text-base text-muted-foreground">
                            {t('privacy')}
                        </p>
                    </div>

                    <div className="w-full px-4 lg:w-8/12">
                        <div className="flex flex-wrap -mx-4">
                            {linkGroups.map((group) => (
                                <div key={group.header} className="w-full px-4 sm:w-1/2 md:w-1/3">
                                    <h4 className="mb-9 text-lg font-semibold text-white">{group.header}</h4>
                                    <ul className="space-y-3">
                                        {group.links.map((link) => (
                                            <li key={link.href}>
                                                <Link href={link.href} className="inline-block text-base leading-loose text-muted-foreground hover:text-red-600">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <div className="w-full px-4 sm:w-1/2 md:w-1/3">
                                <h4 className="mb-9 text-lg font-semibold text-white">{t('links.contact.title')}</h4>
                                <div className="flex items-center space-x-4">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-red-600 transition-colors"><IconBrandInstagram size={24} /></a>
                                    <a href="mailto:contacto@privaclean.com" aria-label="Email" className="text-muted-foreground hover:text-red-600 transition-colors"><IconMail size={24} /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
                <p>{t('copyright')}</p>
            </div>
        </footer>
    );
}
