<template>
    <div :class="['notification', { hide }]">
        <slot name="before"></slot>

        <header>
            <div class="i" v-if="notification?.icon || notification?.image"
                :class="{
                    image: notification?.image,
                    icon: notification?.icon
                }"
            >
                <Image class="img" :src="notification?.image!" v-if="Boolean(notification?.image)"/>

                <Icon :name="notification?.icon!" v-if="Boolean(notification?.icon)"/>
            </div>

            <div class="content">
                <div>{{ notification?.title }}</div>

                <div>{{ notification?.text }}</div>
            </div>
        </header>

        <AnimationHeight :showed="showButtons && notification?.buttons?.length! > 0">
            <ul class="buttons">
                <li v-for="button of notification?.buttons" :key="button?.label"
                    @click.stop.prevent="button?.click ? button?.click($event) : null"
                >
                    <Icon :name="button?.icon!" v-show="Boolean(button?.icon)"/>

                    <div>
                        <div>{{ button?.label }}</div>

                        <div>{{ button?.text }}</div>
                    </div>
                </li>
            </ul>
        </AnimationHeight>

        <ul class="options" v-show="showOptions && notification?.mode === 'fixed'">
            <li @click.stop.prevent="$emit('hide')">
                <Icon name="minus"/>
            </li>
        </ul>

        <slot></slot>
    </div>
</template>

<script lang="ts" setup>

import type { Notification } from '~/types/stores/notifications';


const $emit = defineEmits({
    hide() {}
});

const props = defineProps<{
    notification: Notification;
    showButtons?: boolean;
    showOptions?: boolean;
}>();


const hide = ref<boolean>(false);

</script>

<style lang="scss" scoped>

.notification {
    pointer-events: all;
    padding: 12px;
    max-width: 512px;
    min-width: 215px;
    position: relative;
    border-radius: 15px;
    border: 1px solid var(--background-primary);
    background-color: var(--background-primary-alt);
    transition: .2s;

    header {
        display: flex;
        position: relative;
        align-items: center;

        .i {
            margin-right: 12px;
            position: relative;

            &.icon {
                max-width: 32px;
                min-width: 32px;
                height: 32px;
            }

            &.image {
                max-width: 48px;
                min-width: 48px;
                height: 48px;
            }

            &.image.icon {
                .img {
                    mask-image: radial-gradient(circle 12px at center, transparent 100%, green 0%);
                    mask-size: 84px 84px, 100%;
                    -webkit-mask-image: radial-gradient(circle 12px at center, transparent 100%, green 0%);
                    -webkit-mask-size: 84px 84px, 100%;
                }
                
                .ui-icon {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    bottom: -6px;
                    right: -6px;
                    border-radius: 50%;
                    z-index: 2;

                    &::after {
                        background-color: transparent;
                    }
                }
            }

            .img {
                width: 100%;
                height: 100%;
                border-radius: 10px;
            }
        }

        .content {
            max-width: 100%;
            min-width: 0;

            div {
                max-width: 100%;
                text-overflow: ellipsis;
                overflow: hidden;

                &:nth-child(1) {
                    font-size: 14px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                &:nth-child(2) {
                    display: -webkit-box;
                    color: var(--text-secondary);
                    font-size: 12px;
                    line-clamp: 2;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }

    ul.buttons {
        display: grid;
        margin-top: 8px;
        border-radius: 15px;
        grid-template-columns: repeat(2, 1fr);
        gap: 2px;
        overflow: hidden;
        user-select: none;

        li {
            cursor: pointer;
            display: flex;
            padding: 12px;
            align-items: center;
            background-color: var(--background-secondary);
            box-sizing: border-box;
            transition: .2s;

            &:hover {
                background-color: var(--background-primary);
            }

            &:nth-child(2n + 1):not(:has(+ li)) {
                grid-column: span 2;
            }

            i {
                margin-right: 8px;
                font-size: 14px;
            }

            & > div {
                max-width: 100%;
                min-width: 0;

                div {
                    max-width: 100%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;

                    &:nth-child(1) {
                        font-size: 14px;
                    }

                    &:nth-child(2) {
                        color: var(--text-secondary);
                        font-size: 12px;
                    }
                }
            }
        }
    }

    ul.options {
        position: absolute;
        right: -10px;
        top: -10px;

        li {
            cursor: pointer;
            display: flex;
            width: 20px;
            height: 20px;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 1px solid var(--background-primary);
            background-color: var(--background-primary-alt);

            i {
                font-size: 14px;
            }
        }
    }
}

</style>