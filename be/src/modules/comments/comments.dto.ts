import {Type} from "class-transformer";
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from "class-validator";

import {PaginatedResponseDto} from "@/shared/dto/paginated-response.dto";

import {UserResponseDto} from "../users/dto/user-response.dto";
import {EntityCommentType} from "./comments.entity";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsOptional()
    @IsUUID()
    parentId?: string;

    @IsString()
    @IsUUID()
    entityId!: string;

    @IsEnum(["todo", "article"] as const)
    entityType!: EntityCommentType;
}

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    content!: string;
}

export class CommentResponseDto {
    id!: string;
    content!: string;
    entityType!: EntityCommentType;
    entityId!: string;
    parentId!: string | null;
    depth!: number;
    likesCount!: number;
    author!: UserResponseDto;
    createdAt!: string;
    updatedAt!: string;
}

export class QueryCommentsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 100;

    @IsOptional()
    @IsEnum(["ASC", "DESC"] as const)
    order?: "ASC" | "DESC" = "ASC";
}

export class ResponseGetComments extends PaginatedResponseDto<CommentResponseDto> {}
