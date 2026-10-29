const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/+$/, '');

// `/sanctum/csrf-cookie` vive en la raíz del dominio de la API, no bajo `/api`.
const csrfCookieUrl = `${new URL(baseUrl).origin}/sanctum/csrf-cookie`;

const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Los mensajes de estas respuestas de Laravel vienen en inglés; se reemplazan por textos para el usuario.
const STATUS_MESSAGES: Record<number, string> = {
    403: 'No tienes permisos para realizar esta acción.',
    419: 'Tu sesión de seguridad expiró. Recarga la página e inténtalo nuevamente.',
    429: 'Demasiados intentos. Espera un momento e inténtalo nuevamente.',
};
const SERVER_ERROR_MESSAGE = 'Ocurrió un error inesperado. Inténtalo más tarde.';

/** Error de la API. `errors` trae los mensajes por campo cuando es una validación (422). */
export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly errors: Record<string, string[]> = {},
    ) {
        super(message);
        this.name = 'ApiError';
    }

    /** Primer mensaje de validación de un campo, si existe. */
    first(field: string): string | undefined {
        return this.errors[field]?.[0];
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    query?: Record<string, string | number | boolean | null | undefined>;
}

// Un 401 en una petición autenticada significa que la sesión expiró o fue cerrada: quien registre el handler decide qué hacer.
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void): void => {
    onUnauthorized = handler;
};

const readXsrfToken = (): string | null => {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : null;
};

/** Pide a la API la cookie XSRF-TOKEN que debe reenviarse en el header X-XSRF-TOKEN de las peticiones mutantes. */
export const fetchCsrfCookie = async (): Promise<void> => {
    try {
        await fetch(csrfCookieUrl, { credentials: 'include', headers: { Accept: 'application/json' } });
    } catch {
        throw new ApiError('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.', 0);
    }
};

async function send(path: string, { method = 'GET', body, query }: RequestOptions): Promise<Response> {
    const url = new URL(`${baseUrl}${path}`);
    Object.entries(query ?? {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined) url.searchParams.set(key, String(value));
    });

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    if (MUTATING_METHODS.includes(method)) {
        if (!readXsrfToken()) await fetchCsrfCookie();

        const xsrf = readXsrfToken();
        if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;
    }

    try {
        return await fetch(url, { method, headers, credentials: 'include', body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
        throw new ApiError('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.', 0);
    }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    let response = await send(path, options);

    // 419: el token CSRF caducó o no existía. Se renueva la cookie y se reintenta una sola vez.
    if (response.status === 419) {
        await fetchCsrfCookie();
        response = await send(path, options);
    }

    const payload = response.status === 204 ? null : await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 401) onUnauthorized?.();

        const message =
            response.status === 422
                ? payload?.message
                : (STATUS_MESSAGES[response.status] ?? (response.status >= 500 ? SERVER_ERROR_MESSAGE : payload?.message));

        throw new ApiError(message ?? SERVER_ERROR_MESSAGE, response.status, payload?.errors ?? {});
    }

    return payload as T;
}

export const http = {
    get: <T>(path: string, query?: RequestOptions['query']) => request<T>(path, { query }),
    post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
    put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
    patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
