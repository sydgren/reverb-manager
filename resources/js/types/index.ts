export interface Auth {
    user: User | null;
}

export interface SharedData {
    name: string;
    auth: Auth;
    flash?: { reveal_secret?: string | null };
    [key: string]: unknown;
}

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}
