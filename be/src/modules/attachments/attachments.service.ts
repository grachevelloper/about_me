import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {S3StorageService} from "../../shared/storage/s3/s3.service";
import {Attachment} from "./attachments.entity";
import {EntityAttachmentType} from "./attachments.interface";

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
        const uploadResult = await this.s3Service.upload(file);

        const attachment = this.attachmentsRepo.create({
            url: uploadResult.url,
            s3Key: uploadResult.key,
            entityType,
            entityId,
        });

        return this.attachmentsRepo.save(attachment);
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
        const attachments = await this.getEntityImages(entityType, entityId);

        try {
            await Promise.all(
                attachments.map((att) => this.s3Service.delete(att.s3Key)),
            );

            const result = await this.attachmentsRepo.delete({
                entityType,
                entityId,
            });

            return {deleted: result.affected || 0};
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
