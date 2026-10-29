import { useHead } from '@vueuse/head';

const siteTitle = 'Vetria';

export const useMeta = (title: string) => {
    return useHead({ title: `${title} | ${siteTitle}` });
};
