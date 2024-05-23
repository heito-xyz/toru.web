export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    // * Stores
    const $index = useStore();
    const $user = useUserStore();
    const $wait = useWaitStore();

    if (!$user.isAuth) {
        await $user.fetchAccounts();
    }

    console.log('auth');
    
    $index.setReady(true);
});