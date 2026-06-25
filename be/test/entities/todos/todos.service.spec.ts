import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Attachment} from "src/modules/attachments/attachments.entity";
import {AttachmentsService} from "src/modules/attachments/attachments.service";
import {Comment} from "src/modules/comments/comments.entity";
import {CommentsService} from "src/modules/comments/comments.service";
import {Like} from "src/modules/likes/likes.entity";
import {CheckList} from "src/modules/todos/checklists/checklists.entity";
import {Todo} from "src/modules/todos/todos.entity";
import {TodosService} from "src/modules/todos/todos.service";
import {AuthenticatedUser, Role} from "src/types";
import {DeleteResult, EntityManager, Repository} from "typeorm";

import {CreateTodoDto, UpdateTodoDto} from "@/todos/todo.dto";
import {TodoState} from "@/types/todo";

describe("TodosService", () => {
    let service: TodosService;
    let repository: jest.Mocked<Repository<Todo>>;
    let commentsService: jest.Mocked<CommentsService>;
    let attachmentsService: jest.Mocked<AttachmentsService>;
    const entityManager = {
        delete: jest.fn<EntityManager["delete"]>(),
        find: jest.fn<EntityManager["find"]>(),
    };

    const mockTodo: Todo = {
        id: "1",
        title: "Test Todo",
        content: "Test Description",
        likesCount: 0,
        authorId: "user-123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const owner = {
        id: "user-123",
        role: Role.USER,
    } as AuthenticatedUser;
    const stranger = {
        id: "user-456",
        role: Role.USER,
    } as AuthenticatedUser;
    const admin = {
        id: "admin-123",
        role: Role.ADMIN,
    } as AuthenticatedUser;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TodosService,
                {
                    provide: getRepositoryToken(Todo),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                        delete: jest.fn(),
                        createQueryBuilder: jest.fn(),
                        manager: {
                            transaction: jest.fn(
                                async (
                                    callback: (
                                        manager: typeof entityManager,
                                    ) => Promise<unknown>,
                                ) => callback(entityManager),
                            ),
                        },
                    },
                },
                {
                    provide: CommentsService,
                    useValue: {
                        findByEntity: jest.fn(),
                    },
                },
                {
                    provide: AttachmentsService,
                    useValue: {
                        deleteEntityFiles: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TodosService>(TodosService);
        repository = module.get(getRepositoryToken(Todo));
        commentsService = module.get(CommentsService);
        attachmentsService = module.get(AttachmentsService);
        entityManager.delete.mockReset();
        entityManager.find.mockReset();
    });

    describe("create", () => {
        it("should create a todo", async () => {
            const createTodoData: CreateTodoDto = {
                title: "New Todo",
                content: "Description",
            };

            repository.create.mockReturnValue(mockTodo);
            repository.save.mockResolvedValue(mockTodo);

            await service.create({data: createTodoData, actor: owner});

            expect(repository.create).toHaveBeenCalledWith({
                ...createTodoData,
                authorId: owner.id,
            });
            expect(repository.save).toHaveBeenCalledWith(mockTodo);
        });
    });

    describe("findOne", () => {
        it("should find todo by id", async () => {
            repository.findOne.mockResolvedValue(mockTodo);

            await service.findOne({id: "1", actor: owner});

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
        });

        it("should throw NotFoundException if todo not found", async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(
                service.findOne({id: "999", actor: owner}),
            ).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe("findAll", () => {
        it("should find todos by author", async () => {
            const todos = [mockTodo, {...mockTodo, id: "2"}];
            repository.find.mockResolvedValue(todos);

            await service.findAll("user-123");

            expect(repository.find).toHaveBeenCalledWith({
                where: {authorId: "user-123"},
            });
        });
    });

    describe("findActive", () => {
        it("should find in-progress todos by author", async () => {
            const activeTodos = [mockTodo];
            repository.find.mockResolvedValue(activeTodos);

            await service.findActive("user-123");

            expect(repository.find).toHaveBeenCalledWith({
                where: {
                    state: TodoState.IN_WORK,
                    authorId: "user-123",
                },
            });
        });
    });

    describe("update", () => {
        it("should update todo", async () => {
            const updateData: UpdateTodoDto = {title: "Updated Todo"};
            const updatedTodo = {...mockTodo, ...updateData};

            repository.findOne.mockResolvedValue(mockTodo);
            repository.save.mockResolvedValue(updatedTodo);

            await service.update({id: "1", data: updateData, actor: owner});

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
            expect(repository.save).toHaveBeenCalledWith({
                ...mockTodo,
                ...updateData,
            });
        });

        it("should throw NotFoundException if todo not found", async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(
                service.update({
                    id: "999",
                    data: {title: "Updated"},
                    actor: owner,
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it("should forbid regular users from updating another user's todo", async () => {
            repository.findOne.mockResolvedValue(mockTodo);

            await expect(
                service.update({
                    id: "1",
                    data: {title: "Updated"},
                    actor: stranger,
                }),
            ).rejects.toBeInstanceOf(ForbiddenException);
            expect(repository.save).not.toHaveBeenCalled();
        });

        it("should allow an administrator to update another user's todo", async () => {
            const updateData: UpdateTodoDto = {title: "Admin Updated Todo"};
            repository.findOne.mockResolvedValue(mockTodo);
            repository.save.mockResolvedValue({...mockTodo, ...updateData});

            await service.update({id: "1", data: updateData, actor: admin});

            expect(repository.save).toHaveBeenCalledWith({
                ...mockTodo,
                ...updateData,
            });
        });
    });

    describe("delete", () => {
        it("should delete todo", async () => {
            repository.findOne.mockResolvedValue(mockTodo);
            attachmentsService.deleteEntityFiles.mockResolvedValue({
                deleted: 0,
            });
            entityManager.find.mockResolvedValue([{id: "comment-1"} as Comment]);
            entityManager.delete.mockResolvedValue({
                raw: [],
                affected: 1,
            } as DeleteResult);

            await service.delete({id: "1", actor: owner});

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
            expect(attachmentsService.deleteEntityFiles).toHaveBeenCalledWith(
                "todo",
                "1",
            );
            expect(repository.manager.transaction).toHaveBeenCalled();
            expect(entityManager.find).toHaveBeenCalledWith(Comment, {
                select: {id: true},
                where: {entityType: "todo", entityId: "1"},
            });
            expect(entityManager.delete).toHaveBeenNthCalledWith(1, Like, {
                entityType: "comment",
                entityId: expect.any(Object),
            });
            expect(entityManager.delete).toHaveBeenNthCalledWith(2, Comment, {
                entityType: "todo",
                entityId: "1",
            });
            expect(entityManager.delete).toHaveBeenNthCalledWith(3, Like, {
                entityType: "todo",
                entityId: "1",
            });
            expect(entityManager.delete).toHaveBeenNthCalledWith(4, Attachment, {
                entityType: "todo",
                entityId: "1",
            });
            expect(entityManager.delete).toHaveBeenNthCalledWith(5, CheckList, {
                todo: {id: "1"},
            });
            expect(entityManager.delete).toHaveBeenNthCalledWith(6, Todo, "1");
        });

        it("should throw NotFoundException if todo not found", async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(service.delete({id: "999", actor: owner})).rejects.toThrow(
                NotFoundException,
            );
        });

        it("should forbid regular users from deleting another user's todo", async () => {
            repository.findOne.mockResolvedValue(mockTodo);

            await expect(
                service.delete({id: "1", actor: stranger}),
            ).rejects.toBeInstanceOf(ForbiddenException);
            expect(attachmentsService.deleteEntityFiles).not.toHaveBeenCalled();
            expect(repository.manager.transaction).not.toHaveBeenCalled();
        });

        it("should not change database if storage deletion fails", async () => {
            repository.findOne.mockResolvedValue(mockTodo);
            attachmentsService.deleteEntityFiles.mockRejectedValue(
                new Error("storage failed"),
            );

            await expect(
                service.delete({id: "1", actor: owner}),
            ).rejects.toThrow("storage failed");
            expect(repository.manager.transaction).not.toHaveBeenCalled();
        });
    });

    describe("findTodoWithComments", () => {
        it("should return todo with comments", async () => {
            const mockComments = [{id: "1", content: "Test comment"}];

            repository.findOne.mockResolvedValue(mockTodo);
            commentsService.findByEntity.mockResolvedValue(mockComments as any);

            const result = await service.findTodoWithComments({
                todoId: "1",
                actor: owner,
            });

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
            expect(commentsService.findByEntity).toHaveBeenCalledWith(
                "todo",
                "1",
            );
            expect(result).toEqual({...mockTodo, comments: mockComments});
        });

        it("should throw NotFoundException if todo not found", async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(
                service.findTodoWithComments({todoId: "999", actor: owner}),
            ).rejects.toBeInstanceOf(NotFoundException);
            expect(commentsService.findByEntity).not.toHaveBeenCalled();
        });
    });

    describe("incrementLikesCount", () => {
        it("should increment likes count", async () => {
            const mockQueryBuilder = {
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({} as never),
            };

            repository.createQueryBuilder.mockReturnValue(
                mockQueryBuilder as any,
            );

            await service.incrementLikesCount("1");

            expect(repository.createQueryBuilder).toHaveBeenCalled();
            expect(mockQueryBuilder.update).toHaveBeenCalledWith(Todo);
            expect(mockQueryBuilder.set).toHaveBeenCalledWith({
                likesCount: expect.any(Function),
            });
            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "id = :todoId",
                {todoId: "1"},
            );
            expect(mockQueryBuilder.execute).toHaveBeenCalled();
        });
    });

    describe("decrementLikesCount", () => {
        it("should decrement likes count", async () => {
            const mockQueryBuilder = {
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({} as never),
            };

            repository.createQueryBuilder.mockReturnValue(
                mockQueryBuilder as any,
            );

            await service.decrementLikesCount("1");

            expect(repository.createQueryBuilder).toHaveBeenCalled();
            expect(mockQueryBuilder.update).toHaveBeenCalledWith(Todo);
            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "id = :todoId",
                {todoId: "1"},
            );
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                "likesCount > 0",
            );
            expect(mockQueryBuilder.execute).toHaveBeenCalled();
        });
    });
});
