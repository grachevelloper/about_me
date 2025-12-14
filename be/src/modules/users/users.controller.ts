import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    UseGuards,
} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";

import {Roles} from "../../shared/decorators/role.decorator";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {RolesGuard} from "../../shared/guards/roles.guard";
import {Role} from "../../types";
import {UpdateUserDto} from "./user.interface";
import {User} from "./users.entity";
import {UsersService} from "./users.service";

@ApiTags("Users")
@Controller("users")
@UseGuards(RolesGuard, AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id")
    @Patch(":id")
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return await this.usersService.update(id, updateUserDto);
    }

    @Patch(":id/password")
    async changePassword(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() newPassword: string,
    ): Promise<{message: string}> {
        await this.usersService.changePassword(id, newPassword);
        return {message: "Пароль успешно изменен"};
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    async delete(
        @Param("id", ParseUUIDPipe) id: string,
    ): Promise<{message: string}> {
        await this.usersService.delete(id);
        return {message: "Пользователь успешно удален"};
    }
}
