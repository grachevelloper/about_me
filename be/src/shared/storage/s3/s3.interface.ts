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

export type {StorageUploadFile as FileUpload, StorageUploadResult as UploadResult} from "../storage.port";
