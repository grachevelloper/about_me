import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {AggregateDeletionModule} from "../../processes/aggregate-deletion/aggregate-deletion.module";
import {UsersController} from "./users.controller";
import {User} from "./users.entity";
import {UsersService} from "./users.service";

@Module({
    imports: [TypeOrmModule.forFeature([User]), AggregateDeletionModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
