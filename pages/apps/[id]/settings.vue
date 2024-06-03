<template>
    <div class="settings">
        settings
    </div>
</template>

<script lang="ts" setup>

import type { Application } from '~/types/api/application';


const props = defineProps<{
    app: Application;
}>();


definePageMeta({
    appItem: {
        name: 'settings',
        icon: 'settings'
    }
});

</script>

<style lang="scss" scoped>

.block.settings {}

</style>