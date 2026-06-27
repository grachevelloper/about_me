import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {AttachmentModule} from "../attachments/attachments.module";
import {UsersController} from "./users.controller";
import {User} from "./users.entity";
import {UsersService} from "./users.service";

@Module({
    imports: [TypeOrmModule.forFeature([User]), AttachmentModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
