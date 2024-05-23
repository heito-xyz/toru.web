<template>
    <div class="settings">
        <h1>{{ $t('settings') }}</h1>
    </div>
</template>

<script lang="ts" setup>


definePageMeta({
    middleware: ['is-auth'],
});

</script>

<style lang="scss" scoped>

.page.settings {
    display: flex;
    width: 100vw;
    height: 100vh;
    color: var(--background-secondary);
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
        text-align: center;
    }
}

</style>