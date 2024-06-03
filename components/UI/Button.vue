<template>
    <button class="ui-button"
        :disabled="disabled"
    >
        <Icon :name="icon || ''" v-show="Boolean(icon)"/>

        <div>
            <div>{{ label }}</div>
            <div>{{ text }}</div>
        </div>

        <Icon :name="iconRight || ''" v-show="Boolean(iconRight)"/>
    </button>
</template>

<script lang="ts" setup>

export type ButtonFlag = 'reverse';

const props = withDefaults(defineProps<{
    label: string;
    text?: string;
    icon?: string;
    iconRight?: string;
    color?: string;
    disabled?: boolean;
    flags?: Array<ButtonFlag>;
}>(), {
    color: 'var(--background-secondary)',
    disabled: false,
    flags: () => []
});

</script>

<style lang="scss" scoped>

.ui-button {
    cursor: pointer;
    display: flex;
    padding: 10px 12px;
    width: 100%;
    border-radius: 25px;
    border: 1px dashed var(--T);
    align-items: center;
    justify-content: space-between;
    background-color: v-bind('color');
    box-sizing: border-box;
    transition: .2s, transform 0s;

    &:not(:disabled):active {
        transform: scale(.95);
    }

    &:disabled {
        cursor: not-allowed;
        border-color: var(--background-secondary);
        background-color: var(--T);
        opacity: .7;
    }

    & > div {
        max-width: 100%;
        min-width: 0;

        div {
            max-width: 100%;
            color: var(--text-primary);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        div:nth-child(1) {
            font-size: 14px;
            font-weight: 600;
        }

        div:nth-child(2) {
            color: var(--text-secondary);
            font-size: 10px;
            overflow: .7;
        }
    }

    i {
        color: var(--text-primary);

        &:nth-child(1) {
            margin-right: 8px;
        }

        &:last-child {
            margin-left: 8px;
        }
    }
}

</style>