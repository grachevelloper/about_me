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
    UseGuards,
} from "@nestjs/common";

import {CurrentUser} from "../../shared/decorators/current-user.decorator";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {AuthenticatedUser, Order} from "../../types";
import {CreateCommentDto, UpdateCommentDto} from "./comments.dto";
import {EntityCommentType} from "./comments.entity";
import {CommentsService} from "./comments.service";

@UseGuards(AuthGuard)
@Controller("comments")
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() createCommentData: CreateCommentDto,
    ) {
        return await this.commentsService.create(user.id, createCommentData);
    }

    @HttpCode(HttpStatus.OK)
    @Get(":id")
    async getByid(@Param() id: string) {
        return await this.commentsService.findOne(id);
    }

    @HttpCode(HttpStatus.OK)
    @Get(":entityType/:entityId")
    async getByEntityId(
        @Param("entityType") entityType: EntityCommentType,
        @Param("entityId") entityId: string,
        @Body() order: Order,
    ) {
        return await this.commentsService.findByEntity(
            entityType,
            entityId,
            order,
        );
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
    @Delete(":id")
    async delete(@Param() id: string) {
        return await this.commentsService.delete(id);
    }
}
