import { defineStore } from 'pinia';
import appSetting from '@/app-setting';

export type MainLayout = 'app' | 'auth';

export const useAppStore = defineStore('app', {
    state: () => ({
        isDarkMode: false,
        mainLayout: 'app' as MainLayout,
        theme: 'light',
        menu: 'vertical',
        layout: 'full',
        rtlClass: 'ltr',
        animation: '',
        navbar: 'navbar-sticky',
        sidebar: false,
        isShowMainLoader: true,
        semidark: false,
    }),

    actions: {
        setMainLayout(payload: MainLayout = 'app') {
            this.mainLayout = payload;
        },
        toggleTheme(payload: string | null = null) {
            payload = payload || this.theme; // light|dark|system
            localStorage.setItem('theme', payload);
            this.theme = payload;
            if (payload === 'light') {
                this.isDarkMode = false;
            } else if (payload === 'dark') {
                this.isDarkMode = true;
            } else if (payload === 'system') {
                this.isDarkMode = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
            }

            if (this.isDarkMode) {
                document.querySelector('body')?.classList.add('dark');
            } else {
                document.querySelector('body')?.classList.remove('dark');
            }
        },
        toggleMenu(payload: string | null = null) {
            payload = payload || this.menu; // vertical, collapsible-vertical
            this.sidebar = false; // reset sidebar state
            localStorage.setItem('menu', payload);
            this.menu = payload;
        },
        toggleLayout(payload: string | null = null) {
            payload = payload || this.layout; // full, boxed-layout
            localStorage.setItem('layout', payload);
            this.layout = payload;
        },
        toggleRTL(payload: string | null = null) {
            payload = payload || this.rtlClass; // rtl, ltr
            localStorage.setItem('rtlClass', payload);
            this.rtlClass = payload;
            document.querySelector('html')?.setAttribute('dir', this.rtlClass || 'ltr');
        },
        toggleAnimation(payload: string | null = null) {
            payload = (payload || this.animation).trim();
            localStorage.setItem('animation', payload);
            this.animation = payload;
            appSetting.changeAnimation();
        },
        toggleNavbar(payload: string | null = null) {
            payload = payload || this.navbar; // navbar-sticky, navbar-floating, navbar-static
            localStorage.setItem('navbar', payload);
            this.navbar = payload;
        },
        toggleSemidark(payload: boolean = false) {
            localStorage.setItem('semidark', String(payload));
            this.semidark = payload;
        },
        toggleSidebar() {
            this.sidebar = !this.sidebar;
        },
        toggleMainLoader() {
            this.isShowMainLoader = true;
            setTimeout(() => {
                this.isShowMainLoader = false;
            }, 500);
        },
    },
});
