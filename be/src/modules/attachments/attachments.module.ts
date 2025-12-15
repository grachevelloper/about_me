import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {S3Module} from "@/shared/storage/s3/s3.module";

import {AttachmentsController} from "./attachments.controller";
import {Attachment} from "./attachments.entity";
import {AttachmentsService} from "./attachments.service";

@Module({
    imports: [TypeOrmModule.forFeature([Attachment]), S3Module],
    controllers: [AttachmentsController],
    providers: [AttachmentsService],
    exports: [AttachmentsService],
})
export class AttachmentModule {}
