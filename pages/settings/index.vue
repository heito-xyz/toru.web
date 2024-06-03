<template>
    <div class="settings">
        <ul class="nav-list">
            <template v-for="(category, name) in categories" :key="name">
                <li class="label" v-if="!category?.hideLabel">
                    <span>{{ $t(category?.name || name) }}</span>
                </li>

                <NuxtLink v-for="btn of category.pages.sort((a, b) => a.index! > b.index! ? 1 : -1)" :key="btn.path"
                    :to="{ name: btn.path }"
                >
                    <li :class="['button', { active: $route.name === btn.path }]">
                        <Icon :name="btn?.icon!" v-if="Boolean(btn?.icon)"/>

                        <div>{{ $t(btn.label) }}</div>
                    </li>
                </NuxtLink>
            </template>
        </ul>

        <main>
            <header>
                <span></span>
            </header>

            <NuxtPage class="block"/>
        </main>
    </div>
</template>

<script lang="ts" setup>

interface Category {
    hideLabel?: boolean;
    name?: string;
    pages: Array<Button>;
}

interface Button {
    label: string;
    icon?: string;
    index?: number;
    path: string;
}

interface PageSettingsOptions extends Button {
    category: string;
}


const { $router } = useNuxtApp();


const categories = reactive<Record<string, Category>>({
    'default': {
        hideLabel: true,
        pages: []
    },
    'sessions': {
        pages: []
    },
    'integrations': {
        pages: []
    }
});


onMounted(() => {
    if (process.server) return;

    const children = $router.options.routes.find(r => r.name === 'settings')!.children
        ?.filter(c => (c!.meta!.pageSettings as PageSettingsOptions)?.category !== undefined) || [];

    if (children.length < 1) return;

    for (const page of children) {
        const { category: categoryName, index, label = page.path, icon } = page.meta!.pageSettings as PageSettingsOptions;

        const category = categories[categories[categoryName] ? categoryName : 'default']
        
        category.pages.push({
            label,
            icon,
            index: index ?? 999,
            path: String(page.name)
        });
    }
});


definePageMeta({
    middleware: ['is-auth'],
});

</script>

<style lang="scss" scoped>

.page.settings {
    display: grid;
    padding: 72px 10% 0 10%;
    color: var(--text-primary);
    grid-template-areas: 'nav main';
    grid-template-columns: 256px 1fr;
    align-items: start;

    ul.nav-list {
        grid-area: nav;

        a {
            color: var(--text-secondary);
            text-decoration: none;
        }

        li {
            padding: 8px 12px;
            user-select: none;
            transition: .2s;
        }

        li.label {
            margin: 12px 0 4px 0;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 700;
            border-top: 1px dashed var(--background-secondary);
        }

        li.button {
            cursor: pointer;
            display: flex;
            max-width: 100%;
            font-size: 13px;
            align-items: center;
            
            &:hover,
            &.active {
                border-radius: 5px;
                background-color: var(--background-primary-alt);
                
                div {
                    color: var(--text-primary);
                }
            }

            &.active {
                i {
                    color: var(--color-primary);
                }
            }

            i {
                margin-right: 8px;
            }

            div {
                max-width: 100%;
                min-width: 0;
                color: var(--text-secondary);
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: .2s;
                overflow: hidden;
            }
        }
    }

    main {
        margin-left: 12px;
        min-width: 0;
        grid-area: main;
    }
}

</style>