import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {CreateCommentDto, UpdateCommentDto} from "./comments.controller";
import {Comment, EntityCommentType} from "./comments.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}

    async create(authorId: string, createCommentData: CreateCommentDto) {
        let depth = 0;
        if (createCommentData.parentId) {
            const parentComment = await this.findOne(
                createCommentData.parentId,
            );
            depth = parentComment.depth + 1;
        }

        const comment = this.commentRepository.create({
            ...createCommentData,
            authorId,
            depth,
        });

        return await this.commentRepository.save(comment);
    }

    async update(updatedComment: UpdateCommentDto): Promise<Comment> {
        const comment = await this.findOne(updatedComment.id);
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        Object.assign(comment, updatedComment);
        return this.commentRepository.save(comment);
    }

    async delete(id: string) {
        const result = await this.commentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException("Comment not found");
        }
    }

    async findOne(id: string): Promise<Comment> {
        const comment = await this.commentRepository.findOne({where: {id}});
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        return comment;
    }
    async findByEntity(
        entityType: EntityCommentType,
        entityId: string,
    ): Promise<Comment[]> {
        return this.commentRepository.find({
            where: {entityType, entityId},
        });
    }

    async incrementLikesCount(commentId: string): Promise<void> {
        await this.commentRepository
            .createQueryBuilder()
            .update(Comment)
            .set({
                likesCount: () => "likesCount + 1",
            })
            .where("id = :commentId", {commentId})
            .execute();
    }

    async decrementLikesCount(commentId: string): Promise<void> {
        await this.commentRepository
            .createQueryBuilder()
            .update(Comment)
            .set({
                likesCount: () => "likesCount - 1",
            })
            .where("id = :commentId", {commentId})
            .andWhere("likesCount > 0")
            .execute();
    }
}
