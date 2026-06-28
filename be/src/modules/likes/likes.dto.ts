import {EntityLikeType} from "./likes.entity";

export const LIKE_TARGET_TYPES: Record<EntityLikeType, EntityLikeType> = {
    article: "article",
    comment: "comment",
    todo: "todo",
};
