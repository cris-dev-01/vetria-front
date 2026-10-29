<script lang="ts" setup>
    import { onMounted } from 'vue';
    import ScreenLoader from '@/components/layout/ScreenLoader.vue';
    import ScrollTopButton from '@/components/layout/ScrollTopButton.vue';
    import { useAppStore } from '@/stores/app';

    const store = useAppStore();

    onMounted(() => store.toggleMainLoader());
</script>

<template>
    <div class="text-black dark:text-white-dark">
        <screen-loader />
        <scroll-top-button />
        <router-view></router-view>
    </div>
</template>
