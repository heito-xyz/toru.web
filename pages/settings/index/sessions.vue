<template>
    <div class="sessions">
        Sessions

        <ul>
            <li v-for="token of tokens" :key="token._id"
                :class="{ active: token?.open }"
            >
                <header @click="token.open = !token?.open">
                    <Icon :name="token.os.icon"/>

                    <div>
                        <div>{{ token.agent }}</div>
                        <div><b>Signed in:</b> {{ $time.timeago(token.createdAt) }}</div>
                    </div>

                    <div style="margin-left: auto;"></div>

                    <Icon name="arrow-up"/>
                </header>

                <AnimationHeight :showed="token?.open">
                    <div class="content">
                        .
                    </div>
                </AnimationHeight>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import type { Token } from '~/types/api/token';

type Session = Token & {
    open?: boolean;
    os: DeviceItem;
    browser: DeviceItem;
}


const { $api } = useNuxtApp();


const tokens = ref<Array<Session>>([]);


async function fetchUserTokens() {
    const { ok, data } = await $api.auth.getUserTokens();

    console.log(ok, data);
    
    if (!ok) return null;

    tokens.value = data.results.map(token => {
        const device = $device.getInfo(token.agent);

        return {
            ...token,
            ...device
        }
    });
}


onMounted(() => {
    if (process.server) return;

    fetchUserTokens();
});


definePageMeta({
    pageSettings: {
        label: 'sessions',
        icon: 'database',
        category: 'sessions',
        index: 1
    }
});

</script>

<style lang="scss" scoped>

.block.sessions {
    ul {
        margin-top: 12px;
        border-radius: 5px;
        border: 1px dashed var(--color-primary);

        li {
            &:not(:last-child) {
                border-bottom: 1px dashed var(--color-primary);
            }

            &.active {
                header {
                    i:last-child {
                        transform: rotate(180deg);
                    }
                }
            }

            header {
                cursor: pointer;
                display: flex;
                padding: 12px;
                align-items: center;

                i:nth-child(1) {
                    margin-right: 12px;
                    font-size: 24px;
                }

                i:nth-child(1) + div {
                    max-width: 100%;
                    min-width: 0;

                    div {
                        max-width: 100%;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;

                        &:nth-child(1) {
                            color: var(--text-secondary);
                            font-size: 14px;
                            font-weight: 700;
                        }

                        &:nth-child(2) {
                            color: var(--text-secondary);
                            font-size: 12px;
                        }
                    }
                }

                i:last-child {
                    margin-left: 12px;
                    transition: .2s;
                }
            }

            .content {
                padding: 0 12px 12px 12px;
            }
        }
    }
}

</style>