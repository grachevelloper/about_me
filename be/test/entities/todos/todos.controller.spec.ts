import {describe, expect, it, jest} from "@jest/globals";
import {HttpStatus, ParseUUIDPipe} from "@nestjs/common";
import {HTTP_CODE_METADATA, ROUTE_ARGS_METADATA} from "@nestjs/common/constants";
import {TodosController} from "src/modules/todos/todos.controller";
import {TodosService} from "src/modules/todos/todos.service";
import {IS_PUBLIC_KEY} from "src/shared/decorators/auth.decorator";
import {AuthenticatedUser, Role} from "src/types";

describe("TodosController", () => {
    const actor = {
        id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        role: Role.USER,
    } as AuthenticatedUser;

    it("passes create body and actor to the service without trusting author fields", async () => {
        const service = {
            create: jest.fn<TodosService["create"]>().mockResolvedValue({} as never),
        } as unknown as TodosService;
        const controller = new TodosController(service);
        const body = {
            title: "Read",
            content: "Read docs",
        };

        await controller.create(body, actor);

        expect(service.create).toHaveBeenCalledWith({data: body, actor});
    });

    it("passes update body and actor to the service", async () => {
        const service = {
            update: jest.fn<TodosService["update"]>().mockResolvedValue({} as never),
        } as unknown as TodosService;
        const controller = new TodosController(service);
        const body = {title: "Updated"};

        await controller.update("82c130b1-1c47-4a0c-8a1c-e79cc39282ad", body, actor);

        expect(service.update).toHaveBeenCalledWith({
            id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
            data: body,
            actor,
        });
    });

    it("exposes list endpoint publicly and passes only pagination query to the service", async () => {
        const service = {
            findAll: jest.fn<TodosService["findAll"]>().mockResolvedValue({
                items: [],
                page: 1,
                limit: 10,
                total: 0,
                hasNext: false,
            }),
        } as unknown as TodosService;
        const controller = new TodosController(service);
        const query = {page: 1, limit: 10};

        await controller.findAll(query);

        expect(
            Reflect.getMetadata(IS_PUBLIC_KEY, TodosController.prototype.findAll),
        ).toBe(true);
        expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it("exposes detail endpoint publicly and passes only todo id to the service", async () => {
        const service = {
            findOne: jest.fn<TodosService["findOne"]>().mockResolvedValue({} as never),
        } as unknown as TodosService;
        const controller = new TodosController(service);

        await controller.findOne("82c130b1-1c47-4a0c-8a1c-e79cc39282ad");

        expect(
            Reflect.getMetadata(IS_PUBLIC_KEY, TodosController.prototype.findOne),
        ).toBe(true);
        expect(service.findOne).toHaveBeenCalledWith({
            id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        });
    });

    it("declares no-content status for deletion", () => {
        expect(
            Reflect.getMetadata(HTTP_CODE_METADATA, TodosController.prototype.delete),
        ).toBe(HttpStatus.NO_CONTENT);
    });

    it("uses UUID parsing for todo id route parameters", () => {
        const routeArgs = Reflect.getMetadata(
            ROUTE_ARGS_METADATA,
            TodosController,
            "update",
        ) as Record<string, {pipes?: unknown[]}>;
        const idParam = Object.values(routeArgs).find(
            (metadata) =>
                metadata.pipes?.some((pipe) => pipe === ParseUUIDPipe),
        );

        expect(idParam).toBeDefined();
    });
});
