export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;

    const $user = useUserStore();

    if (!$user.isAuth) {
        return navigateTo('/auth', { external: true });
    }
});