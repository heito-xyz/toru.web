<template>
    <div class="home">
        <h1>{{ $t('welcome') }}</h1>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

.page.home {
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