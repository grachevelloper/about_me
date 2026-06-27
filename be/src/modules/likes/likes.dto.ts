import {IsEnum} from "class-validator";

import {EntityLikeType} from "./likes.entity";

export const LIKE_TARGET_TYPES: Record<EntityLikeType, EntityLikeType> = {
    article: "article",
    comment: "comment",
    todo: "todo",
};

export class LikeTargetParamsDto {
    @IsEnum(LIKE_TARGET_TYPES)
    entityType!: EntityLikeType;
}

export class CreateLikeDto extends LikeTargetParamsDto {}

export class DeleteLikeDto extends LikeTargetParamsDto {}
