import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {CommentsModule} from "../comments/comments.module";
import {ChecklistsModule} from "./checklists/checklist.module";
import {TodosController} from "./todos.controller";
import {Todo} from "./todos.entity";
import {TodosService} from "./todos.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Todo]),
        ChecklistsModule,
        CommentsModule,
    ],
    controllers: [TodosController],
    providers: [TodosService],
    exports: [TodosService],
})
export class TodosModule {}
