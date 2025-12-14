import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import {AuthGuard} from "src/shared/guards/auth.guard";

import {ArticlesModule} from "@/articles/articles.module";
import {TagsModule} from "@/articles/tags/tags.module";
import {AttachmentModule} from "@/attachments/attachments.module";
import {AuthModule} from "@/auth/auth.module";
import {CommentsModule} from "@/comments/comments.module";
import {LikesModule} from "@/likes/likes.module";
import {TodosModule} from "@/todos/todos.module";
import {UsersModule} from "@/users/users.module";

import {S3StorageService} from "../../shared/storage/s3/s3.service";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import dataSourceOptions from "./data-source";

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ["../.env"],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                ...dataSourceOptions,
                autoLoadEntities: true,
                migrationsRun: true,
                migrationsTableName: "migrations",
            }),
            inject: [ConfigService],
        }),
        TodosModule,
        AuthModule,
        UsersModule,
        LikesModule,
        CommentsModule,
        ArticlesModule,
        TagsModule,
        AttachmentModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        S3StorageService,
    ],
    exports: [S3StorageService],
})
export class AppModule {}
