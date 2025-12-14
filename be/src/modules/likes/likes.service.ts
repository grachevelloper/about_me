import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";

import {EntityLikeType, Like} from "./likes.entity";
import {CreateLikeDto, DeleteLikeDto} from "./likes.interface";

type HasLikedProps = {
    entityId: string;
    entityType: EntityLikeType;
    userId: string;
};
@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like)
        private likesRepository: Repository<Like>,
    ) {}

    async hasLiked({
        entityId,
        entityType,
        userId,
    }: HasLikedProps): Promise<boolean> {
        return Boolean(
            await this.likesRepository.findOne({
                where: {
                    entityId,
                    entityType,
                    authorId: userId,
                },
            }),
        );
    }

    async create(createLikeData: CreateLikeDto): Promise<Like> {
        const {entityId, entityType, authorId} = createLikeData;

        const existingLike = await this.likesRepository.findOne({
            where: {entityId, entityType, authorId},
        });

        if (existingLike) {
            throw new ConflictException("Already liked");
        }

        return await this.likesRepository.manager.transaction(
            async (transactionalEntityManager) => {
                await this.checkEntityExistsInTransaction(
                    entityId,
                    entityType,
                    transactionalEntityManager,
                );

                const duplicateInTx = await transactionalEntityManager.findOne(
                    Like,
                    {
                        where: {entityId, entityType, authorId},
                    },
                );

                if (duplicateInTx) {
                    throw new ConflictException(
                        "Already liked (concurrent request)",
                    );
                }

                const like = transactionalEntityManager.create(
                    Like,
                    createLikeData,
                );
                const savedLike = await transactionalEntityManager.save(like);

                await this.incrementLikesCountInTransaction(
                    entityId,
                    entityType,
                    transactionalEntityManager,
                );

                return savedLike;
            },
        );
    }

    async delete(deleteLikeData: DeleteLikeDto): Promise<void> {
        await this.likesRepository.manager.transaction(
            async (transactionalEntityManager) => {
                // 1. Удаляем лайк
                const result = await transactionalEntityManager.delete(
                    Like,
                    deleteLikeData,
                );

                if (result.affected === 0) {
                    throw new NotFoundException("Like not found");
                }

                // 2. Декрементим счетчик В транзакции
                await this.decrementLikesCountInTransaction(
                    deleteLikeData.entityId,
                    deleteLikeData.entityType,
                    transactionalEntityManager,
                );
            },
        );
    }

    private async incrementLikesCountInTransaction(
        entityId: string,
        entityType: string,
        transactionalEntityManager: EntityManager,
    ) {
        switch (entityType) {
            case "todo":
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update("todos")
                    .set({likesCount: () => "likes_count + 1"})
                    .where("id = :id", {id: entityId})
                    .execute();
                break;
            case "comment":
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update("comments")
                    .set({likesCount: () => "likes_count + 1"})
                    .where("id = :id", {id: entityId})
                    .execute();
                break;
            default:
                throw new BadRequestException("Invalid entity type");
        }
    }

    private async decrementLikesCountInTransaction(
        entityId: string,
        entityType: string,
        transactionalEntityManager: EntityManager,
    ) {
        switch (entityType) {
            case "todo":
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update("todos")
                    .set({likesCount: () => "GREATEST(likes_count - 1, 0)"})
                    .where("id = :id", {id: entityId})
                    .execute();
                break;
            case "comment":
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update("comments")
                    .set({likesCount: () => "GREATEST(likes_count - 1, 0)"})
                    .where("id = :id", {id: entityId})
                    .execute();
                break;
            default:
                throw new BadRequestException("Invalid entity type");
        }
    }

    private async checkEntityExistsInTransaction(
        entityId: string,
        entityType: string,
        transactionalEntityManager: EntityManager,
    ) {
        switch (entityType) {
            case "todo": {
                const todoExists = await transactionalEntityManager
                    .createQueryBuilder()
                    .select("1")
                    .from("todos", "todo")
                    .where("todo.id = :id", {id: entityId})
                    .getRawOne();

                if (!todoExists) {
                    throw new NotFoundException("Todo not found");
                }
                break;
            }
            case "comment": {
                const commentExists = await transactionalEntityManager
                    .createQueryBuilder()
                    .select("1")
                    .from("comments", "comment")
                    .where("comment.id = :id", {id: entityId})
                    .getRawOne();

                if (!commentExists) {
                    throw new NotFoundException("Comment not found");
                }
                break;
            }
            default:
                throw new BadRequestException("Invalid entity type");
        }
    }
}
