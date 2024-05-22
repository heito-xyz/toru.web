<template>
    <NuxtLayout class="layout">
        <Header v-if="!$route.meta?.flags?.includes('hide:header')"/>

        <NuxtPage class="page"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>

import Header from '~/components/models/header/Index.vue';


const
    $route = useRoute(),
    $request = useRequestURL();


const $user = useUserStore();


onMounted(() => {
    if (process.server) return;

    if (cookies.get('THEME') !== 'light') {
        document.querySelector('html')?.classList.add('dark');
    }
});


// * Meta
useHead({
    titleTemplate: title => {
        return (title ? `${title} - ` : '') + 'Toru'
    },
    meta: [
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: $request.origin + $route.fullPath },
        { name: 'refresh', content: '5' },
        { name: 'theme-color', content: '#fe4d7c' },
        { name: 'apple-mobile-web-app-status-bar-style', content: '#fe4d7c' },
    ],
    link: [
        {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.ico'
        },
        // {
        //     rel: 'stylesheet',
        //     href: 'https://ti.heito.xyz/style.css'
        // }
    ],
    htmlAttrs: {
        class: 'light',
        lang: 'en'
    }
});

</script>