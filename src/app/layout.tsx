import { NextIntlClientProvider } from "next-intl";
import "./globals.css"; // Importa los estilos de Tailwind aquí
import { AuthProvider } from "@/contexts/auth-context";
import { CreatorAuthProvider } from "@/contexts/creator-auth-context";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";

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
