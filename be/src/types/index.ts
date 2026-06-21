export enum Order {
    DESC = "DESC",
    ASC = "ASC",
}

export enum SortBy {
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
}

export enum Role {
    ADMIN = "Admin",
    WRITER = "Writer",
    USER = "User",
}

export interface AuthenticatedUser {
    id: string;
    role: Role;
    iat: number;
    exp: number;
}
