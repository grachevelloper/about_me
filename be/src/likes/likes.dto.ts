import {IsEnum, IsUUID} from "class-validator";

import {EntityLikeType} from "./likes.entity";

export class CreateLikeDto {
    @IsUUID()
    authorId: string;

    @IsUUID()
    entityId: string;

    @IsEnum(["todo", "article", "comment"])
    entityType: EntityLikeType;
}

export class DeleteLikeDto extends CreateLikeDto {}
