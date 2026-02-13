import { NextIntlClientProvider } from "next-intl";
import type { Metadata, Viewport } from "next";
import "./globals.css"; // Importa los estilos de Tailwind aquí
import { AuthProvider } from "@/contexts/auth-context";
import { CreatorAuthProvider } from "@/contexts/creator-auth-context";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    title: {
        default: "PrivaClean - Protección de Contenido Digital",
        template: "%s | PrivaClean"
    },
    description: "Protege tu contenido digital con PrivaClean. Eliminación rápida y efectiva de contenido no autorizado mediante notificaciones DMCA.",
    keywords: ["DMCA", "protección de contenido", "eliminación de contenido", "copyright", "contenido digital", "creadores de contenido"],
    authors: [{ name: "PrivaClean" }],
    creator: "PrivaClean",
    publisher: "PrivaClean",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    icons: {
        icon: [
            { url: "/privaclean.svg?v=1", type: "image/svg+xml" },
        ],
        apple: "/privaclean.svg?v=1",
    },
    manifest: "/site.webmanifest",
    openGraph: {
        type: "website",
        locale: "es_ES",
        alternateLocale: ["en_US"],
        url: "https://privaclean.com",
        title: "PrivaClean - Protección de Contenido Digital",
        description: "Protege tu contenido digital con PrivaClean. Eliminación rápida y efectiva de contenido no autorizado.",
        siteName: "PrivaClean",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "PrivaClean - Protección de Contenido Digital",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "PrivaClean - Protección de Contenido Digital",
        description: "Protege tu contenido digital con PrivaClean. Eliminación rápida y efectiva de contenido no autorizado.",
        images: ["/og-image.png"],
    },
};

type Props = {
    children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider
                        locale={locale}
                        messages={messages}
                    >
                        <AuthProvider>
                            <CreatorAuthProvider>
                                {children}
                            </CreatorAuthProvider>
                        </AuthProvider>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
