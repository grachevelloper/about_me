import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {S3StorageService} from "../../shared/storage/s3/s3.service";
import {EntityAttachmentType} from "./attachments.dto";
import {Attachment} from "./attachments.entity";

@Injectable()
export class AttachmentsService {
    constructor(
        @InjectRepository(Attachment)
        private attachmentsRepo: Repository<Attachment>,
        private s3Service: S3StorageService,
    ) {}

    async attachImage(
        file: Express.Multer.File,
        entityType: EntityAttachmentType,
        entityId: string,
    ) {
        return this.attachmentsRepo.manager.transaction(
            async (transactionalEntityManager) => {
                let s3Key: string | null = null;

                try {
                    const uploadResult = await this.s3Service.upload(file);
                    s3Key = uploadResult.key;

                    const attachment = this.attachmentsRepo.create({
                        url: uploadResult.url,
                        s3Key: uploadResult.key,
                        entityType,
                        entityId,
                    });

                    const savedAttachment =
                        await transactionalEntityManager.save(attachment);

                    return savedAttachment;
                } catch (error) {
                    if (s3Key) {
                        try {
                            await this.s3Service.delete(s3Key);
                        } catch (deleteError) {
                            console.error(
                                "Failed to delete from S3:",
                                deleteError,
                            );
                        }
                    }

                    throw error;
                }
            },
        );
    }

    async getEntityImages(entityType: EntityAttachmentType, entityId: string) {
        return this.attachmentsRepo.find({
            where: {entityType, entityId},
        });
    }

    async deleteEntityImages(
        entityType: EntityAttachmentType,
        entityId: string,
    ) {
        const result = await this.deleteEntityFiles(entityType, entityId);
        await this.attachmentsRepo.delete({
            entityType,
            entityId,
        });

        return result;
    }

    async deleteEntityFiles(
        entityType: EntityAttachmentType,
        entityId: string,
    ) {
        const attachments = await this.getEntityImages(entityType, entityId);

        try {
            await Promise.all(
                attachments.map((att) => this.s3Service.delete(att.s3Key)),
            );

            return {deleted: attachments.length};
        } catch (error) {
            console.error("Failed to delete entity images", {
                entityType,
                entityId,
                error,
                attachmentsCount: attachments.length,
            });

            throw error;
        }
    }

    async deleteAttachmentByS3Key(s3Key: string) {
        const attachment = await this.attachmentsRepo.findOneBy({s3Key});

        if (!attachment) {
            throw new Error("Attachment not found");
        }

        await this.s3Service.delete(s3Key);
        await this.attachmentsRepo.delete({s3Key});

        return {deleted: s3Key};
    }

    async deleteAttachmentByUrl(url: string) {
        const attachment = await this.attachmentsRepo.findOneBy({url});

        if (!attachment) {
            throw new Error("Attachment not found");
        }

        await this.s3Service.delete(attachment.s3Key);
        await this.attachmentsRepo.delete({url});

        return {deleted: attachment.s3Key};
    }
}
