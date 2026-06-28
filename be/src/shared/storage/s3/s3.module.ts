import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";

import {STORAGE_PORT} from "../storage.port";
import {S3StorageService} from "./s3.service";

@Module({
    imports: [ConfigModule],
    providers: [
        S3StorageService,
        {
            provide: STORAGE_PORT,
            useExisting: S3StorageService,
        },
    ],
    exports: [S3StorageService, STORAGE_PORT],
})
export class S3Module {}
