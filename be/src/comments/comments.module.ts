import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UsersModule} from "../users/users.module";
import {CommentsController} from "./comments.controller";
import {Comment} from "./comments.entity";
import {CommentsService} from "./comments.service";

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), UsersModule],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService],
})
export class CommentsModule {}
