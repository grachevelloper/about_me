import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {ChecklistsModule} from "./checklists/checklist.module";
import {TodosController} from "./todos.controller";
import {Todo} from "./todos.entity";
import {TodosService} from "./todos.service";

@Module({
    imports: [TypeOrmModule.forFeature([Todo]), ChecklistsModule],
    controllers: [TodosController],
    providers: [TodosService],
    exports: [TodosService],
})
export class TodosModule {}
