import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {CommentsModule} from "../comments/comments.module";
import {TodosModule} from "../todos/todos.module";
import {UsersModule} from "../users/users.module";
import {LikesController} from "./likes.controller";
import {Like} from "./likes.entity";
import {LikesService} from "./likes.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Like]),
        TodosModule,
        CommentsModule,
        UsersModule,
    ],
    controllers: [LikesController],
    providers: [LikesService],
    exports: [LikesService],
})
export class LikesModule {}
