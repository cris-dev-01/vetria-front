<script lang="ts" setup>
    import FormField from '@/components/commons/FormField.vue';
    import IconMail from '@/components/icon/icon-mail.vue';

    const email = defineModel<string>('email', { required: true });

    defineProps<{ sent?: boolean; message?: string; loading?: boolean; error?: string; errors?: Record<string, string> }>();

    const emit = defineEmits<{ submit: []; reset: [] }>();
</script>

<template>
    <div v-if="sent" class="space-y-5 dark:text-white">
        <p class="rounded-md border border-success/40 bg-success-light p-4 text-sm text-success">
            {{ message }}
        </p>
        <button type="button" class="btn btn-outline-primary w-full uppercase" @click="emit('reset')">Usar otro correo</button>
    </div>
    <form v-else class="space-y-5 dark:text-white" novalidate @submit.prevent="emit('submit')">
        <form-field id="link-email" label="Correo electrónico" :error="errors?.email">
            <input
                id="link-email"
                v-model="email"
                type="email"
                autocomplete="username"
                placeholder="Ingresa tu correo"
                :aria-invalid="!!errors?.email"
                class="form-input ps-10 placeholder:text-white-dark"
            />
            <template #icon><icon-mail :fill="true" /></template>
        </form-field>
        <p v-if="error" class="text-sm text-danger" role="alert">{{ error }}</p>
        <button type="submit" :disabled="loading" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
            {{ loading ? 'Enviando...' : 'Enviar link de acceso' }}
        </button>
    </form>
</template>
