<template>
    <div :class="['group', { active: open }]">
        <header @click="open = !open">
            <Icon :name="group?.icon!" v-if="Boolean(group?.icon)"/>
            <Image class="image" :src="group?.image!" v-else-if="Boolean(group?.image)"/>

            <div class="content">
                <div>{{ group?.title || name }}</div>

                <div>{{ group?.text }}</div>
            </div>

            <Icon :name="`arrow-${open ? 'up' : 'down'}`"/>
        </header>

        <AnimationHeight :showed="open">
            <ul>
                <Card v-for="notification of group.list" :key="notification.id"
                    :notification="notification"
                    :show-buttons="true"
                />
            </ul>
        </AnimationHeight>
    </div>
</template>

<script lang="ts" setup>

import Card from './Card.vue';

import type { Notification, Group } from '~/types/stores/notifications';


const props = defineProps<{
    name: string;
    group: Partial<Group> & {
        list?: Array<Notification>;
    };
}>();


const open = ref(false);

</script>

<style lang="scss" scoped>

.group {
    pointer-events: all;
    max-width: 512px;
    min-width: 215px;
    position: relative;

    &.active {
        header {
            border-radius: 15px 15px 0 0;
        }
    }

    header {
        cursor: pointer;
        display: flex;
        padding: 12px;
        align-items: center;
        border-radius: 15px;
        background-color: var(--background-primary-alt);
        transition: .2s;
        user-select: none;

        i:nth-child(1) {
            margin-right: 8px;
        }

        .image {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            border-radius: 50%;
        }

        .content {
            max-width: 100%;
            min-width: 0;

            div {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                &:nth-child(1) {
                    font-size: 12px;
                    font-weight: 700;
                }

                &:nth-child(2) {
                    color: var(--text-secondary);
                    font-size: 10px;
                }
            }
        }

        i:last-child {
            margin-left: auto;
        }
    }
    
    ul {
        .notification {
            margin-top: 2px;
            border-radius: 0;

            &:last-child {
                border-radius: 0 0 15px 15px;
            }
        }
    }
}

</style>