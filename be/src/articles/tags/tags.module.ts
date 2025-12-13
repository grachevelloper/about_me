import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {TagsController} from "./tags.contoroller";
import {Tag} from "./tags.entity";
import {TagsService} from "./tags.service";

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    controllers: [TagsController],
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule {}
