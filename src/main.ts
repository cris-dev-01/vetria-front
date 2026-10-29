import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';

import App from '@/App.vue';
import router from '@/router';
import appSetting from '@/app-setting';

import '@/assets/css/app.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(createHead());

// aplica la configuración guardada del tema (requiere pinia instalado)
appSetting.init();

app.mount('#app');
