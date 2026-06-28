import {IsEnum, IsUUID} from "class-validator";

export const ATTACHMENT_TARGET_TYPES = ["user", "article", "todo"] as const;

export type EntityAttachmentType = (typeof ATTACHMENT_TARGET_TYPES)[number];

export class CreateAttachmentDto {
    @IsEnum(ATTACHMENT_TARGET_TYPES)
    entityType!: EntityAttachmentType;

    @IsUUID()
    entityId!: string;
}

export class AttachmentResponseDto {
    id!: string;
    url!: string;
    mimeType!: string;
    size!: number;
    entityType!: EntityAttachmentType;
    entityId!: string;
    createdAt!: string;
}
