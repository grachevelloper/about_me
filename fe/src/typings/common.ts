import EventEmitter from 'eventemitter3';

type Events = 'on' | 'once' | 'off' | 'emit';

export type AppEmitter = Pick<EventEmitter, Events>;

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
    ADMIN = 'admin',
    WRITER = 'writer',
    USER = 'user',
}
