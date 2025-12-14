import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

import {generateKey} from "../../utils/generate";
import {FileUpload, S3Config, UploadResult} from "./s3.interface";

@Injectable()
export class S3StorageService {
    private readonly logger = new Logger(S3StorageService.name);
    private s3Client: S3Client;
    private bucket: string;
    private publicDomain: string;

    constructor(private configService: ConfigService) {
        const s3Config: S3Config = this.configService.get("s3")!;

        if (!s3Config) {
            throw new Error("S3 configuration not found");
        }

        this.s3Client = new S3Client({
            endpoint: s3Config.endpoint,
            region: s3Config.region,
            credentials: s3Config.credentials,
            forcePathStyle: true,
        });

        this.bucket = s3Config.bucket;
        this.publicDomain = s3Config.publicDomain;

        this.logger.log(`S3 Storage initialized for bucket: ${this.bucket}`);
    }

    async upload(file: FileUpload): Promise<UploadResult> {
        const key = generateKey(file.originalname);

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        return {
            url: `${this.publicDomain}/${key}`,
            key,
            size: file.size,
        };
    }

    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        await this.s3Client.send(command);
    }

    async get(key: string): Promise<{buffer: Buffer; contentType?: string}> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            const response = await this.s3Client.send(command);

            if (!response.Body) {
                throw new NotFoundException(`File with key "${key}" not found`);
            }

            const chunks: Uint8Array[] = [];
            for await (const chunk of response.Body as any) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            return {
                buffer,
                contentType: response.ContentType,
            };
        } catch (error) {
            if (error.name === "NoSuchKey" || error.name === "NotFound") {
                throw new NotFoundException(`File with key "${key}" not found`);
            }
            throw error;
        }
    }

    getUrl(key: string): string {
        return `${this.publicDomain}/${key}`;
    }
}
