import {afterEach, beforeEach, describe, expect, it, jest} from "@jest/globals";
import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {configureApplication} from "src/app/application-setup";
import {ChecklistController} from "src/modules/todos/checklists/checklists.controller";
import {ChecklistService} from "src/modules/todos/checklists/checklists.service";
import request from "supertest";

describe("ChecklistController validation", () => {
    let app: INestApplication;

    const checklistService = {
        addItem: jest.fn(),
        updateProgress: jest.fn(),
    };

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
            .post("/api/todos/todo-1/checklist/items")
            .send({text: "read"})
            .expect(201);

        expect(checklistService.addItem).toHaveBeenCalledWith("todo-1", "read");
    });

    it("transforms a valid progress delta", async () => {
        checklistService.updateProgress.mockResolvedValue(undefined as never);

        await request(app.getHttpServer())
            .patch("/api/todos/todo-1/checklist/progress")
            .send({delta: "1"})
            .expect(200);

        expect(checklistService.updateProgress).toHaveBeenCalledWith(
            "todo-1",
            1,
        );
    });
});
