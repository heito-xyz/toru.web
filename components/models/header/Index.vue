<template>
    <header>
        <NuxtLink class="logo" to="/">Toru <Icon name="id"/></NuxtLink>

        <ul class="buttons">
            <Icon name="bell"
                @click="$notifications.setActive(true)"
            />
        </ul>

        <AccountMenu/>
    </header>
</template>

<script lang="ts" setup>

import AccountMenu from './AccountMenu.vue';


const $notifications = useNotificationsStore();

</script>

<style lang="scss" scoped>

header {
    display: flex;
    padding: 0 10%;
    width: 100%;
    height: 64px;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    transition: .2s;
    box-sizing: border-box;
    z-index: 190;

    a.logo {
        color: var(--color-2);
        font-weight: 700;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    ul.buttons {
        margin: 0 12px 0 auto;

        i {
            cursor: pointer;
            color: var(--text-secondary);
            transition: .2s;

            &:hover {
                color: var(--color-primary);
            }
        }
    }
}

</style>