<template>
    <NuxtLayout class="layout">
        <Header/>

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
        }
    ],
    htmlAttrs: {
        class: 'dark',
        lang: 'en'
    }
});

</script>