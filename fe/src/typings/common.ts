export interface Tokens {
    refreshToken: string;
    accessToken: string;
}

export interface BaseEntity {
    createdAt?: Date;
    updatedAt?: Date;
    id: string;
}

export interface LikedEntity extends BaseEntity {
    hasLiked: boolean;
}

export enum Role {
    ADMIN = 'Admin',
    WRITER = 'Writer',
    USER = 'User',
}
