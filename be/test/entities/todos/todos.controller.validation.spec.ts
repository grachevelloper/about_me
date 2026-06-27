import {afterEach, beforeEach, describe, expect, it, jest} from "@jest/globals";
import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {NextFunction, Request, Response} from "express";
import {configureApplication} from "src/app/application-setup";
import {TodosController} from "src/modules/todos/todos.controller";
import {TodosService} from "src/modules/todos/todos.service";
import {AuthGuard} from "src/shared/guards/auth.guard";
import {AuthenticatedUser, Role} from "src/types";
import {TodoPriority, TodoState} from "src/types/todo";
import request from "supertest";

describe("TodosController validation", () => {
    let app: INestApplication;

    const actor = {
        id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        role: Role.USER,
    } as AuthenticatedUser;
    const todosService = {
        create: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [TodosController],
            providers: [{provide: TodosService, useValue: todosService}],
        })
            .overrideGuard(AuthGuard)
            .useValue({canActivate: () => true})
            .compile();

        app = moduleRef.createNestApplication();
        app.use((req: Request, _res: Response, next: NextFunction) => {
            req.user = actor;
            next();
        });
        configureApplication(app);
        await app.init();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        await app.close();
    });

    it("accepts a valid todo create body", async () => {
        todosService.create.mockResolvedValue({id: "todo-1"} as never);

        await request(app.getHttpServer())
            .post("/api/todos")
            .send({
                title: "Read",
                content: "Read docs",
                priority: TodoPriority.HIGH,
                state: TodoState.IN_WORK,
            })
            .expect(201);

        expect(todosService.create).toHaveBeenCalledWith({
            data: {
                title: "Read",
                content: "Read docs",
                priority: TodoPriority.HIGH,
                state: TodoState.IN_WORK,
            },
            actor,
        });
    });

    it("rejects client-controlled todo fields", async () => {
        await request(app.getHttpServer())
            .post("/api/todos")
            .send({
                title: "Read",
                content: "Read docs",
                authorId: "client-controlled",
                likesCount: 10,
            })
            .expect(400);

        expect(todosService.create).not.toHaveBeenCalled();
    });

    it("rejects invalid todo enum values on update", async () => {
        await request(app.getHttpServer())
            .patch("/api/todos/82c130b1-1c47-4a0c-8a1c-e79cc39282ad")
            .send({state: "doing"})
            .expect(400);

        expect(todosService.update).not.toHaveBeenCalled();
    });

    it("transforms todo list pagination query", async () => {
        todosService.findAll.mockResolvedValue({
            items: [],
            page: 2,
            limit: 5,
            total: 0,
            hasNext: false,
        } as never);

        await request(app.getHttpServer())
            .get("/api/todos?page=2&limit=5")
            .expect(200);

        expect(todosService.findAll).toHaveBeenCalledWith(actor.id, {
            page: 2,
            limit: 5,
        });
    });
});
