import {
    Body,
    Controller,
    Delete,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import {IsEnum, IsOptional, IsString, IsUUID} from "class-validator";
import {Request} from "express";

import {AuthGuard} from "../guards/auth.guard";
import {EntityCommentType} from "./comments.entity";
import {CommentsService} from "./comments.service";

export class CreateCommentDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsUUID()
    parentId?: string | null;

    @IsString()
    entityId: string;

    @IsEnum(["todo", "article"])
    entityType: EntityCommentType;
}

export class DeleteCommentDto {
    @IsUUID()
    id: string;
}

export class UpdateCommentDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    content?: string;
}

@UseGuards(AuthGuard)
@Controller("comments")
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async create(
        @Req() req: Request,
        @Body() createCommentData: CreateCommentDto,
    ) {
        const authorId = req.user.id;

        return await this.commentsService.create(authorId, createCommentData);
    }

    @Patch()
    async update(@Body() updateCommentData: UpdateCommentDto) {
        return await this.commentsService.update(updateCommentData);
    }

    @Delete()
    async delete(@Body() deleteCommentData: DeleteCommentDto) {
        return await this.commentsService.delete(deleteCommentData.id);
    }
}
