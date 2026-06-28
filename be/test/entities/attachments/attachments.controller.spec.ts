import {describe, expect, it, jest} from "@jest/globals";
import {HttpStatus, ParseEnumPipe, ParseUUIDPipe} from "@nestjs/common";
import {HTTP_CODE_METADATA, ROUTE_ARGS_METADATA} from "@nestjs/common/constants";
import {AttachmentsController} from "src/modules/attachments/attachments.controller";
import {AttachmentsService} from "src/modules/attachments/attachments.service";
import {Role} from "src/types";

describe("AttachmentsController", () => {
    const actor = {
        id: "ef99be99-722e-438c-a9b9-ec6f7fb06e9d",
        role: Role.USER,
        iat: 0,
        exp: 0,
    };

    it("passes the authenticated user when deleting attachments by id", async () => {
        const service = {
            deleteAttachmentById: jest
                .fn<AttachmentsService["deleteAttachmentById"]>()
                .mockResolvedValue(undefined),
        } as unknown as AttachmentsService;
        const controller = new AttachmentsController(service);
        const id = "82c130b1-1c47-4a0c-8a1c-e79cc39282ad";

        await controller.delete(id, actor);

        expect(service.deleteAttachmentById).toHaveBeenCalledWith(id, actor);
        expect(
            Reflect.getMetadata(
                HTTP_CODE_METADATA,
                AttachmentsController.prototype.delete,
            ),
        ).toBe(HttpStatus.NO_CONTENT);
    });

    it("uses UUID parsing for delete route id", () => {
        const routeArgs = Reflect.getMetadata(
            ROUTE_ARGS_METADATA,
            AttachmentsController,
            "delete",
        ) as Record<string, {pipes?: unknown[]}>;
        const idParam = Object.values(routeArgs).find((metadata) =>
            metadata.pipes?.some((pipe) => pipe === ParseUUIDPipe),
        );

        expect(idParam).toBeDefined();
    });

    it("passes upload target and authenticated user to the service", async () => {
        const response = {
            id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
            url: "https://cdn.example/image.png",
            mimeType: "image/png",
            size: 1024,
            createdAt: "2026-01-01T00:00:00.000Z",
        };
        const entityId = "a2b479e6-3cf8-464c-91ea-e2cf07bfe35f";
        const service = {
            attachImage: jest
                .fn<AttachmentsService["attachImage"]>()
                .mockResolvedValue(response),
        } as unknown as AttachmentsService;
        const controller = new AttachmentsController(service);
        const file = {mimetype: "image/png", size: 1024} as Express.Multer.File;

        await expect(
            controller.upload(file, "todo", entityId, actor),
        ).resolves.toBe(response);

        expect(service.attachImage).toHaveBeenCalledWith(
            file,
            "todo",
            entityId,
            actor,
        );
    });

    it("uses enum and UUID parsing for upload target route params", () => {
        const routeArgs = Reflect.getMetadata(
            ROUTE_ARGS_METADATA,
            AttachmentsController,
            "upload",
        ) as Record<string, {pipes?: unknown[]}>;
        const params = Object.values(routeArgs);

        expect(
            params.some((metadata) =>
                metadata.pipes?.some((pipe) => pipe instanceof ParseEnumPipe),
            ),
        ).toBe(true);
        expect(
            params.some((metadata) =>
                metadata.pipes?.some((pipe) => pipe === ParseUUIDPipe),
            ),
        ).toBe(true);
    });
});
