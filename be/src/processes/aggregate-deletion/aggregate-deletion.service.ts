import {Injectable, Logger} from "@nestjs/common";
import {Article} from "src/modules/articles/articles.entity";
import {Attachment} from "src/modules/attachments/attachments.entity";
import {AttachmentsService} from "src/modules/attachments/attachments.service";
import {Comment} from "src/modules/comments/comments.entity";
import {Like} from "src/modules/likes/likes.entity";
import {CheckList} from "src/modules/todos/checklists/checklists.entity";
import {Todo} from "src/modules/todos/todos.entity";
import {User} from "src/modules/users/users.entity";
import {DataSource, EntityManager, EntityTarget, In} from "typeorm";

import {RefreshToken} from "../auth/refresh-token/refresh-token.entity";

@Injectable()
export class AggregateDeletionService {
    private readonly logger = new Logger(AggregateDeletionService.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly attachmentsService: AttachmentsService,
    ) {}

    async deleteTodoAggregate(todoId: string): Promise<void> {
        await this.attachmentsService.deleteEntityFiles("todo", todoId);

        await this.runTransactionAfterStorageDeletion("todo", todoId, async (manager) => {
            const comments = await manager.find(Comment, {
                select: {id: true},
                where: {entityType: "todo", entityId: todoId},
            });
            const commentIds = comments.map((comment) => comment.id);

            if (commentIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "comment",
                    entityId: In(commentIds),
                });
            }

            await manager.delete(Comment, {
                entityType: "todo",
                entityId: todoId,
            });
            await manager.delete(Like, {entityType: "todo", entityId: todoId});
            await manager.delete(Attachment, {
                entityType: "todo",
                entityId: todoId,
            });
            await manager.delete(CheckList, {todoId});
            await manager.delete(Todo, todoId);
        });
    }

    async deleteArticleAggregate(articleId: string): Promise<void> {
        await this.attachmentsService.deleteEntityFiles("article", articleId);

        await this.runTransactionAfterStorageDeletion("article", articleId, async (manager) => {
            const comments = await manager.find(Comment, {
                select: {id: true},
                where: {entityType: "article", entityId: articleId},
            });
            const commentIds = comments.map((comment) => comment.id);

            if (commentIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "comment",
                    entityId: In(commentIds),
                });
            }

            await manager.delete(Comment, {
                entityType: "article",
                entityId: articleId,
            });
            await manager.delete(Like, {
                entityType: "article",
                entityId: articleId,
            });
            await manager.delete(Attachment, {
                entityType: "article",
                entityId: articleId,
            });
            await manager
                .createQueryBuilder()
                .delete()
                .from("article_tags")
                .where('"articleId" = :articleId', {articleId})
                .execute();
            await manager.delete(Article, articleId);
        });
    }

    async deleteUserAggregate(userId: string): Promise<void> {
        const {articleIds, commentIds, todoIds} =
            await this.getOwnedContentIds(userId);
        await this.deleteOwnedAttachmentFiles(userId, articleIds, todoIds);

        await this.runTransactionAfterStorageDeletion("user", userId, async (manager) => {
            await manager.delete(RefreshToken, {userId});

            await this.decrementSurvivingUserLikeTargets({
                articleIds,
                commentIds,
                todoIds,
                userId,
                manager,
            });

            if (commentIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "comment",
                    entityId: In(commentIds),
                });
                await manager.delete(Comment, {id: In(commentIds)});
            }

            if (articleIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "article",
                    entityId: In(articleIds),
                });
                await manager.delete(Attachment, {
                    entityType: "article",
                    entityId: In(articleIds),
                });
                await manager
                    .createQueryBuilder()
                    .delete()
                    .from("article_tags")
                    .where('"articleId" IN (:...articleIds)', {articleIds})
                    .execute();
                await manager.delete(Article, {id: In(articleIds)});
            }

            if (todoIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "todo",
                    entityId: In(todoIds),
                });
                await manager.delete(Attachment, {
                    entityType: "todo",
                    entityId: In(todoIds),
                });
                await manager
                    .createQueryBuilder()
                    .delete()
                    .from(CheckList)
                    .where("todo_id IN (:...todoIds)", {todoIds})
                    .execute();
                await manager.delete(Todo, {id: In(todoIds)});
            }

            await manager.delete(Like, {authorId: userId});
            await manager.delete(Attachment, {
                entityType: "user",
                entityId: userId,
            });
            await manager.delete(User, userId);
        });
    }

    private async runTransactionAfterStorageDeletion(
        aggregateType: "article" | "todo" | "user",
        aggregateId: string,
        operation: (manager: EntityManager) => Promise<void>,
    ): Promise<void> {
        try {
            await this.dataSource.transaction(operation);
        } catch (error) {
            this.logger.error(
                "Database transaction failed after aggregate storage deletion",
                {aggregateId, aggregateType, error},
            );
            throw error;
        }
    }

    private async getOwnedContentIds(userId: string): Promise<{
        articleIds: string[];
        commentIds: string[];
        todoIds: string[];
    }> {
        const articles = await this.dataSource.manager.find(Article, {
            select: ["id"],
            where: {author: {id: userId}},
        });
        const articleIds = articles.map((article) => article.id);

        const todos = await this.dataSource.manager.find(Todo, {
            select: ["id"],
            where: {authorId: userId},
        });
        const todoIds = todos.map((todo) => todo.id);

        const comments = await this.dataSource.manager.find(Comment, {
            select: ["id", "parentId", "entityId", "entityType"],
            where: [
                {author: {id: userId}},
                ...(articleIds.length > 0
                    ? [
                          {
                              entityType: "article" as const,
                              entityId: In(articleIds),
                          },
                      ]
                    : []),
                ...(todoIds.length > 0
                    ? [{entityType: "todo" as const, entityId: In(todoIds)}]
                    : []),
            ],
        });
        const commentRootIds = comments.map((comment) => comment.id);
        const allComments = await this.dataSource.manager.find(Comment, {
            select: ["id", "parentId"],
        });

        return {
            articleIds,
            commentIds: this.getCommentBranchIds(allComments, commentRootIds),
            todoIds,
        };
    }

    private async deleteOwnedAttachmentFiles(
        userId: string,
        articleIds: string[],
        todoIds: string[],
    ): Promise<void> {
        await this.attachmentsService.deleteEntityFiles("user", userId);

        for (const articleId of articleIds) {
            await this.attachmentsService.deleteEntityFiles(
                "article",
                articleId,
            );
        }

        for (const todoId of todoIds) {
            await this.attachmentsService.deleteEntityFiles("todo", todoId);
        }
    }

    private getCommentBranchIds(
        comments: Pick<Comment, "id" | "parentId">[],
        rootIds: string[],
    ): string[] {
        const ids = new Set(rootIds);
        let changed = true;

        while (changed) {
            changed = false;
            for (const comment of comments) {
                if (
                    comment.parentId &&
                    ids.has(comment.parentId) &&
                    !ids.has(comment.id)
                ) {
                    ids.add(comment.id);
                    changed = true;
                }
            }
        }

        return [...ids];
    }

    private async decrementSurvivingUserLikeTargets({
        articleIds,
        commentIds,
        todoIds,
        userId,
        manager,
    }: {
        articleIds: string[];
        commentIds: string[];
        manager: EntityManager;
        todoIds: string[];
        userId: string;
    }): Promise<void> {
        const deletedArticleIds = new Set(articleIds);
        const deletedCommentIds = new Set(commentIds);
        const deletedTodoIds = new Set(todoIds);
        const authoredLikes = await manager.find(Like, {
            select: ["entityType", "entityId"],
            where: {authorId: userId},
        });

        for (const like of authoredLikes) {
            if (
                (like.entityType === "article" &&
                    deletedArticleIds.has(like.entityId)) ||
                (like.entityType === "comment" &&
                    deletedCommentIds.has(like.entityId)) ||
                (like.entityType === "todo" && deletedTodoIds.has(like.entityId))
            ) {
                continue;
            }

            await manager
                .createQueryBuilder()
                .update(this.getLikeTargetEntity(like.entityType))
                .set({likesCount: () => "GREATEST(likes_count - 1, 0)"})
                .where("id = :entityId", {entityId: like.entityId})
                .execute();
        }
    }

    private getLikeTargetEntity(
        entityType: Like["entityType"],
    ): EntityTarget<{likesCount: number}> {
        switch (entityType) {
            case "article":
                return Article;
            case "comment":
                return Comment;
            case "todo":
                return Todo;
        }
    }
}
