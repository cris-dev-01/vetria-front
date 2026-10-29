import { ref } from 'vue';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    type: NotificationType;
    message: string;
}

// Cola compartida: quien notifica solo encola; `AppNotifications` (montado una vez en App.vue) las muestra.
export const pending = ref<Notification[]>([]);

const push = (type: NotificationType) => (message: string) => {
    pending.value.push({ type, message });
};

export const useNotify = () => ({
    success: push('success'),
    error: push('error'),
    warning: push('warning'),
    info: push('info'),
});
