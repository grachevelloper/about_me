import {IsEnum, IsUUID} from "class-validator";

export type EntityAttachmentType = "user" | "article" | "todo";

export class CreateAttachmentDto {
    @IsEnum(["user", "article", "todo"])
    entityType!: EntityAttachmentType;

    @IsUUID()
    entityId!: string;
}

export class AttachmentResponseDto {
    id!: string;
    url!: string;
    entityType!: EntityAttachmentType;
    entityId!: string;
    createdAt!: string;
}
