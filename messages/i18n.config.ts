import {cn} from "@/messages/cn";
import {en} from "@/messages/en";

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        cn
    }
}))
