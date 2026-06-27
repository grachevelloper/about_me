import {describe, expect, it, jest} from "@jest/globals";
import {HttpStatus, ParseUUIDPipe} from "@nestjs/common";
import {HTTP_CODE_METADATA, ROUTE_ARGS_METADATA} from "@nestjs/common/constants";
import {AttachmentsController} from "src/modules/attachments/attachments.controller";
import {AttachmentsService} from "src/modules/attachments/attachments.service";

describe("AttachmentsController", () => {
    it("deletes attachments by id with no-content status", async () => {
        const service = {
            deleteAttachmentById: jest
                .fn<AttachmentsService["deleteAttachmentById"]>()
                .mockResolvedValue(undefined),
        } as unknown as AttachmentsService;
        const controller = new AttachmentsController(service);
        const id = "82c130b1-1c47-4a0c-8a1c-e79cc39282ad";

        await controller.delete(id);

        expect(service.deleteAttachmentById).toHaveBeenCalledWith(id);
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
});
