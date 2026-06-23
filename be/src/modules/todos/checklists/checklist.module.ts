import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {Todo} from "../todos.entity";
import {ChecklistController} from "./checklists.controller";
import {CheckList} from "./checklists.entity";
import {ChecklistService} from "./checklists.service";

@Module({
    imports: [TypeOrmModule.forFeature([CheckList, Todo])],
    controllers: [ChecklistController],
    providers: [ChecklistService],
    exports: [ChecklistService],
})
export class ChecklistsModule {}
