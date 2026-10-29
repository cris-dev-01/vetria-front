<script lang="ts" setup>
    // Molécula: label + campo (slot por defecto) + ícono opcional + mensaje de error.
    // Con `error`, el contenedor recibe `has-error` (estilo de Vristo) y el mensaje se muestra bajo el campo.
    defineProps<{ id: string; label: string; error?: string }>();
</script>

<template>
    <div :class="{ 'has-error': error }">
        <label :for="id">{{ label }}</label>
        <div class="relative text-white-dark">
            <slot />
            <span v-if="$slots.icon" class="form-icon absolute start-4 top-1/2 -translate-y-1/2">
                <slot name="icon" />
            </span>
        </div>
        <small v-if="error" class="mt-1 block text-danger" role="alert">{{ error }}</small>
    </div>
</template>
