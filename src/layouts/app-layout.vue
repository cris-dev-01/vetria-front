<script lang="ts" setup>
    import { onMounted } from 'vue';
    import AppSidebar from '@/components/layout/AppSidebar.vue';
    import AppHeader from '@/components/layout/AppHeader.vue';
    import AppFooter from '@/components/layout/AppFooter.vue';
    import ScreenLoader from '@/components/layout/ScreenLoader.vue';
    import ScrollTopButton from '@/components/layout/ScrollTopButton.vue';
    import appSetting from '@/app-setting';
    import { useAppStore } from '@/stores/app';

    const store = useAppStore();

    onMounted(() => {
        document.querySelector('.animation')?.addEventListener('animationend', () => appSetting.changeAnimation('remove'));
        store.toggleMainLoader();
    });
</script>

<template>
    <div class="relative">
        <!-- overlay del menú lateral (móvil) -->
        <div class="fixed inset-0 bg-[black]/60 z-50 lg:hidden" :class="{ hidden: !store.sidebar }" @click="store.toggleSidebar()"></div>

        <screen-loader />
        <scroll-top-button />

        <div class="main-container text-black dark:text-white-dark min-h-screen" :class="[store.navbar]">
            <app-sidebar />

            <div class="main-content flex flex-col min-h-screen">
                <app-header />

                <div class="p-6 animation">
                    <router-view></router-view>
                </div>

                <app-footer />
            </div>
        </div>
    </div>
</template>
