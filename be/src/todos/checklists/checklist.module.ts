import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {ChecklistController} from "./checklists.controller";
import {CheckList} from "./checklists.entity";
import {ChecklistService} from "./checklists.service";

@Module({
    imports: [TypeOrmModule.forFeature([CheckList])],
    controllers: [ChecklistController],
    providers: [ChecklistService],
    exports: [ChecklistService],
})
export class ChecklistsModule {}
