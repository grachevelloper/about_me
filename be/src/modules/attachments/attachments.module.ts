import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {Article} from "@/articles/articles.entity";
import {S3Module} from "@/shared/storage/s3/s3.module";
import {Todo} from "@/todos/todos.entity";
import {User} from "@/users/users.entity";

import {AttachmentsController} from "./attachments.controller";
import {Attachment} from "./attachments.entity";
import {AttachmentsService} from "./attachments.service";

@Module({
    imports: [TypeOrmModule.forFeature([Attachment, Article, Todo, User]), S3Module],
    controllers: [AttachmentsController],
    providers: [AttachmentsService],
    exports: [AttachmentsService],
})
export class AttachmentModule {}
