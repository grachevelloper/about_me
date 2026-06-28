export const ATTACHMENT_TARGET_TYPES = ["user", "article", "todo"] as const;

export type EntityAttachmentType = (typeof ATTACHMENT_TARGET_TYPES)[number];

export class AttachmentResponseDto {
    id!: string;
    url!: string;
    mimeType!: string;
    size!: number;
    createdAt!: string;
}
