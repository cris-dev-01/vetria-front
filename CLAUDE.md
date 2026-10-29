# CLAUDE.md

Este archivo guía a Claude Code (claude.ai/code) al trabajar en este repositorio.

## Comportamiento

- Comunicarse siempre en español neutro.
- Los textos visibles para el usuario final (labels, mensajes, títulos) también van en español.

## Comandos

- `npm install` — instalar dependencias
- `npm run dev` — servidor de desarrollo (Vite)
- `npm run build` — type-check + build de producción
- `npm run type-check` — verificación de tipos con `vue-tsc`
- `npm run lint` — oxlint + eslint (con `--fix`)
- `npm run format` — prettier sobre `src/`
- `npm run test:unit` — tests con Vitest (usar `npx vitest run` para una sola ejecución, o `npx vitest run ruta/archivo.spec.ts` para un archivo)

Requiere Node `^22.18.0 || >=24.12.0`.

## Stack

Vue 3 (Composition API) + TypeScript, Vite, Pinia, Vue Router, Tailwind CSS 3 (`@tailwindcss/forms`, `@tailwindcss/typography`), `@vueuse/head`. Este front consume la API Laravel del repositorio hermano `vetria-api`.

## Convenciones de archivos `.vue`

- **Orden de bloques:** `<script lang="ts" setup>` va **siempre primero**, luego `<template>` y, si existe, `<style>` al final.
- Usar siempre `<script setup lang="ts">` (Composition API); no usar Options API.
- Alias `@/` apunta a `src/`; usar siempre imports con alias, no rutas relativas profundas.
- Estilos: clases utilitarias de Tailwind en el template. Evitar `<style>` salvo que sea realmente necesario.
- Formato: Prettier (4 espacios, comillas simples, `printWidth` 160, punto y coma, contenido de `<script>` indentado). Ejecutar `npm run format` y `npm run lint` antes de dar una tarea por terminada.

```vue
<script lang="ts" setup>
    import { ref } from 'vue';
    import LoginPasswordForm from '@/components/auth/LoginPasswordForm.vue';

    const email = ref('');
</script>

<template>
    <login-password-form v-model:email="email" />
</template>
```

## Arquitectura: componentes atómicos

Las vistas **no contienen lógica de UI ni marcado complejo propio**: son composiciones de componentes de distintos niveles. Al crear funcionalidad nueva, descomponer en componentes pequeños y reutilizables en lugar de escribir todo en la vista.

Niveles (de menor a mayor):

1. **Átomos** — elementos mínimos sin lógica de negocio: botones, inputs, labels, badges, iconos.
2. **Moléculas** — combinación de átomos con una sola responsabilidad: campo de formulario (label + input + error), item de menú, tarjeta simple.
3. **Organismos** — secciones completas con estado propio o lógica de interacción: formularios (`LoginPasswordForm`), tablas, header, sidebar.
4. **Vistas** (`src/views`) — ensamblan organismos/moléculas, definen el título (`useMeta`), manejan navegación y coordinan datos. Una vista no debería repetir marcado que pueda ser un componente.

Reglas:

- Un componente = una responsabilidad. Si un bloque de template se repite o supera lo razonable, extraerlo.
- Los componentes se comunican con `props` hacia abajo y `emit` / `defineModel` hacia arriba; no acceder al store de un átomo.
- Los átomos y moléculas son genéricos (sin conocimiento del dominio); el conocimiento del dominio vive en organismos y vistas.
- Reutilizar componentes existentes antes de crear uno nuevo: revisar `src/components/` primero.

## Estructura de carpetas

```
src/
  views/          Vistas (una por ruta), agrupadas por módulo: views/auth/LoginView.vue
  layouts/        Layouts de página (app-layout, auth-layout), elegidos vía meta.layout de la ruta
  components/
    icon/         Iconos SVG (icon-*.vue)
    layout/       Piezas del layout (AppHeader, AppSidebar, ...)
    <módulo>/     Componentes de dominio por módulo (auth/, ...)
  composables/    Lógica reutilizable `use-*.ts`
  stores/         Stores de Pinia
  router/         Definición de rutas (vistas con lazy import)
  assets/css/     Estilos globales
```

- Las rutas cargan las vistas con import dinámico (`component: () => import(...)`) y declaran el layout en `meta: { layout: 'auth' }`.
- Los componentes se usan en el template en kebab-case (`<login-password-form />`) y se importan en PascalCase.
- Nombres: vistas `XxxView.vue`; componentes en PascalCase; iconos y layouts existentes en kebab-case (`icon-mail.vue`, `app-layout.vue`) — seguir la convención de la carpeta donde se agrega el archivo.

## Estado y datos

- Estado global con Pinia (`src/stores`). Mantener el estado local en el componente cuando no se comparte.
- La lógica reutilizable se extrae a composables (`src/composables/use-*.ts`).
- Cada vista llama a `useMeta('Título')` para fijar el título de la página.

## Tests

Tests unitarios con Vitest + `@vue/test-utils` en `src/__tests__/` o junto al componente como `*.spec.ts`.
