import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {CommentsService} from "src/modules/comments/comments.service";
import {Todo} from "src/modules/todos/todos.entity";
import {TodosService} from "src/modules/todos/todos.service";
import {Repository} from "typeorm";

import {CreateTodoDto, UpdateTodoDto} from "@/todos/todo.interface";
import {TodoState} from "@/types/todo";

describe("TodosService", () => {
    let service: TodosService;
    let repository: jest.Mocked<Repository<Todo>>;
    let commentsService: jest.Mocked<CommentsService>;

    const mockTodo: Todo = {
        id: "1",
        title: "Test Todo",
        content: "Test Description",
        likesCount: 0,
        authorId: "user-123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

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
                    },
                },
                {
                    provide: CommentsService,
                    useValue: {
                        findByEntity: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TodosService>(TodosService);
        repository = module.get(getRepositoryToken(Todo));
        commentsService = module.get(CommentsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a todo", async () => {
            const createTodoData: CreateTodoDto = {
                title: "New Todo",
                content: "Description",
                authorId: "user-123",
            };

            repository.create.mockReturnValue(mockTodo);
            repository.save.mockResolvedValue(mockTodo);

            const result = await service.create(createTodoData);

            expect(repository.create).toHaveBeenCalledWith(createTodoData);
            expect(repository.save).toHaveBeenCalledWith(mockTodo);
            expect(result).toEqual(mockTodo);
        });
    });

    describe("findOne", () => {
        it("should return todo if found", async () => {
            repository.findOne.mockResolvedValue(mockTodo);

            const result = await service.findOne("1");

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
            expect(result).toEqual(mockTodo);
        });

        it("should throw NotFoundException if todo not found", async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(service.findOne("999")).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe("findAll", () => {
        it("should return all todos for author", async () => {
            const todos = [mockTodo, {...mockTodo, id: "2"}];
            repository.find.mockResolvedValue(todos);

            const result = await service.findAll("user-123");

            expect(repository.find).toHaveBeenCalledWith({
                where: {authorId: "user-123"},
            });
            expect(result).toEqual(todos);
        });

        it("should return empty array if no todos", async () => {
            repository.find.mockResolvedValue([]);

            const result = await service.findAll("user-123");

            expect(repository.find).toHaveBeenCalledWith({
                where: {authorId: "user-123"},
            });
            expect(result).toEqual([]);
        });
    });

    describe("findActive", () => {
        it("should return active todos for author", async () => {
            const activeTodos = [mockTodo];
            repository.find.mockResolvedValue(activeTodos);

            const result = await service.findActive("user-123");

            expect(repository.find).toHaveBeenCalledWith({
                where: {
                    state: TodoState.IN_WORK,
                    authorId: "user-123",
                },
            });
            expect(result).toEqual(activeTodos);
        });
    });

    describe("update", () => {
        it("should update todo", async () => {
            const updateData: UpdateTodoDto = {title: "Updated Todo"};
            const updatedTodo = {...mockTodo, ...updateData};

            repository.findOne.mockResolvedValue(mockTodo);
            repository.save.mockResolvedValue(updatedTodo);

            const result = await service.update("1", updateData);

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
            expect(repository.save).toHaveBeenCalledWith({
                ...mockTodo,
                ...updateData,
            });
            expect(result).toEqual(updatedTodo);
        });

        it("should throw NotFoundException if todo not found", async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(
                service.update("999", {title: "Updated"}),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe("delete", () => {
        it("should delete todo", async () => {
            repository.findOne.mockResolvedValue(mockTodo);
            repository.delete.mockResolvedValue({raw: [], affected: 1} as any);

            await service.delete("1");

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
            expect(repository.delete).toHaveBeenCalledWith("1");
        });

        it("should throw NotFoundException if todo not found", async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(service.delete("999")).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe("findTodoWithComments", () => {
        it("should return todo with comments", async () => {
            const mockComments = [{id: "1", content: "Test comment"}];

            repository.findOne.mockResolvedValue(mockTodo);
            commentsService.findByEntity.mockResolvedValue(mockComments as any);

            const result = await service.findTodoWithComments("1");

            expect(repository.findOne).toHaveBeenCalledWith({where: {id: "1"}});
            expect(commentsService.findByEntity).toHaveBeenCalledWith(
                "todo",
                "1",
            );
            expect(result).toEqual({...mockTodo, comments: mockComments});
        });

        it("should return todo with empty comments if no comments", async () => {
            repository.findOne.mockResolvedValue(mockTodo);
            commentsService.findByEntity.mockResolvedValue([]);

            const result = await service.findTodoWithComments("1");

            expect(result).toEqual({...mockTodo, comments: []});
        });

        it("should return null todo if not found", async () => {
            repository.findOne.mockResolvedValue(null);
            commentsService.findByEntity.mockResolvedValue([]);

            const result = await service.findTodoWithComments("999");
            expect(result).toEqual({comments: []});
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
