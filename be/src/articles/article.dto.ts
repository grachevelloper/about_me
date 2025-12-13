import {Type} from "class-transformer";
import {
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    Min,
    ValidateNested,
} from "class-validator";

import {Order, SortBy} from "../types";
import {LikedEntity} from "../utils/entity";
import {Article} from "./articles.entity";

export class TagDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUrl()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => TagDto)
    @IsOptional()
    tags?: TagDto[];

    @IsNumber()
    @Min(1)
    @IsOptional()
    readTime?: number;

    @IsString()
    @IsNotEmpty()
    authorId: string;
}

export class UpdateArticleDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsNumber()
    @IsOptional()
    readTime?: number;
}

export type ResponseArticle = Article & LikedEntity;

export class ResponseGetArticles {
    articles: Article[];

    @Type(() => Number)
    @IsInt()
    page: number;

    @Type(() => Number)
    @IsInt()
    limit: number;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    next?: string;
}

export class RequestGetArticles {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    authorId?: string;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    minLikes: number = 0;

    @IsOptional()
    @IsString()
    createdAfter?: string;

    @IsOptional()
    @IsEnum(SortBy)
    sortBy: SortBy = SortBy.CREATED_AT;

    @IsOptional()
    @IsEnum(Order)
    order: Order = Order.DESC;
}
