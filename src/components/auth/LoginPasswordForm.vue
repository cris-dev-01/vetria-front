<script lang="ts" setup>
    import FormField from '@/components/commons/FormField.vue';
    import IconMail from '@/components/icon/icon-mail.vue';
    import IconLockDots from '@/components/icon/icon-lock-dots.vue';

    const email = defineModel<string>('email', { required: true });
    const password = defineModel<string>('password', { required: true });

    defineProps<{ loading?: boolean; error?: string; errors?: Record<string, string> }>();

    const emit = defineEmits<{ submit: [] }>();
</script>

<template>
    <form class="space-y-5 dark:text-white" novalidate @submit.prevent="emit('submit')">
        <form-field id="email" label="Correo electrónico" :error="errors?.email">
            <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="username"
                placeholder="Ingresa tu correo"
                :aria-invalid="!!errors?.email"
                class="form-input ps-10 placeholder:text-white-dark"
            />
            <template #icon><icon-mail :fill="true" /></template>
        </form-field>
        <form-field id="password" label="Contraseña" :error="errors?.password">
            <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="Ingresa tu contraseña"
                :aria-invalid="!!errors?.password"
                class="form-input ps-10 placeholder:text-white-dark"
            />
            <template #icon><icon-lock-dots :fill="true" /></template>
        </form-field>
        <p v-if="error" class="text-sm text-danger" role="alert">{{ error }}</p>
        <button type="submit" :disabled="loading" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
    </form>
</template>
