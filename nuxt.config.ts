// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    sourcemap: {
        server: false,
        client: false
    },
    ssr: false,
    modules: [
        '@nuxtjs/i18n',
        'nuxt-gtag',
        '@pinia/nuxt',
        'nuxt3-localforage',
        "@nuxtjs/google-fonts",
        '@element-plus/nuxt',
        '@vueuse/nuxt'
    ],
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
        vueI18n: './messages/i18n.config.ts',
        strategy: 'no_prefix',
        detectBrowserLanguage: {
            fallbackLocale: 'en',
            useCookie: true,
            cookieKey: 'language',
            redirectOn: 'no prefix',
            alwaysRedirect: true,
            cookieCrossOrigin: true,
        }
    },
    runtimeConfig: {

        SYSTEM_CONFIG: 'http://localhost:9090/soda/RESOURCE_CDN',
        API_ENDPOINT: 'http://127.0.0.1:21001/soda/api',
        SMART_MONEY_URL: 'http://127.0.0.1:21002',
        PROFIT_IMAGE_URL: 'http://127.0.0.1:21003/soda/pf',
        HOT_TOKEN_URL: "http://127.0.0.1:21003/soda/ht",
        public: {
            RESOURCE_CDN: 'http://localhost:9999/soda',
            PRODUCT: 'soda',
        }
    },
    css: [
        "@/assets/scss/base.scss",
        "@/assets/scss/main.scss"
    ],
    vite: {

    },
    googleFonts: {
        useStylesheet: true,
        families: {
            'Lexend Deca': {
                wght: [400, 500, 600, 700, 800]
            },
        },

    },
    elementPlus: {
        themes: ['dark'],
        importStyle: 'scss'
    }
})
