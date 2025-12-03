import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ArticlesModule} from "./articles/articles.module";
import {AuthModule} from "./auth/auth.module";
import {AuthGuard} from "./auth/guards/auth.guard";
import {CommentsModule} from "./comments/comments.module";
import dataSourceOptions from "./data-source";
import {LikesModule} from "./likes/likes.module";
import {TodosModule} from "./todos/todos.module";
import {UsersModule} from "./users/users.module";

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
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
