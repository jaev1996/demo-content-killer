"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const localActive = useLocale();

    const onSelectChange = (nextLocale: string) => {
        // 1. Poner la cookie con el nuevo idioma
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

        // 2. Refrescar la página para que el servidor use la nueva cookie
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <div className="relative flex items-center rounded-full bg-gray-800 p-1 border border-gray-700 w-fit">
            {/* Fondo deslizante */}
            <div
                className={`absolute top-1 left-1 h-8 w-10 rounded-full bg-red-600 transition-transform duration-300 ease-in-out ${localActive === 'en' ? 'translate-x-full' : 'translate-x-0'
                    }`}
            />
            {/* Botones */}
            <button
                onClick={() => onSelectChange("es")}
                className={`relative z-10 w-10 h-8 rounded-full text-sm font-semibold transition-colors duration-300 ${localActive === 'es' ? 'text-white' : 'text-gray-400'
                    }`}
                disabled={isPending}
            >
                ES
            </button>
            <button
                onClick={() => onSelectChange("en")}
                className={`relative z-10 w-10 h-8 rounded-full text-sm font-semibold transition-colors duration-300 ${localActive === 'en' ? 'text-white' : 'text-gray-400'
                    }`}
                disabled={isPending}
            >
                EN
            </button>
        </div>
    );
}