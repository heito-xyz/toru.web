<template>
    <div class="btn">
        <Icon :name="icon || ''" v-if="Boolean(icon) && !img"/>
        <img :src="img" alt="Button Image" v-else-if="Boolean(img)">

        <div>
            <div>{{ label }}</div>
            <div>{{ text }}</div>
        </div>

        <slot name="after-content"></slot>

        <Icon :name="iconRight || ''" v-if="Boolean(iconRight)"/>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    label: string;
    icon?: string;
    iconRight?: string;
    text?: string;
    img?: string;
}>();

</script>

<style lang="scss" scoped>

.btn {
    cursor: pointer;
    display: flex;
    padding: 12px 24px;
    align-items: center;
    background-color: var(--dimming-primary);
    transition: .2s;
    user-select: none;

    &:hover  {
        background-color: var(--dimming-secondary);
    }

    img {
        margin-right: 8px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        transition: .2s;
    }

    & > div {
        max-width: 100%;
        width: 100%;
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

        div:nth-child(2) {
            font-size: 10px;
            opacity: .7;
        }
    }

    i {
        margin: 0 8px 0 0;
        transition: .2s;

        &:last-child {
            margin: 0 0 0 auto;
        }
    }
}

</style>