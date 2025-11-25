import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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
    parentId?: string;

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
    @IsString()
    contents: string;
}

@UseGuards(AuthGuard)
@Controller("comments")
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(
        @Req() req: Request,
        @Body() createCommentData: CreateCommentDto,
    ) {
        const authorId = req.user.id;

        return await this.commentsService.create(authorId, createCommentData);
    }

    @HttpCode(HttpStatus.OK)
    @Get(":id")
    async getByid(@Param() id: string) {
        return await this.commentsService.findOne(id);
    }

    @HttpCode(HttpStatus.OK)
    @Get(":entityType/:entityId")
    async getByEntityId(
        @Param() entityType: EntityCommentType,
        @Param() entityId: string,
    ) {
        return await this.commentsService.findByEntity(entityType, entityId);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(":id")
    async update(
        @Param() id: string,
        @Body() updateCommentData: UpdateCommentDto,
    ) {
        return await this.commentsService.update({...updateCommentData, id});
    }

    @HttpCode(HttpStatus.OK)
    @Delete()
    async delete(@Body() deleteCommentData: DeleteCommentDto) {
        return await this.commentsService.delete(deleteCommentData.id);
    }
}
