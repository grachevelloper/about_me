import {Body, Controller, Req, UseGuards} from "@nestjs/common";
import {IsEnum, IsString, IsUUID} from "class-validator";
import {Request} from "express";

import {AuthGuard} from "../guards/auth.guard";
import {EntityLikeType} from "./likes.entity";
import {LikesService} from "./likes.service";

export class CreateLikeDto {
    @IsUUID()
    authorId: string;

    @IsUUID()
    entityId: string;

    @IsEnum(["todo", "article", "comment"])
    entityType: EntityLikeType;
}

export class DeleteLikeDto {
    @IsUUID()
    entityId: string;

    @IsUUID()
    authorId: string;

    @IsString()
    entityType: EntityLikeType;
}
@UseGuards(AuthGuard)
@Controller("likes")
export class LikesController {
    constructor(private readonly likesService: LikesService) {}

    async create(@Req() req: Request, @Body() createLikeData: CreateLikeDto) {
        const createLikeDataWithUserId: CreateLikeDto = {
            ...createLikeData,
            authorId: req.user.id,
        };

        return await this.likesService.create(createLikeDataWithUserId);
    }

    async delete(@Req() req: Request, @Body() deleteLikeData: DeleteLikeDto) {
        const createLikeDataWithUserId: CreateLikeDto = {
            ...deleteLikeData,
            authorId: req.user.id,
        };

        return await this.likesService.delete(createLikeDataWithUserId);
    }
}
