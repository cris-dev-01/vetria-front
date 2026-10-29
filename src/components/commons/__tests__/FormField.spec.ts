import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FormField from '@/components/commons/FormField.vue';

const mountField = (error?: string) =>
    mount(FormField, {
        props: { id: 'email', label: 'Correo electrónico', error },
        slots: { default: '<input id="email" class="form-input" />', icon: '<i class="icono" />' },
    });

describe('FormField', () => {
    it('sin error no marca el campo ni muestra mensaje', () => {
        const wrapper = mountField();

        expect(wrapper.classes()).not.toContain('has-error');
        expect(wrapper.find('small').exists()).toBe(false);
        expect(wrapper.find('label').attributes('for')).toBe('email');
        expect(wrapper.find('input').exists()).toBe(true);
        expect(wrapper.find('.icono').exists()).toBe(true);
    });

    it('con error agrega has-error y muestra el mensaje en un <small> bajo el campo', () => {
        const wrapper = mountField('El correo electrónico es obligatorio.');

        expect(wrapper.classes()).toContain('has-error');
        expect(wrapper.find('small').text()).toBe('El correo electrónico es obligatorio.');
        expect(wrapper.find('small').attributes('role')).toBe('alert');
    });
});
