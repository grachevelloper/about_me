import { registerAs } from "@nestjs/config";

const { S3_KEY_ID, S3_SECRET_ACCESS_KEY, S3_TENANT_ID, S3_PUBLIC_DOMAIN } = process.env;

export default registerAs("s3", () => ({
    endpoint: "https://s3.cloud.ru",
    region: "ru-central-1",
    bucket: "gracheveloper-bucket",
    publicDomain: S3_PUBLIC_DOMAIN,
    credentials: {
        accessKeyId: `${S3_TENANT_ID}:${S3_KEY_ID}`,
        secretAccessKey: S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
}));
