<template>
    <div class="authorize">
        <main>
            <h2 class="toru-id">Toru <Icon name="id"/></h2>

            <template v-if="typeof stage === 'string'">
                <ul class="error">
                    <li v-for="name of stage.slice(4).split('+')" :key="name">
                        {{ name }}
                    </li>
                </ul>
            </template>

            <template v-else-if="stage === 0">
                <ul class="accounts">
                    <li v-for="user of $user.accounts" :key="user._id"
                        @click="account = user; stage = 1"
                    >
                        <Image class="avatar" :src="getDefaultImage(user._id)"/>

                        <div>
                            <div>{{ user?.displayName || user?.username || user?._id }}</div>
                        </div>
                    </li>
                </ul>
            </template>

            <template v-else-if="stage === 1">
                <div class="user-to-app">
                    <Image class="image" :src="getDefaultImage(account?._id!)"/>

                    <Icon name="arrow-right"/>

                    <Image class="image" :src="getDefaultImage(app?._id!, { type: 'pixel' })"/>
                </div>

                <Button label="Войти"
                    icon="login"
                    icon-right="arrow-right"

                    @click="redirectTo"
                />
            </template>
        </main>
    </div>
</template>

<script lang="ts" setup>

import type { User } from '~/types/api/user';
import type { Application } from '~/types/api/application';

interface Query {
    response_type: 'code';
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
}


const { $api, $router } = useNuxtApp();

const $user = useUserStore();

const $route = useRoute();


const stage = ref<number | `err:${string}`>(0);
const app = ref<Application>();

const account = ref<User>();


function setError(name: string) {
    stage.value = typeof stage.value === 'number' ? `err:${name}` : `${stage.value}+${name}`;
}

async function fetchApplication(appId: string) {
    if (!appId) return setError('no_app');

    const { ok, data } = await $api.apps.get(appId);

    if (!ok) return setError('no_app');

    app.value = data;
}

async function redirectTo() {
    const { response_type, client_id, redirect_uri, scope, state = '' } = $route.query as any as Query;

    const { ok, data } = await $api.auth.authorize({
        response_type,
        client_id,
        redirect_uri,
        scope: scope.split('+') as any,
        state
    });

    console.log(ok, data);
    

    if (!ok) return;

    location.href = data.url;
}


onMounted(() => {
    const { response_type, client_id, redirect_uri, scope, state } = $route.query as any as Query;

    if (response_type !== 'code') setError('invalid_response_type');

    if (!client_id) setError('invalid_client_id');
    else fetchApplication(client_id);

    if (!redirect_uri) setError('invalid_redirect_uri');
    if (!scope) setError('invalid_scope');
});


definePageMeta({
    flags: ['hide:header', 'hide:footer']
});

</script>

<style lang="scss" scoped>

.page.authorize {
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
    }


    h2 {
        margin: 0;
        text-align: center;
    }

    h2.toru-id {
        margin-bottom: 12px;
        color: var(--background-secondary);
    }

    ul.accounts {
        li {
            cursor: pointer;
            display: flex;
            padding: 8px;
            align-items: center;
            background-color: var(--background-primary-alt);
            transition: .2s;

            &:not(:last-child) {
                margin-bottom: 2px;
            }

            &:first-child {
                border-top-left-radius: 15px;
                border-top-right-radius: 15px;
            }

            &:last-child {
                border-bottom-left-radius: 15px;
                border-bottom-right-radius: 15px;
            }

            &:hover {
                background-color: var(--background-secondary);
            }

            .avatar {
                margin-right: 8px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }

            .avatar + div {
                max-width: 100%;
                min-width: 0;

                div {
                    max-width: 100%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                div:nth-child(1) {
                    font-size: 14px;
                    font-weight: 600;
                }
            }
        }
    }

    .user-to-app {
        display: flex;
        margin-bottom: 12px;
        align-items: center;
        justify-content: center;

        .image {
            width: 48px;
            height: 48px;
            border-radius: 50%;
        }

        i {
            margin: 0 12px;
        }
    }
}

</style>