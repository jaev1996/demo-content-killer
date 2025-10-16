import { NextIntlClientProvider } from "next-intl";
import "./globals.css"; // Importa los estilos de Tailwind aquí
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
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
