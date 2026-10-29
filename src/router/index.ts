import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { setUnauthorizedHandler } from '@/services/http';
import { useNotify } from '@/composables/use-notify';
import type { MainLayout } from '@/stores/app';
import appSetting from '@/app-setting';

declare module 'vue-router' {
    interface RouteMeta {
        layout?: MainLayout;
        guest?: boolean;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/DashboardView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { layout: 'auth', guest: true },
    },
    {
        path: '/auth/link',
        name: 'auth-link',
        component: () => import('@/views/auth/VerifyLinkView.vue'),
        meta: { layout: 'auth', guest: true },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkExactActiveClass: 'active',
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        return savedPosition ?? { left: 0, top: 0 };
    },
});

router.beforeEach(async (to) => {
    useAppStore().setMainLayout(to.meta.layout ?? 'app');

    const auth = useAuthStore();

    // La sesión vive en una cookie HttpOnly que el front no puede leer: al cargar la app se consulta a la API una sola vez.
    if (!auth.initialized) await auth.fetchUser();

    // Rutas no marcadas como `guest` exigen sesión; `/auth/link` debe poder abrirse aun con una sesión previa.
    if (!to.meta.guest && !auth.isAuthenticated) return { name: 'login' };
    if (to.name === 'login' && auth.isAuthenticated) return { name: 'home' };
});

// Un 401 con sesión iniciada: la sesión expiró o fue cerrada en otro lado. Sin sesión previa (p. ej. la consulta inicial) no se avisa.
setUnauthorizedHandler(() => {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) return;

    auth.clearSession();
    useNotify().warning('Tu sesión expiró. Inicia sesión nuevamente.');
    router.push({ name: 'login' });
});

router.afterEach(() => {
    appSetting.changeAnimation();
});

export default router;
