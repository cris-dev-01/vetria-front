<script lang="ts" setup>
    import Popper from 'vue3-popper';
    import { useAppStore } from '@/stores/app';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';
    import { useNotify } from '@/composables/use-notify';
    import { ApiError } from '@/services/http';

    import IconMenu from '@/components/icon/icon-menu.vue';
    import IconSun from '@/components/icon/icon-sun.vue';
    import IconMoon from '@/components/icon/icon-moon.vue';
    import IconLaptop from '@/components/icon/icon-laptop.vue';
    import IconLogout from '@/components/icon/icon-logout.vue';

    const store = useAppStore();
    const auth = useAuthStore();
    const router = useRouter();
    const notify = useNotify();

    const logout = async (close: () => void) => {
        close();

        try {
            await auth.logout();
        } catch (e) {
            // Un 401 ya lo maneja el cliente HTTP (aviso de sesión expirada); el resto se informa.
            if (e instanceof ApiError && e.status !== 401) notify.error(e.message);
        }

        await router.push({ name: 'login' });
    };
</script>

<template>
    <header class="z-40">
        <div class="shadow-sm">
            <div class="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-[#0e1726]">
                <div class="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                    <router-link to="/" class="main-logo flex items-center shrink-0">
                        <img class="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.svg" alt="" />
                        <span
                            class="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle hidden md:inline dark:text-white-light transition-all duration-300"
                            >Vetria</span
                        >
                    </router-link>

                    <a
                        href="javascript:;"
                        class="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                        @click="store.toggleSidebar()"
                    >
                        <icon-menu class="w-5 h-5" />
                    </a>
                </div>

                <div class="ltr:ml-auto rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                    <div>
                        <a
                            v-show="store.theme === 'light'"
                            href="javascript:;"
                            class="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('dark')"
                        >
                            <icon-sun />
                        </a>
                        <a
                            v-show="store.theme === 'dark'"
                            href="javascript:;"
                            class="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('system')"
                        >
                            <icon-moon />
                        </a>
                        <a
                            v-show="store.theme === 'system'"
                            href="javascript:;"
                            class="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('light')"
                        >
                            <icon-laptop />
                        </a>
                    </div>

                    <div class="dropdown shrink-0">
                        <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-end' : 'bottom-start'" offsetDistance="8" class="!block align-middle">
                            <button type="button" class="relative group block">
                                <img
                                    class="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                    src="/assets/images/user-profile.jpeg"
                                    alt=""
                                />
                            </button>
                            <template #content="{ close }">
                                <ul class="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                    <li>
                                        <div class="flex items-center px-4 py-4">
                                            <div class="flex-none">
                                                <img class="rounded-md w-10 h-10 object-cover" src="/assets/images/user-profile.jpeg" alt="" />
                                            </div>
                                            <div class="ltr:pl-4 rtl:pr-4 truncate">
                                                <h4 class="text-base">{{ auth.user ? `${auth.user.name} ${auth.user.last_name}` : 'Usuario' }}</h4>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="border-t border-white-light dark:border-white-light/10">
                                        <a href="javascript:;" class="text-danger !py-3" @click="logout(close)">
                                            <icon-logout class="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                                            Cerrar sesión
                                        </a>
                                    </li>
                                </ul>
                            </template>
                        </Popper>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
