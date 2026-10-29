import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import { fetchCsrfCookie } from '@/services/http';
import type { AuthUser, LoginPayload } from '@/types/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as AuthUser | null,
        // Se pone en true tras consultar la sesión al cargar la app (haya o no usuario).
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => state.user !== null,
    },

    actions: {
        async login(payload: LoginPayload) {
            await fetchCsrfCookie();
            this.user = await authService.login(payload);
        },
        // La API responde 202 sin importar si el correo existe, por eso solo se devuelve el mensaje.
        async requestLink(email: string) {
            return (await authService.requestLink(email)).message;
        },
        async verifyLink(token: string) {
            await fetchCsrfCookie();
            this.user = await authService.verifyLink(token);
        },
        // Consulta la sesión del navegador (cookie). Sin sesión válida el usuario queda en null.
        async fetchUser() {
            try {
                this.user = await authService.me();
            } catch {
                this.user = null;
            } finally {
                this.initialized = true;
            }
        },
        // Cierra la sesión en la API; el estado local se limpia aunque la petición falle.
        async logout() {
            try {
                await authService.logout();
            } finally {
                this.clearSession();
            }
        },
        clearSession() {
            this.user = null;
        },
    },
});
