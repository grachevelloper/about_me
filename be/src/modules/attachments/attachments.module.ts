import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {AttachmentsController} from "./attachments.controller";
import {Attachment} from "./attachments.entity";
import {AttachmentsService} from "./attachments.service";

@Module({
    imports: [TypeOrmModule.forFeature([Attachment])],
    controllers: [AttachmentsController],
    providers: [AttachmentsService],
    exports: [AttachmentsService],
})
export class AttachmentModule {}
