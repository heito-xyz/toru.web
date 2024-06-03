<template>
    <div class="group">
        <h4>{{ label }}</h4>

        <p>{{ text }}</p>

        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    label: string;
    text?: string;
}>();

</script>

<style lang="scss" scoped>

.group {
    padding: 12px;
    border-radius: 5px;
    background-color: var(--background-primary-alt);

    h4 {
        margin: 0;
        padding: 0;
    }

    p {
        margin: 8px 0;
        color: var(--text-secondary);
        font-size: 14px;
    }
}

</style>