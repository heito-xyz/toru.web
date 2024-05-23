<template>
    <div class="wait">
        <div class="item current" v-if="current">
            <span>{{ current?.label || current?.name }}</span>

            <CircleSpinner size="24px"/>
        </div>

        <div class="count" v-show="$wait.list.length > 1">{{ $wait.list.length - 1 }}</div>

        <ul>
            <li class="item" v-for="item of $wait.list.slice(1)" :key="item.id">
                <span>{{ item?.label || item?.name }}</span>

                <CircleSpinner size="16px"/>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import CircleSpinner from '../other/CircleSpinner.vue';


const $wait = useWaitStore();


const current = computed(() => {
    if (!$wait.list.length) return null;

    return $wait.list[0];
});

</script>

<style lang="scss" scoped>

.wait {
    position: fixed;
    right: 12px;
    bottom: 12px;
    z-index: 200;
    user-select: none;

    .item {
        display: flex;
        padding: 4px;
        position: relative;
        align-items: center;
        border-radius: 25px;
        background-color: var(--background-primary);
        transition: .2s;

        &.current {
            z-index: 3;

            &:hover {
                span {
                    margin: 0 8px;
                    font-size: 12px;
                    opacity: 1;
                }
            }

            span {
                margin: 0;
                font-size: 0px;
                opacity: 0;
            }
        }

        span {
            margin: 0 8px;
            color: #fff;
            font-size: 12px;
            white-space: nowrap;
            transition: .2s;
        }
    }

    .count {
        padding: 2px 3px;
        position: absolute;
        right: -10px;
        top: 50%;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        border-radius: 0 5px 5px 0;
        background-color: var(--background-primary);
        transform: translateY(-50%);
        transition: .2s;
        z-index: 2;

        &:hover {
            opacity: .5;
        }

        &:hover + ul {
            opacity: 1;
        }
    }

    ul {
        // pointer-events: none;
        display: flex;
        position: absolute;
        right: 0;
        bottom: 34px;
        align-self: end;
        flex-direction: column;
        transition: .2s;
        opacity: 0;

        li.item {
            &:not(:last-child) {
                margin-bottom: 2px;
            }

            span {
                font-size: 10px;
            }
        }
    }
}

</style>