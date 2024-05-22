<template>
    <i :class="`ui-icon ti-${name} ${name}`"></i>
</template>

<script lang="ts" setup>

defineProps<{
    name: string;
}>();

</script>