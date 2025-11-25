import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {AuthModule} from "./auth/auth.module";
import {CommentsModule} from "./comments/comments.module";
import dataSourceOptions from "./data-source";
import {AuthGuard} from "./guards/auth.guard";
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
