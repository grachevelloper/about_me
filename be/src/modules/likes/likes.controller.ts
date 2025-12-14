import {Body, Controller, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";

import {AuthGuard} from "../../shared/guards/auth.guard";
import {CreateLikeDto, DeleteLikeDto} from "./likes.interface";
import {LikesService} from "./likes.service";

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
