import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    HttpCode,
    HttpStatus,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseUUIDPipe,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";

import {AuthGuard} from "../../shared/guards/auth.guard";
import {AttachmentResponseDto, CreateAttachmentDto} from "./attachments.dto";
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
    ): Promise<AttachmentResponseDto> {
        return this.attachmentsService.attachImage(
            file,
            createData.entityType,
            createData.entityId,
        );
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
        await this.attachmentsService.deleteAttachmentById(id);
    }
}
