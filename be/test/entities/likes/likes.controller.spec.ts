import {describe, expect, it, jest} from "@jest/globals";
import {HttpStatus, ParseEnumPipe, ParseUUIDPipe} from "@nestjs/common";
import {HTTP_CODE_METADATA, ROUTE_ARGS_METADATA} from "@nestjs/common/constants";
import {LikesController} from "src/modules/likes/likes.controller";
import {LikesService} from "src/modules/likes/likes.service";
import {AuthenticatedUser, Role} from "src/types";

describe("LikesController", () => {
    const actor = {
        id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        role: Role.USER,
    } as AuthenticatedUser;
    const entityId = "92c130b1-1c47-4a0c-8a1c-e79cc39282ad";

    it("creates a like from route params and authenticated user", async () => {
        const service = {
            create: jest.fn<LikesService["create"]>().mockResolvedValue({} as never),
        } as unknown as LikesService;
        const controller = new LikesController(service);

        await controller.create(actor, "article", entityId);

        expect(service.create).toHaveBeenCalledWith({
            actor,
            entityType: "article",
            entityId,
        });
    });

    it("deletes a like from route params and authenticated user", async () => {
        const service = {
            delete: jest.fn<LikesService["delete"]>().mockResolvedValue(undefined),
        } as unknown as LikesService;
        const controller = new LikesController(service);

        await controller.delete(actor, "todo", entityId);

        expect(service.delete).toHaveBeenCalledWith({
            actor,
            entityType: "todo",
            entityId,
        });
    });

    it("declares no-content status for deletion", () => {
        expect(
            Reflect.getMetadata(HTTP_CODE_METADATA, LikesController.prototype.delete),
        ).toBe(HttpStatus.NO_CONTENT);
    });

    it("uses UUID parsing for entity id route parameters", () => {
        const routeArgs = Reflect.getMetadata(
            ROUTE_ARGS_METADATA,
            LikesController,
            "create",
        ) as Record<string, {pipes?: unknown[]}>;
        const entityIdParam = Object.values(routeArgs).find((metadata) =>
            metadata.pipes?.some((pipe) => pipe === ParseUUIDPipe),
        );

        expect(entityIdParam).toBeDefined();
    });

    it("uses enum parsing for entity type route parameters", () => {
        const routeArgs = Reflect.getMetadata(
            ROUTE_ARGS_METADATA,
            LikesController,
            "create",
        ) as Record<string, {pipes?: unknown[]}>;
        const entityTypeParam = Object.values(routeArgs).find((metadata) =>
            metadata.pipes?.some((pipe) => pipe instanceof ParseEnumPipe),
        );

        expect(entityTypeParam).toBeDefined();
    });
});
