import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";

import {AuthGuard} from "../../shared/guards/auth.guard";
import {CreateAttachmentDto} from "./attachments.interface";
import {AttachmentsService} from "./attachments.service";

@UseGuards(AuthGuard)
@Controller("attachments")
export class AttachmentsController {
    constructor(private attachmentsService: AttachmentsService) {}

    @Post(":entityType/:entityId")
    @UseInterceptors(FileInterceptor("file"))
    async upload(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({maxSize: 10 * 1024 * 1024}),
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|webp)$/,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Param() createData: CreateAttachmentDto,
    ) {
        return this.attachmentsService.attachImage(
            file,
            createData.entityType,
            createData.entityId,
        );
    }

    @Delete(":url")
    @UseInterceptors(FileInterceptor("file"))
    async delete(@Param() url: string) {
        return this.attachmentsService.deleteAttachmentByUrl(url);
    }
}
