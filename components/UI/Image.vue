<template>
    <img class="ui-image" v-if="stage === 'ready'"
        :src="src"
        :alt="alt"
    >

    <Skeleton v-else-if="stage === 'load'"/>
</template>

<script lang="ts" setup>

const props = defineProps<{
    src: string;
    alt?: string;
}>();


const stage = ref<'ready' | 'error' | 'load'>('load');


watch(() => props.src, () => {
    renderImage();
});


function renderImage() {
    stage.value = 'load';

    const img = new Image();

    img.src = props.src;

    img.onload = () => {
        stage.value = 'ready';
    }

    img.onerror = () => {
        stage.value = 'error';
    }
}


onMounted(() => {
    renderImage();
})

</script>

<style lang="scss" scoped>

.load-enter-active,
.load-leave-active {
    opacity: 0;
}

img.ui-image,
.ui-skeleton {
    width: 24px;
    height: 24px;
}

</style>