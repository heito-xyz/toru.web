export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    // * User
    const $user = useUserStore();

    if ($user.isAuth) return;

    console.log(123);
    

    $user.fetchAccounts();
});