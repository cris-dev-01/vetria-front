<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useMeta } from '@/composables/use-meta';
    import { ApiError } from '@/services/http';
    import { useAuthStore } from '@/stores/auth';

    useMeta('Verificando acceso');

    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();
    const error = ref('');

    onMounted(async () => {
        const token = route.query.token;

        if (typeof token !== 'string' || token === '') {
            error.value = 'El link no es válido. Solicita uno nuevo.';
            return;
        }

        try {
            await auth.verifyLink(token);
            await router.replace({ name: 'home' });
        } catch (e) {
            error.value = e instanceof ApiError ? (e.first('token') ?? e.message) : 'Ocurrió un error inesperado.';
        }
    });
</script>

<template>
    <div class="flex min-h-screen items-center justify-center px-6">
        <div class="w-full max-w-[440px] text-center dark:text-white">
            <template v-if="error">
                <p class="rounded-md border border-danger/40 bg-danger-light p-4 text-sm text-danger" role="alert">{{ error }}</p>
                <router-link :to="{ name: 'login' }" class="btn btn-gradient mt-6 w-full border-0 uppercase">Volver a iniciar sesión</router-link>
            </template>
            <p v-else class="text-base">Verificando tu link de acceso...</p>
        </div>
    </div>
</template>
