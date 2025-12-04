import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UsersModule} from "../users/users.module";
import {ArticlesController} from "./articles.controller";
import {Article} from "./articles.entity";
import {ArticlesService} from "./articles.service";
import {Tag} from "./tag.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Article, Tag]), UsersModule],
    controllers: [ArticlesController],
    providers: [ArticlesService],
    exports: [ArticlesService],
})
export class ArticlesModule {}
