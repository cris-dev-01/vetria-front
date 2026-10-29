export interface AuthUser {
    id: string;
    name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    last_logged_in_at: string | null;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface MessageResponse {
    message: string;
}
