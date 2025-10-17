import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

// A list of all locales that are supported
export const locales = ["en", "es"];

export default getRequestConfig(async () => {
    // Read the locale from the cookies
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});

