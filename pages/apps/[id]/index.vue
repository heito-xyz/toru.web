<template>
    <div class="home">
        Home
    </div>
</template>

<script lang="ts" setup>

import type { Application } from '~/types/api/application';


const props = defineProps<{
    app: Application;
}>();


definePageMeta({
    appItem: {
        name: 'general',
        icon: 'user-circle'
    }
});

</script>

<style lang="scss" scoped>

.block.home {}

</style>