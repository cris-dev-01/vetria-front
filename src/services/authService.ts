import { http } from '@/services/http';
import type { AuthUser, LoginPayload, MessageResponse } from '@/types/auth';

// El usuario viene en un API Resource de Laravel, que envuelve el contenido en `data`.
interface Wrapped<T> {
    data: T;
}

const unwrap = async <T>(response: Promise<Wrapped<T>>): Promise<T> => (await response).data;

export const authService = {
    login: (payload: LoginPayload) => unwrap(http.post<Wrapped<AuthUser>>('/login', payload)),

    requestLink: (email: string) => http.post<MessageResponse>('/auth/link', { email }),

    verifyLink: (token: string) => unwrap(http.post<Wrapped<AuthUser>>('/auth/link/verify', { token })),

    me: () => unwrap(http.get<Wrapped<AuthUser>>('/user')),

    logout: () => http.post<null>('/logout'),
};
