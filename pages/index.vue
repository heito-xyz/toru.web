<template>
    <div class="home">
        <h1>Добро пожаловать :)</h1>
    </div>
</template>

<script lang="ts" setup>

const { $router } = useNuxtApp();


const $user = useUserStore();


onMounted(() => {
    if (process.server) return;

    if (!$user.isAuth) return $router.push('/login');
});

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