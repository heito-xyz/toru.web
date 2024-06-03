<template>
    <div class="applications">
        <header>
            Applications

            <Button
                :label="$t(newApp.open ? 'rollUp' : 'createApp')"
                :icon="newApp.open ? 'minus' : 'plus'"
                :color="newApp.open ? undefined : 'green'"
                
                @click="newApp.open = !newApp.open"
            />
        </header>

        <AnimationHeight :showed="newApp?.open">
            <div class="new">
                <Textbox :label="$t('name')"
                    v-model:value="newApp.name"
                />

                <Textbox :label="$t('displayName')"
                    v-model:value="newApp.displayName"
                />

                <Textbox :label="$t('description')" type="area"
                    v-model:value="newApp.description"
                />

                <Button :label="$t('createApp')"
                    icon="check"
                    icon-right="arrow-right"
                    color="var(--color-primary)"
                    :disabled="newApp?.name === '' || newApp?.displayName === ''"

                    @click="createApp"
                />
            </div>
        </AnimationHeight>

        <ul>
            <li v-for="app of apps" :key="app._id"
                @click="$router.push(`/applications/${app._id}`)"
            >
                <Image class="image" :src="getDefaultImage(app._id, { type: 'pixel' })"/>

                <div>
                    <div>{{ app?.displayName || app?.name || app?._id }}</div>
                    <div>@{{ app?.name }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import type { Application } from '~/types/api/application';


const { $api } = useNuxtApp();


const apps = ref<Array<Application>>([]);

const newApp = ref<Pick<Application, 'displayName' | 'name' | 'description'> & { open: boolean }>({
    open: false,
    name: '',
    displayName: '',
    description: ''
});


async function fetchUserApplications() {
    const { ok, data } = await $api.apps.list();
    
    if (!ok) return null;

    apps.value = data.results;
}

async function createApp() {
    const { name, displayName, description } = newApp.value;

    if (name === '' || displayName === '') return;

    const { ok, data } = await $api.apps.create(name!, displayName);

    if (!ok) return;

    apps.value.push(data);

    newApp.value = {
        open: false,
        name: '',
        displayName: '',
        description: ''
    }
}


onMounted(() => {
    if (process.server) return;

    fetchUserApplications();
});


definePageMeta({
    pageSettings: {
        label: 'applications',
        icon: 'apps',
        category: 'integrations'
    }
});

</script>

<style lang="scss" scoped>

.block.applications {
    header {
        display: flex;
        align-items: center;

        .ui-button {
            margin-left: auto;
            max-width: max-content;
        }
    }

    .new {
        display: grid;
        margin-top: 12px;
        grid-template-columns: 1fr 1fr;
        gap: 12px;

        .ui-textbox:nth-child(3) {
            grid-column: span 2;
        }
    }

    ul {
        margin-top: 12px;
        border-radius: 15px;
        border: 1px dashed var(--color-primary);
        overflow: hidden;

        li {
            cursor: pointer;
            display: flex;
            padding: 12px;
            align-items: center;
            transition: .2s;
            user-select: none;

            &:not(:last-child) {
                border-bottom: 1px dashed var(--color-primary);
            }

            &:hover {
                background-color: var(--background-primary-alt);
                .image {
                    box-shadow: 0 0 0 8px var(--background-primary);
                    transform: scale(.9);
                }

                .image + div {
                    div:nth-child(1) {
                        text-decoration: underline;
                    }
                }
            }

            &:active {
                .image {
                    box-shadow: 0 0 0 12px var(--background-primary);
                    transform: scale(.8);
                }
            }

            .image {
                margin-right: 12px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                transition: .2s;

                &.ui-image {
                    background-color: var(--background-primary);
                }
            }

            .image + div {
                max-width: 100%;
                min-width: 0;

                div {
                    max-width: 100%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;

                    &:nth-child(1) {
                        font-size: 14px;
                        font-weight: 600;
                    }

                    &:nth-child(2) {
                        font-size: 10px;
                        opacity: .7;
                    }
                }
            }
        }
    }
}

</style>