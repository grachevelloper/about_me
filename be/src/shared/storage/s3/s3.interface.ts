export interface S3Config {
    endpoint: string;
    region: string;
    bucket: string;
    publicDomain: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}

export interface FileUpload {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

export interface UploadResult {
    url: string;
    key: string;
    size: number;
}
