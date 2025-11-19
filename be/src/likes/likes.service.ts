import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";

import {CommentsService} from "../comments/comments.service";
import {TodosService} from "../todos/todos.service";
import {UsersService} from "../users/users.service";
import {CreateLikeDto, DeleteLikeDto} from "./likes.controller";
import {Like} from "./likes.entity";

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like)
        private likesRepository: Repository<Like>,
        private todosService: TodosService,
        private commentsService: CommentsService,
        private usersService: UsersService,
    ) {}

    async create(createLikeData: CreateLikeDto): Promise<Like> {
        const {entityId, entityType, authorId} = createLikeData;

        await this.usersService.findById(authorId);

        const existingLike = await this.likesRepository.findOne({
            where: {entityId, entityType, authorId},
        });

        if (existingLike) {
            throw new ConflictException("Already liked");
        }

        const like = this.likesRepository.create(createLikeData);
        const savedLike = await this.likesRepository.save(like);

        await this.incrementLikesCount(entityId, entityType);

        return savedLike;
    }

    async delete(deleteLikeData: DeleteLikeDto): Promise<DeleteResult> {
        const {entityId, authorId, entityType} = deleteLikeData;

        const like = await this.likesRepository.findOneBy(deleteLikeData);
        if (!like) {
            throw new NotFoundException("Like not found");
        }

        const result = await this.likesRepository.delete({
            authorId,
            entityId,
            entityType,
        });

        await this.decrementLikesCount(entityId, entityType);

        return result;
    }

    private async incrementLikesCount(entityId: string, entityType: string) {
        switch (entityType) {
            case "todo":
                await this.todosService.incrementLikesCount(entityId);
                break;
            case "comment":
                await this.commentsService.incrementLikesCount(entityId);
                break;
            default:
                throw new BadRequestException("Invalid entity type");
        }
    }

    private async decrementLikesCount(entityId: string, entityType: string) {
        switch (entityType) {
            case "todo":
                await this.todosService.decrementLikesCount(entityId);
                break;
            case "comment":
                await this.commentsService.decrementLikesCount(entityId);
                break;
            default:
                throw new BadRequestException("Invalid entity type");
        }
    }
}
