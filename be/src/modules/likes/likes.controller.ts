import {Body, Controller, UseGuards} from "@nestjs/common";

import {CurrentUser} from "../../shared/decorators/current-user.decorator";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {AuthenticatedUser} from "../../types";
import {CreateLikeDto, DeleteLikeDto} from "./likes.dto";
import {LikesService} from "./likes.service";

@UseGuards(AuthGuard)
@Controller("likes")
export class LikesController {
    constructor(private readonly likesService: LikesService) {}

    async create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() createLikeData: CreateLikeDto,
    ) {
        const createLikeDataWithUserId: CreateLikeDto = {
            ...createLikeData,
            authorId: user.id,
        };

        return await this.likesService.create(createLikeDataWithUserId);
    }

    async delete(
        @CurrentUser() user: AuthenticatedUser,
        @Body() deleteLikeData: DeleteLikeDto,
    ) {
        const createLikeDataWithUserId: CreateLikeDto = {
            ...deleteLikeData,
            authorId: user.id,
        };

        return await this.likesService.delete(createLikeDataWithUserId);
    }
}
