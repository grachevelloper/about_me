import {afterEach, beforeEach, describe, expect, it, jest} from "@jest/globals";
import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {NextFunction, Request, Response} from "express";
import {configureApplication} from "src/app/application-setup";
import {ChecklistController} from "src/modules/todos/checklists/checklists.controller";
import {ChecklistService} from "src/modules/todos/checklists/checklists.service";
import {AuthenticatedUser, Role} from "src/types";
import request from "supertest";

describe("ChecklistController validation", () => {
    let app: INestApplication;

    const checklistService = {
        addItem: jest.fn(),
        create: jest.fn(),
        deleteChecklist: jest.fn(),
        getByTodoId: jest.fn(),
        updateProgress: jest.fn(),
        updateItemText: jest.fn(),
    };
    const todoId = "82c130b1-1c47-4a0c-8a1c-e79cc39282ad";
    const actor = {
        id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        role: Role.USER,
    } as AuthenticatedUser;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ChecklistController],
            providers: [
                {
                    provide: ChecklistService,
                    useValue: checklistService,
                },
            ],
        }).compile();

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

    it("accepts a valid checklist item", async () => {
        checklistService.addItem.mockResolvedValue(undefined as never);

        await request(app.getHttpServer())
            .post(`/api/todos/${todoId}/checklist/items`)
            .send({text: "read"})
            .expect(201);

        expect(checklistService.addItem).toHaveBeenCalledWith({
            todoId,
            text: "read",
            actor,
        });
    });

    it("transforms a valid progress delta", async () => {
        checklistService.updateProgress.mockResolvedValue(undefined as never);

        await request(app.getHttpServer())
            .patch(`/api/todos/${todoId}/checklist/progress`)
            .send({delta: "1"})
            .expect(200);

        expect(checklistService.updateProgress).toHaveBeenCalledWith({
            todoId,
            delta: 1,
            actor,
        });
    });

    it("transforms item indexes to numbers", async () => {
        checklistService.updateItemText.mockResolvedValue(undefined as never);

        await request(app.getHttpServer())
            .patch(`/api/todos/${todoId}/checklist/items/2`)
            .send({text: "updated"})
            .expect(200);

        expect(checklistService.updateItemText).toHaveBeenCalledWith({
            todoId,
            itemIndex: 2,
            text: "updated",
            actor,
        });
    });

    it("rejects an invalid todo id before calling the checklist service", async () => {
        await request(app.getHttpServer())
            .post("/api/todos/not-a-uuid/checklist/items")
            .send({text: "read"})
            .expect(400);

        expect(checklistService.addItem).not.toHaveBeenCalled();
    });
});
