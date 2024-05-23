export default defineNuxtConfig({
    css: [
        '~/assets/styles/root.scss'
    ],

    components: {
        global: true,
        dirs: [
            {
                path: '~/components/UI',
                pathPrefix: false
            },
            {
                path: '~/components/animation',
                prefix: 'Animation',
                pathPrefix: true
            }
        ]
    },

    hooks: {
        'pages:extend'(pages) {
            pages.push({
                name: 'register',
                path: '/register',
                file: '~/pages/login.vue',
                alias: [
                    '/reg'
                ]
            });
        }
    },

    modules: [
        '@pinia/nuxt'
    ],

    pinia: {
        storesDirs: ['./stores/**']
    },

    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL,
            apiTranslateUrl: process.env.API_TRANSLATE_URL
        }
    }
});