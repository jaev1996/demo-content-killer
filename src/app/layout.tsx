import { NextIntlClientProvider } from "next-intl";
// @ts-ignore: allow importing global css without type declarations
import "./globals.css"; // Importa los estilos de Tailwind aquí
import { AuthProvider } from "@/contexts/auth-context";
import { getLocale, getMessages } from "next-intl/server";

type Props = {
    children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider
                    locale={locale}
                    messages={messages}
                >
                    <AuthProvider>{children}</AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
