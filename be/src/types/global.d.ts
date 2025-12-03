import {Role} from ".";

declare global {
    type Nullable<T> = T | null;
    type Undefinable<T> = T | undefined;

    type PartialFields<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

    namespace Express {
        interface Request {
            user: AuthUser;
        }
    }
}

interface AuthUser {
    id: string;
    role: Role;
    iat: number;
    exp: number;
}

export {};
