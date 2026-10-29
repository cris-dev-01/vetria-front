import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, http, setUnauthorizedHandler } from '@/services/http';

const CSRF_URL = 'http://localhost:8000/sanctum/csrf-cookie';

const json = (status: number, body: unknown = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const clearXsrfCookie = () => {
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

describe('http', () => {
    const fetchMock = vi.fn<typeof fetch>();
    const headersOf = (call: number) => (fetchMock.mock.calls[call][1]?.headers ?? {}) as Record<string, string>;

    beforeEach(() => {
        clearXsrfCookie();
        fetchMock.mockReset();
        vi.stubGlobal('fetch', fetchMock);
        setUnauthorizedHandler(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    // Simula la respuesta de /sanctum/csrf-cookie, que deja la cookie en el navegador.
    const csrfResponse = (token: string) => {
        document.cookie = `XSRF-TOKEN=${encodeURIComponent(token)}; path=/`;

        return new Response(null, { status: 204 });
    };

    it('envía las peticiones GET con cookies y sin pedir la cookie CSRF', async () => {
        fetchMock.mockResolvedValueOnce(json(200, { data: 1 }));

        await http.get('/user');

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'GET', credentials: 'include' });
        expect(headersOf(0)['X-XSRF-TOKEN']).toBeUndefined();
    });

    it('pide la cookie CSRF antes de una petición mutante y reenvía su valor en X-XSRF-TOKEN', async () => {
        fetchMock.mockImplementationOnce(async () => csrfResponse('abc=')).mockResolvedValueOnce(json(200, { data: 1 }));

        await http.post('/login', { email: 'a@b.cl' });

        expect(fetchMock.mock.calls[0][0]).toBe(CSRF_URL);
        expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: 'POST', credentials: 'include' });
        expect(headersOf(1)['X-XSRF-TOKEN']).toBe('abc=');
    });

    it('no vuelve a pedir la cookie CSRF si ya existe', async () => {
        document.cookie = 'XSRF-TOKEN=existente; path=/';
        fetchMock.mockResolvedValueOnce(json(200));

        await http.post('/logout');

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(headersOf(0)['X-XSRF-TOKEN']).toBe('existente');
    });

    it('ante un 419 renueva la cookie CSRF y reintenta una sola vez', async () => {
        document.cookie = 'XSRF-TOKEN=vieja; path=/';
        fetchMock
            .mockResolvedValueOnce(json(419, { message: 'CSRF token mismatch.' }))
            .mockImplementationOnce(async () => csrfResponse('nueva'))
            .mockResolvedValueOnce(json(200, { data: 1 }));

        await expect(http.post('/login', {})).resolves.toEqual({ data: 1 });

        expect(fetchMock.mock.calls[1][0]).toBe(CSRF_URL);
        expect(headersOf(2)['X-XSRF-TOKEN']).toBe('nueva');
    });

    it('si el reintento también da 419 falla con un mensaje en español', async () => {
        document.cookie = 'XSRF-TOKEN=x; path=/';
        fetchMock.mockResolvedValue(json(419, { message: 'CSRF token mismatch.' }));

        const error = (await http.post('/login', {}).catch((e) => e)) as ApiError;

        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(419);
        expect(error.message).toMatch(/sesión de seguridad/);
    });

    it('expone los errores de validación (422) por campo', async () => {
        document.cookie = 'XSRF-TOKEN=x; path=/';
        fetchMock.mockResolvedValueOnce(json(422, { message: 'Inválido', errors: { email: ['Correo inválido'] } }));

        const error = (await http.post('/login', {}).catch((e) => e)) as ApiError;

        expect(error.status).toBe(422);
        expect(error.first('email')).toBe('Correo inválido');
    });

    it('avisa al handler cuando la API responde 401', async () => {
        const handler = vi.fn<() => void>();
        setUnauthorizedHandler(handler);
        fetchMock.mockResolvedValueOnce(json(401, { message: 'Unauthenticated.' }));

        await expect(http.get('/user')).rejects.toMatchObject({ status: 401 });

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('convierte una caída de red en un ApiError con status 0', async () => {
        fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

        await expect(http.get('/user')).rejects.toMatchObject({ status: 0 });
    });
});
