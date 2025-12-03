import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Order} from "../types";
import {UsersService} from "../users/users.service";
import {CreateCommentDto, UpdateCommentDto} from "./comemnts.dto";
import {Comment, EntityCommentType} from "./comments.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        private usersService: UsersService,
    ) {}

    async create(authorId: string, createCommentData: CreateCommentDto) {
        const author = await this.usersService.findById(authorId);
        if (!author) {
            throw new NotFoundException("User not found");
        }

        let depth = 0;
        if (createCommentData.parentId) {
            const parentComment = await this.findOne(
                createCommentData.parentId,
            );
            depth = parentComment.depth + 1;
        }

        const comment = this.commentRepository.create({
            ...createCommentData,
            author,
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
        const comment = await this.commentRepository.findOne({
            where: {id},
            relations: ["author"],
        });
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        return comment;
    }

    async findByEntity(
        entityType: EntityCommentType,
        entityId: string,
        order = Order.DESC,
    ): Promise<Comment[]> {
        const comments = await this.commentRepository.find({
            where: {entityType, entityId},
            relations: ["author"],
        });

        if (order === Order.DESC)
            comments.sort((a, b) => {
                if (a.parentId === b.id) return 1;
                if (b.parentId === a.id) return -1;

                const timeA = new Date(a.createdAt).getTime();
                const timeB = new Date(b.createdAt).getTime();

                if (timeA < timeB) return -1;
                if (timeA > timeB) return 1;
                return 0;
            });

        return comments;
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
