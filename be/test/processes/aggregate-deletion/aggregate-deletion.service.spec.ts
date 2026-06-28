import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {Logger} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {Article} from "src/modules/articles/articles.entity";
import {Attachment} from "src/modules/attachments/attachments.entity";
import {AttachmentsService} from "src/modules/attachments/attachments.service";
import {Comment} from "src/modules/comments/comments.entity";
import {Like} from "src/modules/likes/likes.entity";
import {CheckList} from "src/modules/todos/checklists/checklists.entity";
import {Todo} from "src/modules/todos/todos.entity";
import {User} from "src/modules/users/users.entity";
import {AggregateDeletionService} from "src/processes/aggregate-deletion/aggregate-deletion.service";
import {RefreshToken} from "src/processes/auth/refresh-token/refresh-token.entity";
import {DataSource} from "typeorm";

describe("AggregateDeletionService", () => {
    let service: AggregateDeletionService;
    let attachmentsService: jest.Mocked<Pick<AttachmentsService, "deleteEntityFiles">>;
    let dataSource: {
        manager: {
            find: jest.MockedFunction<(...args: unknown[]) => Promise<unknown[]>>;
        };
        transaction: jest.MockedFunction<
            (callback: (manager: typeof transactionalManager) => Promise<void>) => Promise<void>
        >;
    };
    const transactionalManager = {
        createQueryBuilder: jest.fn(),
        delete: jest.fn<(...args: unknown[]) => Promise<{affected: number; raw: unknown[]}>>(),
        find: jest.fn<(...args: unknown[]) => Promise<unknown[]>>(),
    };

    beforeEach(async () => {
        attachmentsService = {
            deleteEntityFiles: jest.fn<AttachmentsService["deleteEntityFiles"]>().mockResolvedValue({deleted: 0}),
        };
        dataSource = {
            manager: {
                find: jest.fn<(...args: unknown[]) => Promise<unknown[]>>().mockResolvedValue([]),
            },
            transaction: jest.fn<
                (callback: (manager: typeof transactionalManager) => Promise<void>) => Promise<void>
            >(async (callback) => callback(transactionalManager)),
        };
        transactionalManager.delete.mockResolvedValue({affected: 1, raw: []});
        transactionalManager.find.mockResolvedValue([]);
        transactionalManager.createQueryBuilder.mockReturnValue({
            delete: jest.fn().mockReturnThis(),
            execute: jest.fn(async () => ({})),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
        });

        const moduleRef = await Test.createTestingModule({
            providers: [
                AggregateDeletionService,
                {provide: AttachmentsService, useValue: attachmentsService},
                {provide: DataSource, useValue: dataSource},
            ],
        }).compile();

        service = moduleRef.get(AggregateDeletionService);
    });

    it("deletes todo storage before transactional aggregate rows", async () => {
        transactionalManager.find.mockResolvedValue([{id: "comment-1"} as Comment]);

        await service.deleteTodoAggregate("todo-1");

        expect(attachmentsService.deleteEntityFiles).toHaveBeenCalledWith("todo", "todo-1");
        expect(dataSource.transaction).toHaveBeenCalled();
        expect(transactionalManager.find).toHaveBeenCalledWith(Comment, {
            select: {id: true},
            where: {entityType: "todo", entityId: "todo-1"},
        });
        expect(transactionalManager.delete).toHaveBeenNthCalledWith(1, Like, {
            entityType: "comment",
            entityId: expect.anything(),
        });
        expect(transactionalManager.delete).toHaveBeenNthCalledWith(2, Comment, {
            entityType: "todo",
            entityId: "todo-1",
        });
        expect(transactionalManager.delete).toHaveBeenNthCalledWith(3, Like, {
            entityType: "todo",
            entityId: "todo-1",
        });
        expect(transactionalManager.delete).toHaveBeenNthCalledWith(4, Attachment, {
            entityType: "todo",
            entityId: "todo-1",
        });
        expect(transactionalManager.delete).toHaveBeenNthCalledWith(5, CheckList, {
            todoId: "todo-1",
        });
        expect(transactionalManager.delete).toHaveBeenNthCalledWith(6, Todo, "todo-1");
    });

    it("deletes article_tags while deleting an article aggregate", async () => {
        const queryBuilder = {
            delete: jest.fn().mockReturnThis(),
            execute: jest.fn(async () => ({})),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
        };
        transactionalManager.createQueryBuilder.mockReturnValue(queryBuilder);

        await service.deleteArticleAggregate("article-1");

        expect(attachmentsService.deleteEntityFiles).toHaveBeenCalledWith("article", "article-1");
        expect(queryBuilder.delete).toHaveBeenCalled();
        expect(queryBuilder.from).toHaveBeenCalledWith("article_tags");
        expect(queryBuilder.where).toHaveBeenCalledWith('"articleId" = :articleId', {
            articleId: "article-1",
        });
        expect(transactionalManager.delete).toHaveBeenLastCalledWith(Article, "article-1");
    });

    it("does not start a database transaction if storage deletion fails", async () => {
        attachmentsService.deleteEntityFiles.mockRejectedValue(new Error("storage failed"));

        await expect(service.deleteArticleAggregate("article-1")).rejects.toThrow("storage failed");

        expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it("logs identifiers when database rollback happens after todo storage deletion", async () => {
        const errorSpy = jest
            .spyOn(Logger.prototype, "error")
            .mockImplementation(() => undefined);
        dataSource.transaction.mockRejectedValue(new Error("database failed"));

        await expect(service.deleteTodoAggregate("todo-1")).rejects.toThrow("database failed");

        expect(errorSpy).toHaveBeenCalledWith(
            "Database transaction failed after aggregate storage deletion",
            expect.objectContaining({
                aggregateId: "todo-1",
                aggregateType: "todo",
                error: expect.any(Error),
            }),
        );
    });

    it("deletes user-owned aggregate files before user aggregate rows", async () => {
        dataSource.manager.find
            .mockResolvedValueOnce([{id: "article-1"} as Article])
            .mockResolvedValueOnce([{id: "todo-1"} as Todo])
            .mockResolvedValueOnce([{id: "comment-1", parentId: null} as Comment])
            .mockResolvedValueOnce([
                {id: "comment-1", parentId: null},
                {id: "comment-2", parentId: "comment-1"},
            ] as Comment[]);

        await service.deleteUserAggregate("user-1");

        expect(attachmentsService.deleteEntityFiles).toHaveBeenNthCalledWith(1, "user", "user-1");
        expect(attachmentsService.deleteEntityFiles).toHaveBeenNthCalledWith(2, "article", "article-1");
        expect(attachmentsService.deleteEntityFiles).toHaveBeenNthCalledWith(3, "todo", "todo-1");
        expect(transactionalManager.delete).toHaveBeenCalledWith(RefreshToken, {
            userId: "user-1",
        });
        expect(transactionalManager.delete).toHaveBeenCalledWith(Like, {
            entityType: "comment",
            entityId: expect.anything(),
        });
        expect(transactionalManager.delete).toHaveBeenCalledWith(User, "user-1");
    });

    it("decrements counters for user-authored likes that point to surviving targets", async () => {
        dataSource.manager.find
            .mockResolvedValueOnce([{id: "owned-article"} as Article])
            .mockResolvedValueOnce([{id: "owned-todo"} as Todo])
            .mockResolvedValueOnce([{id: "owned-comment", parentId: null} as Comment])
            .mockResolvedValueOnce([{id: "owned-comment", parentId: null}] as Comment[]);
        transactionalManager.find.mockResolvedValue([
            {
                entityType: "article",
                entityId: "surviving-article",
            },
            {
                entityType: "todo",
                entityId: "owned-todo",
            },
            {
                entityType: "comment",
                entityId: "surviving-comment",
            },
            {
                entityType: "comment",
                entityId: "owned-comment",
            },
        ] as Like[]);
        const articleCounterUpdate = createQueryBuilder();
        const commentCounterUpdate = createQueryBuilder();
        transactionalManager.createQueryBuilder
            .mockReturnValueOnce(articleCounterUpdate)
            .mockReturnValueOnce(commentCounterUpdate)
            .mockReturnValue(createQueryBuilder());

        await service.deleteUserAggregate("user-1");

        expect(transactionalManager.find).toHaveBeenCalledWith(Like, {
            select: ["entityType", "entityId"],
            where: {authorId: "user-1"},
        });
        expect(articleCounterUpdate.update).toHaveBeenCalledWith(Article);
        expect(articleCounterUpdate.where).toHaveBeenCalledWith(
            "id = :entityId",
            {entityId: "surviving-article"},
        );
        expect(commentCounterUpdate.update).toHaveBeenCalledWith(Comment);
        expect(commentCounterUpdate.where).toHaveBeenCalledWith(
            "id = :entityId",
            {entityId: "surviving-comment"},
        );
    });
});

function createQueryBuilder() {
    return {
        delete: jest.fn().mockReturnThis(),
        execute: jest.fn(async () => ({affected: 1, raw: []})),
        from: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
    };
}
