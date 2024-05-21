<template>
    <div class="home">
        <p>{{ $user.user }}</p>
        <input type="text" v-model="login" :placeholder="'Username' + (isLogin ? ' or Email' : '')">
        <input type="email" v-if="type === 'register'"
            placeholder="Email"
            v-model="email"
        >
        <input type="password" placeholder="Password" v-model="password">

        <button
            @click="type = isLogin ? 'register' : 'login'"
        >{{ isLogin ? 'to Register' : 'to Login' }}</button>

        <button @click="auth">Auth</button>
    </div>
</template>

<script lang="ts" setup>

// * Types
import type { User } from '~/types/api/user';


const { $api } = useNuxtApp();

const $user = useUserStore();


const type = ref<'login' | 'register'>('register');
const login = ref('');
const password = ref('');
const email = ref('');


const isLogin = computed(() => type.value === 'login');


async function auth() {
    if ($user.hasAccount(login.value)) {
        console.log('Already');
        
        return;
    }
    const { ok, data } = await $api.auth[type.value](...[
        login.value,
        isLogin.value ? password.value : email.value,
        password.value
    ]);

    console.log(ok, data);
    

    if (!ok) return;

    if (type.value === 'register') return type.value = 'login';
    else {
        const { user, refreshToken, accessToken } = data as { user: User, accessToken: string, refreshToken: string };

        console.log(12331212312);
        
    
        $user.addAccount(user, refreshToken, accessToken, true);
    }
}

</script>

<style lang="scss" scoped>

.page.home {
    display: flex;
    width: 100vw;
    height: 100vh;
    color: red;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

</style>