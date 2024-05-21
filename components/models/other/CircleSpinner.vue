<template>
    <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"
        :style="{ width: size, height: size }"
    >
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
</template>

<script lang="ts" setup>

const props = defineProps({
    size: { type: String, default: '32px' }
});

</script>

<style lang="scss" scoped>

$offset: 187;
$duration: 1.4s;

.spinner {
    animation: Rotator $duration linear infinite;

    .path {
        stroke: var(--color-2);
        stroke-dasharray: $offset;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: Dash $duration ease-in-out infinite;
    }

    @keyframes Rotator {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(270deg);
        }
    }

    @keyframes Dash {
        0% {
            stroke-dashoffset: $offset;
        }
        50% {
            stroke-dashoffset: calc($offset / 4);
            transform: rotate(135deg);
        }
        100% {
            stroke-dashoffset: $offset;
            transform: rotate(450deg);
        }
    }
}

</style>