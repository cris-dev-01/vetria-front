<script lang="ts" setup>
    import { computed, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useMeta } from '@/composables/use-meta';
    import { useNotify } from '@/composables/use-notify';
    import { ApiError } from '@/services/http';
    import { useAuthStore } from '@/stores/auth';

    import LoginPasswordForm from '@/components/auth/LoginPasswordForm.vue';
    import LoginLinkForm from '@/components/auth/LoginLinkForm.vue';
    import ThemeToggle from '@/components/auth/ThemeToggle.vue';

    useMeta('Iniciar sesión');

    type FormField = 'email' | 'password';

    const FORM_FIELDS: FormField[] = ['email', 'password'];
    const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

    const router = useRouter();
    const auth = useAuthStore();
    const notify = useNotify();
    const email = ref('');
    const password = ref('');
    const mode = ref<'password' | 'link'>('password');
    const loading = ref(false);
    const error = ref('');
    const fieldErrors = ref<Record<string, string>>({});
    const linkSent = ref(false);
    const linkMessage = ref('');

    const subtitle = computed(() =>
        mode.value === 'password' ? 'Ingresa tu correo y contraseña para continuar' : 'Ingresa tu correo y te enviaremos un link de acceso',
    );

    const toggleMode = () => {
        mode.value = mode.value === 'password' ? 'link' : 'password';
        password.value = '';
        error.value = '';
        fieldErrors.value = {};
    };

    // El error de un campo desaparece apenas el usuario lo edita.
    watch(email, () => delete fieldErrors.value.email);
    watch(password, () => delete fieldErrors.value.password);

    // Validación previa en el cliente: campos obligatorios y formato del correo.
    const validate = (fields: FormField[]): boolean => {
        const errors: Record<string, string> = {};

        if (fields.includes('email')) {
            if (!email.value.trim()) errors.email = 'El correo electrónico es obligatorio.';
            else if (!EMAIL_PATTERN.test(email.value.trim())) errors.email = 'Ingresa un correo electrónico válido.';
        }
        if (fields.includes('password') && !password.value) errors.password = 'La contraseña es obligatoria.';

        fieldErrors.value = errors;

        return Object.keys(errors).length === 0;
    };

    // Ejecuta una acción de auth manejando loading y errores. Un 422 se muestra bajo el campo que corresponda (o bajo el formulario si no es de un
    // campo); el resto de los errores, como notificación.
    const run = async (action: () => Promise<void>) => {
        loading.value = true;
        error.value = '';
        fieldErrors.value = {};
        try {
            await action();
        } catch (e) {
            if (e instanceof ApiError && e.status === 422) {
                const fromServer = Object.fromEntries(FORM_FIELDS.filter((field) => e.first(field)).map((field) => [field, e.first(field) as string]));

                if (Object.keys(fromServer).length) fieldErrors.value = fromServer;
                else error.value = Object.values(e.errors)[0]?.[0] ?? e.message;
            } else {
                notify.error(e instanceof ApiError ? e.message : 'Ocurrió un error inesperado.');
            }
        } finally {
            loading.value = false;
        }
    };

    const onLogin = () => {
        if (!validate(['email', 'password'])) return;

        return run(async () => {
            await auth.login({ email: email.value, password: password.value });
            await router.push({ name: 'home' });
        });
    };

    const onRequestLink = () => {
        if (!validate(['email'])) return;

        return run(async () => {
            linkMessage.value = await auth.requestLink(email.value);
            linkSent.value = true;
        });
    };
</script>

<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/bg-gradient.png" alt="" class="h-full w-full object-cover" />
        </div>

        <div
            class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"
        >
            <img src="/assets/images/auth/coming-soon-object1.png" alt="" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
            <img src="/assets/images/auth/coming-soon-object2.png" alt="" class="absolute left-24 top-0 h-40 md:left-[30%]" />
            <img src="/assets/images/auth/coming-soon-object3.png" alt="" class="absolute right-0 top-0 h-[300px]" />
            <img src="/assets/images/auth/polygon-object.svg" alt="" class="absolute bottom-0 end-[28%]" />
            <div
                class="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]"
            >
                <div class="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[600px] py-20">
                    <div class="absolute end-4 top-4">
                        <theme-toggle />
                    </div>
                    <div class="mx-auto w-full max-w-[440px]">
                        <div class="mb-10">
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Iniciar sesión</h1>
                            <p class="text-base leading-normal text-white-dark">{{ subtitle }}</p>
                        </div>
                        <login-password-form
                            v-if="mode === 'password'"
                            v-model:email="email"
                            v-model:password="password"
                            :loading="loading"
                            :error="error"
                            :errors="fieldErrors"
                            @submit="onLogin"
                        />
                        <login-link-form
                            v-else
                            v-model:email="email"
                            :sent="linkSent"
                            :message="linkMessage"
                            :loading="loading"
                            :error="error"
                            :errors="fieldErrors"
                            @submit="onRequestLink"
                            @reset="linkSent = false"
                        />

                        <div class="relative my-7 text-center">
                            <span class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white-dark/30"></span>
                            <span class="relative bg-transparent px-3 text-sm font-bold dark:text-white">o</span>
                        </div>
                        <div class="text-center">
                            <button type="button" class="text-sm font-semibold text-primary hover:underline" @click="toggleMode">
                                {{ mode === 'password' ? 'Iniciar sesión con un link' : 'Iniciar sesión con correo y contraseña' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
