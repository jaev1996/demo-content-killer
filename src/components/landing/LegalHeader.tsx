"use client";

import Link from "next/link";
import { IconArrowLeft, IconShield } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export function LegalHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center" aria-label="Volver a la página de inicio">
                            <IconShield className="text-red-600 size-8" />
                            <span className="ml-2 text-2xl font-bold text-foreground">PrivaClean</span>
                        </Link>
                        <Link href="/" className="text-muted-foreground hover:text-red-600 transition-colors flex items-center gap-2">
                            <IconArrowLeft size={18} /> Volver al inicio
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}