<template>
    <div class="oauth2">
        <Group class="info" label="Client information">
            <div>
                <div class="title">Client ID</div>

                <p>{{ app._id }}</p>
            </div>

            <div>
                <div class="title">Client Secret</div>

                <p>{{ app.secret }}</p>
            </div>
        </Group>

        <Group class="redirects" label="Redirects" text="You must specify at least one URI for authentication to work. If you pass a URI in an OAuth request, it must exactly match one of the URIs you enter here.">
            <div class="redirect" v-for="(url, idx) of app.redirectUris" :key="url">
                <Textbox label="URL"
                    :value="app.redirectUris[idx]"
                    
                    @blur="app.redirectUris[idx] = $event.target.value"
                />
    
                <Icon name="close"
                    @click="app.redirectUris.splice(idx, 1)"
                />
            </div>

            <Button label="Add"
                @click="app.redirectUris.push('')"
            />
        </Group>

        <Group class="generate" label="OAuth2 URL Generator" text="Generate an invite link for your application by picking the scopes and permissions it needs to function. Then, share the URL to others!">
            <div class="title">Scopes</div>
            
            <div class="scopes">
                <label v-for="(scope, idx) of tokenScope" :key="scope">
                    <input type="checkbox" name="generate"
                        :id="scope"
                        :value="scope"

                        v-model="selected.scopes"
                    >

                    <span>{{ scope }}</span>
                </label>
            </div>

            <select v-model="selected.redirectUri">
                <option v-for="uri of app.redirectUris" :value="uri">
                    {{ uri }}
                </option>
            </select>

            <div class="url" v-show="selected.scopes.length > 0 && selected.redirectUri">
                {{ readyAuthUrl }}
            </div>
        </Group>
    </div>
</template>

<script lang="ts" setup>

import Group from '~/components/models/apps/Group.vue';

import { tokenScope, type TokenScope } from '~/types/api/token';
import type { Application } from '~/types/api/application';


const $request = useRequestURL();


const props = defineProps<{
    app: Application;
}>();


const selected = ref<{
    scopes: Array<TokenScope>;
    redirectUri: string;
}>({
    scopes: [],
    redirectUri: ''
});


const readyAuthUrl = computed(() => {
    const { scopes, redirectUri } = selected.value;

    if (scopes.length < 1 || !redirectUri) return '';

    const url = new URL($request.origin + '/oauth/authorize');

    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', props.app?._id);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', scopes.join(' '));

    return url.toString();
});


definePageMeta({
    appItem: {
        name: 'OAuth2',
        icon: 'login'
    }
});

</script>

<style lang="scss" scoped>

.block.oauth2 {
    padding-bottom: 64px;
    
    .title {
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        user-select: none;
    }

    :deep(.group) {
        &:not(:last-child) {
            margin-bottom: 12px;
        }
    }

    :deep(.group.info) {
        .content {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;

            p {
                margin: 12px 0 0 0;
            }
        }
    }

    :deep(.group.redirects) {
        .redirect {
            display: flex;
            margin-top: 12px;
            align-items: center;

            &:last-of-type {
                margin-bottom: 12px;
            }

            i {
                cursor: pointer;
                margin-left: 12px;
                transition: .2s;

                &.close {
                    &:hover {
                        color: red;
                    }
                }
            }
        }
    }

    :deep(.group.generate) {
        .scopes {
            display: grid;
            margin-top: 12px;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        select {
            margin-top: 12px;
            padding: 8px 12px;
            width: 100%;
        }

        .url {
            margin: 12px 0 0 0; 
            padding: 12px;
            max-width: 100%;
            word-break: break-all;
            border-radius: 15px;
            border: 1px solid var(--background-primary);
            background-color: var(--background-secondary);
            user-select: all;
        }
    }
}

</style>