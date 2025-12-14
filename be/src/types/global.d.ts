import {Role} from ".";

declare global {
    type Nullable<T> = T | null;
    type Undefinable<T> = T | undefined;

    type PartialFields<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

    namespace Express {
        interface Request {
            user: AuthUser;
        }
        namespace Multer {
            interface File {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            }
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
