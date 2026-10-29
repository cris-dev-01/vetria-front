<script lang="ts" setup>
    import { computed } from 'vue';
    import { useAppStore } from '@/stores/app';
    import IconSun from '@/components/icon/icon-sun.vue';
    import IconMoon from '@/components/icon/icon-moon.vue';
    import IconLaptop from '@/components/icon/icon-laptop.vue';

    const store = useAppStore();

    const next = { light: 'dark', dark: 'system', system: 'light' } as const;
    const labels = { light: 'Tema claro', dark: 'Tema oscuro', system: 'Tema del sistema' } as const;

    const current = computed(() => (store.theme in next ? (store.theme as keyof typeof next) : 'light'));
    const label = computed(() => `${labels[current.value]}. Clic para cambiar a: ${labels[next[current.value]].toLowerCase()}`);
</script>

<template>
    <button
        type="button"
        class="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary"
        :title="label"
        :aria-label="label"
        @click="store.toggleTheme(next[current])"
    >
        <icon-sun v-if="current === 'light'" />
        <icon-moon v-else-if="current === 'dark'" />
        <icon-laptop v-else />
    </button>
</template>
