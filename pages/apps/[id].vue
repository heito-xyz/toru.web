<template>
    <div class="application" v-if="app?._id">
        <header>
            <Image class="image" :src="getDefaultImage(app?._id!, { type: 'pixel' })"/>

            <div>
                <div>{{ app?.displayName || app?.name || app?._id }}</div>
                <div>@{{ app?.name }}</div>
            </div>
        </header>

        <ul class="nav-list">
            <NuxtLink v-for="(btn, idx) of navButtons" :key="idx"
                :to="{ name: btn.path }"
            >
                <li :class="{ active: $route.name === btn.path }">
                    <Icon :name="btn.icon!"/>

                    <div>{{ $t(btn.name) }}</div>
                </li>
            </NuxtLink>
        </ul>

        <main>
            <NuxtPage class="block"
                :app="app"
            />
        </main>
    </div>
</template>

<script lang="ts" setup>

import type { Application } from '~/types/api/application';

interface Button {
    name: string;
    icon: string;
    path: string;
}


const { $api } = useNuxtApp();

const $route = useRoute();


const $notifications = useNotificationsStore();


const saveApp = ref<string>('');
const app = ref<Application>();


const navButtons = computed<Array<Button>>(() => {
    const children = $route.matched.find(m => m.name === 'application')!.children
        .filter(c => (c.meta?.appItem as any)?.name);
        
    return children.map(c => ({
        ...c.meta?.appItem as Button,
        path: String(c.name)
    }));
});


watch(() => app.value, value => {
    if (JSON.stringify(value) === saveApp.value) return;

    const name = `app:${app.value?._id}`;

    if (!$notifications.hasGroup(name)) {
        $notifications.createGroup(name, {
            title: app.value?.displayName,
            image: getDefaultImage(app.value?._id!, { type: 'pixel' })
        });
    }

    if ($notifications.has(name + ':update')) return;
    
    const notification = $notifications.push({
        name: name + ':update',
        image: getDefaultImage(app.value?._id!, { type: 'pixel' }),
        icon: 'apps',
        title: 'Осторожно',
        text: 'У вас есть несохраненные изменения!',
        mode: 'fixed',
        group: name,
        buttons: [
            {
                label: 'Сохранить',
                icon: 'check',
                click: async () => {
                    const { ok, data } = await $api.apps.update(app.value?._id!, app.value!);

                    if (!ok) {
                        return $notifications.push({
                            title: 'Ошибка',
                            text: 'Не удалось сохранить приложение'
                        });
                    }

                    saveApp.value = JSON.stringify(data);
                    app.value = data;

                    notification.remove();

                    $notifications.push({
                        text: 'Приложение успешно сохранено'
                    });
                }
            },
            {
                label: 'Сбросить',
                icon: 'close',
                click: () => {
                    app.value = JSON.parse(saveApp.value) as Application;

                    notification.remove();
                }
            }
        ]
    })
}, {
    deep: true
});


async function fetchApplication(id: string = String($route.params.id)) {
    const { ok, data } = await $api.apps.get(id);
    
    if (!ok) return null;

    app.value = data;
    saveApp.value = JSON.stringify(data);
}


onMounted(() => {
    if (process.server) return;

    fetchApplication();
});

onUnmounted(() => {
    $notifications.remove(`app:${app.value?._id}:update`);
});


definePageMeta({
    name: 'application',
    alias: [
        '/applications/:id'
    ]
});

</script>

<style lang="scss" scoped>

.page.application {
    display: grid;
    padding: 72px 10% 0 10%;
    grid-template-columns: 215px 1fr;
    grid-template-areas: 'header header'
                         'nav main';

    header {
        display: flex;
        margin-bottom: 12px;
        align-items: center;
        grid-area: header;

        .image {
            margin-right: 12px;
            width: 64px;
            height: 64px;
            border-radius: 5px;
        }

        .image + div {
            max-width: 100%;
            min-width: 0;

            div {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            div:nth-child(1) {
                font-weight: 700;
            }

            div:nth-child(2) {
                font-size: 12px;
                opacity: .7;
            }
        }
    }

    ul.nav-list {
        grid-area: nav;
        
        a {
            color: var(--text-secondary);
            text-decoration: none;
        }

        li {
            cursor: pointer;
            display: flex;
            padding: 8px 12px;
            align-items: center;
            transition: .2s;
            user-select: none;

            &:hover,
            &.active {
                border-radius: 5px;
                background-color: var(--background-primary-alt);
            }

            i {
                margin-right: 8px;
                transition: .2s;
            }

            div {
                max-width: 100%;
                min-width: 0;
                font-size: 14px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }

    main {
        margin-left: 12px;
        max-width: 100%;
        min-width: 0;
        grid-area: main;
    }
}

</style>