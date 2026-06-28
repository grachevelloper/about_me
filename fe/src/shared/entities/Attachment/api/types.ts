export type EntityAttachmentType = 'article' | 'todo' | 'user';

export interface AttachmentResponse {
    id: string;
    url: string;
    mimeType: string;
    size: number;
    createdAt: string;
}

export interface AttachmentsApi {
    uploadAttachment: (
        entityType: EntityAttachmentType,
        entityId: string,
        file: File
    ) => Promise<AttachmentResponse>;
    deleteAttachment: (id: string) => Promise<void>;
}
