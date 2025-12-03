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
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

import {AuthGuard} from "../auth/guards/auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../decorators/role.decorator";
import {Role} from "../types";
import {UpdateUserDto} from "./dto";
import {User} from "./users.entity";
import {UsersService} from "./users.service";

@ApiTags("Users")
@Controller("users")
@UseGuards(RolesGuard, AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id")
    @ApiOperation({summary: "Получить пользователя по ID"})
    @ApiOkResponse({
        description: "Пользователь найден",
        type: User,
    })
    @ApiNotFoundResponse({description: "Пользователь не найден"})
    async findById(@Param("id", ParseUUIDPipe) id: string): Promise<User> {
        return await this.usersService.findById(id);
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновить данные пользователя"})
    @ApiOkResponse({
        description: "Данные пользователя обновлены",
        type: User,
    })
    @ApiNotFoundResponse({description: "Пользователь не найден"})
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return await this.usersService.update(id, updateUserDto);
    }

    @Patch(":id/password")
    @ApiOperation({summary: "Изменить пароль пользователя"})
    @ApiOkResponse({description: "Пароль успешно изменен"})
    @ApiNotFoundResponse({description: "Пользователь не найден"})
    async changePassword(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() newPassword: string,
    ): Promise<{message: string}> {
        await this.usersService.changePassword(id, newPassword);
        return {message: "Пароль успешно изменен"};
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    @ApiOperation({summary: "Удалить пользователя (только для админов)"})
    @ApiOkResponse({description: "Пользователь успешно удален"})
    @ApiNotFoundResponse({description: "Пользователь не найден"})
    async delete(
        @Param("id", ParseUUIDPipe) id: string,
    ): Promise<{message: string}> {
        await this.usersService.delete(id);
        return {message: "Пользователь успешно удален"};
    }
}
