import {IsEnum, IsOptional, IsString, IsUUID} from "class-validator";

import {EntityCommentType} from "./comments.entity";

export class CreateCommentDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsUUID()
    parentId?: string;

    @IsString()
    @IsUUID()
    entityId: string;

    @IsEnum(["todo", "article"])
    entityType: EntityCommentType;
}

export class UpdateCommentDto {
    @IsUUID()
    id: string;
    @IsString()
    contents: string;
}
