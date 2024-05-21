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

    modules: [
        '@pinia/nuxt'
    ],

    pinia: {
        storesDirs: ['./stores/**']
    },

    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL
        }
    }
});