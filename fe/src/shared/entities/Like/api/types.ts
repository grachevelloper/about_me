export type EntityLikeType = 'article' | 'comment' | 'todo';

export interface ToggleLikeData {
    entityId: string;
    entityType: EntityLikeType;
    hasLiked: boolean;
}

export interface LikesApi {
    createLike: (entityType: EntityLikeType, entityId: string) => Promise<void>;
    deleteLike: (entityType: EntityLikeType, entityId: string) => Promise<void>;
}
