import {IsEnum, IsString} from "class-validator";

export type EntityAttachmentType = "user" | "article" | "todo";

export class CreateAttachmentDto {
    @IsEnum(["user", "article", "todo"])
    entityType: EntityAttachmentType;

    @IsString()
    entityId: string;
}
