import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {NotFoundException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Attachment} from "src/modules/attachments/attachments.entity";
import {AttachmentsService} from "src/modules/attachments/attachments.service";
import {S3StorageService} from "src/shared/storage/s3/s3.service";
import {Repository} from "typeorm";

describe("AttachmentsService", () => {
    let service: AttachmentsService;
    let repository: jest.Mocked<Repository<Attachment>>;
    let s3: jest.Mocked<S3StorageService>;

    const attachment = Object.assign(new Attachment(), {
        id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        url: "https://cdn.example/image.png",
        s3Key: "private/image.png",
        entityType: "todo" as const,
        entityId: "a2b479e6-3cf8-464c-91ea-e2cf07bfe35f",
        createdAt: "2026-01-01T00:00:00.000Z",
    });
    const save = jest.fn<Repository<Attachment>["save"]>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AttachmentsService,
                {
                    provide: getRepositoryToken(Attachment),
                    useValue: {
                        create: jest.fn(),
                        delete: jest.fn(),
                        findOneBy: jest.fn(),
                        manager: {
                            transaction: jest.fn(
                                async (
                                    callback: (manager: {
                                        save: typeof save;
                                    }) => unknown,
                                ) => callback({save}),
                            ),
                        },
                    },
                },
                {
                    provide: S3StorageService,
                    useValue: {
                        delete: jest.fn(),
                        upload: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(AttachmentsService);
        repository = module.get(getRepositoryToken(Attachment));
        s3 = module.get(S3StorageService);
        save.mockResolvedValue(attachment);
    });

    it("returns upload response without exposing the internal s3 key", async () => {
        repository.create.mockReturnValue(attachment);
        s3.upload.mockResolvedValue({
            key: attachment.s3Key,
            size: 1024,
            url: attachment.url,
        });

        const response = await service.attachImage(
            {} as Express.Multer.File,
            "todo",
            attachment.entityId,
        );

        expect(response).toEqual({
            id: attachment.id,
            url: attachment.url,
            entityType: "todo",
            entityId: attachment.entityId,
            createdAt: attachment.createdAt,
        });
        expect(response).not.toHaveProperty("s3Key");
    });

    it("deletes storage before deleting attachment metadata", async () => {
        repository.findOneBy.mockResolvedValue(attachment);

        await service.deleteAttachmentById(attachment.id);

        expect(s3.delete).toHaveBeenCalledWith(attachment.s3Key);
        expect(repository.delete).toHaveBeenCalledWith({id: attachment.id});
    });

    it("returns not found for missing attachment delete", async () => {
        repository.findOneBy.mockResolvedValue(null);

        await expect(
            service.deleteAttachmentById(attachment.id),
        ).rejects.toBeInstanceOf(NotFoundException);
        expect(s3.delete).not.toHaveBeenCalled();
    });
});
