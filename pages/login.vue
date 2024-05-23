<template>
    <div class="auth">
        <main>
            <h2 class="toru-id">Toru <Icon name="id"/></h2>

            <h2 style="margin: 24px 0 16px 0;">{{ $t(isLoginPage ? 'authorization' : 'registration') }}</h2>

            <Textbox :name="isLoginPage ? 'login' : 'username'"
                :label="$t('username') + (isLoginPage ? ` ${$t('or')} ${$t('email').toLocaleLowerCase()}` : '')"
                
                v-model:value="login"
            />

            <Textbox name="email" v-if="!isLoginPage"
                :label="$t('email')"
                v-model:value="email"
            />

            <Textbox name="password"
                :label="$t('password')"
                type="password"

                v-model:value="password"
            />

            <Textbox v-if="!isLoginPage"
                :label="$t('repeatPassword')"
                type="password"
                
                v-model:value="repeatPassword"
            />

            <NuxtLink v-if="isLoginPage"
                style="text-align: left; margin-top: 4px;"
            >{{ $t('forgotPassword') }}</NuxtLink>

            <Button
                :label="$t(isLoginPage ? 'enterLogin' : 'register')"
                icon="login" icon-right="arrow-right"
                :disabled="!isValidForm"
                
                @click="auth"
            />

            <NuxtLink :to="isLoginPage ? '/register' : '/login'">
                {{ $t(isLoginPage ? 'createAccount' : 'loginAccount') }}
            </NuxtLink>

            <NuxtLink>
                {{ $t('loginOther') }}
            </NuxtLink>
        </main>
    </div>
</template>

<script lang="ts" setup>

// * Types
import type { User } from '~/types/api/user';


const { $api, $router } = useNuxtApp();

const $route = useRoute();

const $user = useUserStore();


const login = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');

const
    regexUsername = /^[a-zA-Z0-9\_\-]+$/,
    regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



const isLoginPage = computed(() => {
    return $route.path.includes('login');
});


// * Valids
const isValidEmail = computed(() => {
    return email.value !== '' && regexEmail.test(email.value);
});

const isValidLogin = computed(() => {
    if (login.value === '' || login.value.trim() === '' || login.value.length < 3) return false;

    if (!isLoginPage.value) return regexUsername.test(login.value);

    return regexUsername.test(login.value) || regexEmail.test(login.value);
});

const isValidPassword = computed(() => {
    return password.value !== '' && password.value.length > 7;
});

const isValidForm = computed(() => {
    return isValidLogin.value && isValidPassword.value && (isLoginPage.value ? true : (isValidEmail.value && password.value === repeatPassword.value))
});


async function auth() {
    if ($user.hasAccount(login.value)) {
        console.log('Already');
        
        return;
    }

    const { ok, data } = await $api.auth[isLoginPage.value ? 'login' : 'register'](...[
        login.value,
        isLoginPage.value ? password.value : email.value,
        password.value
    ]);

    if (!ok) return;

    if (isLoginPage.value) {
        const { user, refreshToken, accessToken } = data as { user: User, accessToken: string, refreshToken: string };
    
        $user.addAccount(user, refreshToken, accessToken, true);
    }

    $router.push('/' + (isLoginPage.value ? '' : 'login'));
}


definePageMeta({
    flags: ['hide:header', 'hide:footer']
});

</script>

<style lang="scss" scoped>

.page.auth {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;

    main {
        padding: 24px;
        min-width: 256px;
        border-radius: 25px;
        border: 2px dashed var(--background-secondary);
        box-shadow: 0 0 0 4px var(--background-primary);
        
        h2 {
            margin: 0;
            text-align: center;
        }

        h2.toru-id {
            color: var(--background-secondary);
        }

        .ui-textbox,
        .ui-button {
            margin-top: 12px;
        }

        a {
            display: block;
            margin-top: 8px;
            width: 100%;
            color: var(--text-secondary);
            font-size: 12px;
            text-align: center;
            text-decoration: none;
            transition: .2s;
            opacity: .7;
            
            &:hover {
                font-weight: 700;
                text-decoration: underline;
                opacity: 1;
            }
        }
    }
}

</style>