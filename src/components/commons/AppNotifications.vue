<script lang="ts" setup>
    import { watch } from 'vue';
    import Swal from 'sweetalert2';
    import { pending } from '@/composables/use-notify';
    import type { NotificationType } from '@/composables/use-notify';

    // Los colores `color-*` están definidos en assets/css/tailwind.css (sección swal2).
    const colors: Record<NotificationType, string> = {
        success: 'color-success',
        error: 'color-danger',
        warning: 'color-warning',
        info: 'color-info',
    };

    const toast = Swal.mixin({
        toast: true,
        position: 'bottom',
        width: 'min(100%, 48rem)',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 7000,
        timerProgressBar: true,
        customClass: { container: 'toast' },
    });

    watch(
        pending,
        (queue) => {
            queue.splice(0).forEach(({ type, message }) => {
                toast.fire({
                    icon: type,
                    title: message,
                    padding: '10px 20px',
                    customClass: { container: 'toast', popup: colors[type], title: '!row-[1/99] !self-center !text-[14px]' },
                });
            });
        },
        { deep: true },
    );
</script>

<template>
    <div hidden></div>
</template>
