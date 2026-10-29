import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useAppStore } from '@/stores/app';

describe('app store', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.classList.remove('dark');
        setActivePinia(createPinia());
    });

    it('activa el modo oscuro y lo persiste', () => {
        const store = useAppStore();

        store.toggleTheme('dark');

        expect(store.isDarkMode).toBe(true);
        expect(document.body.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('cambia el layout principal', () => {
        const store = useAppStore();

        store.setMainLayout('auth');

        expect(store.mainLayout).toBe('auth');
    });

    it('alterna el menú lateral', () => {
        const store = useAppStore();

        store.toggleSidebar();
        expect(store.sidebar).toBe(true);

        store.toggleSidebar();
        expect(store.sidebar).toBe(false);
    });
});
