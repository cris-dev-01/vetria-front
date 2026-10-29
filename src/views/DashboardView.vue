<script lang="ts" setup>
    import { useMeta } from '@/composables/use-meta';

    useMeta('Dashboard');
</script>

<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <router-link to="/" class="text-primary hover:underline">Inicio</router-link>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Dashboard</span>
            </li>
        </ul>

        <div class="panel mt-6">
            <h5 class="text-lg font-semibold dark:text-white-light">Dashboard</h5>
            <p class="mt-2">Bienvenido a Vetria.</p>
        </div>
    </div>
</template>
