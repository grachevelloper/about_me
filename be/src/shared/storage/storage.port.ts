export const STORAGE_PORT = Symbol("STORAGE_PORT");

export interface StorageUploadFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

export interface StorageUploadResult {
    url: string;
    key: string;
    mimeType: string;
    size: number;
}

export interface StoragePort {
    upload(file: StorageUploadFile): Promise<StorageUploadResult>;
    delete(key: string): Promise<void>;
}
