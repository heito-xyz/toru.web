<template>
    <header>
        <NuxtLink to="/">Toru</NuxtLink>

        <AccountMenu/>
    </header>
</template>

<script lang="ts" setup>

import AccountMenu from './AccountMenu.vue';

</script>

<style lang="scss" scoped>

header {
    display: flex;
    padding: 0 10%;
    width: 100%;
    height: 64px;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    transition: .2s;
    box-sizing: border-box;
    z-index: 100;
}

</style>