<script lang="ts" setup>
    import { computed } from 'vue';
    import appLayout from '@/layouts/app-layout.vue';
    import authLayout from '@/layouts/auth-layout.vue';
    import AppNotifications from '@/components/commons/AppNotifications.vue';
    import { useAppStore } from '@/stores/app';

    const store = useAppStore();

    const mainLayout = computed(() => (store.mainLayout === 'auth' ? authLayout : appLayout));
</script>

<template>
    <div
        class="main-section antialiased relative font-manrope text-sm font-normal"
        :class="[store.sidebar ? 'toggle-sidebar' : '', store.menu, store.layout, store.rtlClass]"
    >
        <component :is="mainLayout"></component>
        <app-notifications />
    </div>
</template>
