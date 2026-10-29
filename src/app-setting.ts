import { $themeConfig } from '@/theme.config';
import { useAppStore } from '@/stores/app';

export default {
    init() {
        const store = useAppStore();

        store.toggleTheme(localStorage.getItem('theme') || $themeConfig.theme);
        store.toggleMenu(localStorage.getItem('menu') || $themeConfig.menu);
        store.toggleLayout(localStorage.getItem('layout') || $themeConfig.layout);
        store.toggleRTL(localStorage.getItem('rtlClass') || $themeConfig.rtlClass);
        store.toggleAnimation(localStorage.getItem('animation') || $themeConfig.animation);
        store.toggleNavbar(localStorage.getItem('navbar') || $themeConfig.navbar);
        store.toggleSemidark(localStorage.getItem('semidark') === 'true' ? true : $themeConfig.semidark);
    },

    changeAnimation(type = 'add') {
        const store = useAppStore();
        if (store.animation) {
            const eleanimation = document.querySelector('.animation');
            if (type === 'add') {
                eleanimation?.classList.add('animate__animated');
                eleanimation?.classList.add(store.animation);
            } else {
                eleanimation?.classList.remove('animate__animated');
                eleanimation?.classList.remove(store.animation);
            }
        }
    },
};
