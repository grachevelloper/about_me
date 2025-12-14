import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {Request} from "express";

import {TodosController} from "src/modules/todos/todos.controller";
import {Todo} from "src/modules/todos/todos.entity";
import {TodosService} from "src/modules/todos/todos.service";
import {AuthGuard} from "src/shared/guards/auth.guard";
import {Role} from "../../../src/types";

const mockTodo: Todo = {
    id: "1",
    title: "Test Todo",
    content: "Test Description",
    likesCount: 0,
    authorId: "user-123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const mockUser = {
    id: "user-123",
    role: Role.USER,
};

const mockRequest = {
    user: mockUser,
} as Request;

describe("TodosController", () => {
    let controller: TodosController;

    const mockTodosService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findTodoWithComments: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        incrementLikesCount: jest.fn(),
        decrementLikesCount: jest.fn(),
        findOne: jest.fn(),
        findActive: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodosController],
            providers: [
                {
                    provide: TodosService,
                    useValue: mockTodosService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({canActivate: () => true})
            .compile();

        controller = module.get<TodosController>(TodosController);
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a new todo with user id from request", async () => {
            const createTodoData = {
                authorId: "user-123",
                title: "New Todo",
                content: "Description",
            };

            mockTodosService.create.mockResolvedValue(mockTodo as never);

            const result = await controller.create(createTodoData, mockRequest);

            expect(mockTodosService.create).toHaveBeenCalledWith({
                ...createTodoData,
                authorId: mockUser.id,
            });
            expect(result).toEqual(mockTodo);
        });

        it("should throw error if service throws", async () => {
            const createTodoData = {
                title: "New Todo",
                content: "Description",
            };

            const error = new Error("Database error");
            mockTodosService.create.mockRejectedValue(error as never);

            await expect(
                controller.create(createTodoData as never, mockRequest),
            ).rejects.toThrow("Database error");
        });
    });

    describe("findAll", () => {
        it("should return all todos for user", async () => {
            const todos = [mockTodo, {...mockTodo, id: "2"}];
            mockTodosService.findAll.mockResolvedValue(todos as never);

            const result = await controller.findAll(mockRequest);

            expect(mockTodosService.findAll).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(todos);
            expect(result).toHaveLength(2);
        });

        it("should return empty array if no todos", async () => {
            mockTodosService.findAll.mockResolvedValue([] as never);

            const result = await controller.findAll(mockRequest);

            expect(mockTodosService.findAll).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });

    describe("findOne", () => {
        it("should return todo with comments by id", async () => {
            const todoWithComments = {...mockTodo, comments: []};
            mockTodosService.findTodoWithComments.mockResolvedValue(
                todoWithComments as never,
            );

            const result = await controller.findOne("1");

            expect(mockTodosService.findTodoWithComments).toHaveBeenCalledWith(
                "1",
            );
            expect(result).toEqual(todoWithComments);
        });

        it("should throw error if service throws", async () => {
            const error = new Error("Todo not found");
            mockTodosService.findTodoWithComments.mockRejectedValue(
                error as never,
            );

            await expect(controller.findOne("999")).rejects.toThrow(
                "Todo not found",
            );
        });
    });

    describe("update", () => {
        it("should update todo", async () => {
            const updateData = {title: "Updated Todo"};
            const updatedTodo = {...mockTodo, ...updateData};
            mockTodosService.update.mockResolvedValue(updatedTodo as never);

            const result = await controller.update("1", updateData);

            expect(mockTodosService.update).toHaveBeenCalledWith(
                "1",
                updateData,
            );
            expect(result).toEqual(updatedTodo);
        });

        it("should throw NotFoundException if todo not found", async () => {
            mockTodosService.update.mockRejectedValue(
                new NotFoundException("Todo not found") as never,
            );

            await expect(
                controller.update("999", {title: "Updated"}),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
