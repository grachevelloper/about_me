import {registerAs} from "@nestjs/config";

const {S3_ID_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_PUBLIC_DOMAIN} = process.env;

export default registerAs("s3", () => ({
    endpoint: "https://s3.buckets.ru",
    region: "ru-1",
    bucket: "gracheveloper",
    publicDomain: S3_PUBLIC_DOMAIN!,
    credentials: {
        accessKeyId: S3_ID_ACCESS_KEY!,
        secretAccessKey: S3_SECRET_ACCESS_KEY!,
    },
}));

export const BUCKET_NAME = "gracheveloper";
