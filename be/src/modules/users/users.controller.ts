import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    UseGuards,
} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";

import {CurrentUser} from "../../shared/decorators/current-user.decorator";
import {Roles} from "../../shared/decorators/role.decorator";
import {RolesGuard} from "../../shared/guards/roles.guard";
import {AuthenticatedUser, Role} from "../../types";
import {UserResponseDto} from "./dto/user-response.dto";
import {ChangePasswordDto, UpdateUserDto} from "./user.dto";
import {UsersMapper} from "./users.mapper";
import {UsersService} from "./users.service";

@ApiTags("Users")
@Controller("users")
@UseGuards(RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id")
    async findOne(
        @Param("id", ParseUUIDPipe) id: string,
        @CurrentUser() actor: AuthenticatedUser,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.findForActor(id, actor);
        return UsersMapper.toResponse(user);
    }

    @Patch(":id")
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
        @CurrentUser() actor: AuthenticatedUser,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.update(id, updateUserDto, actor);
        return UsersMapper.toResponse(user);
    }

    @Patch(":id/password")
    @HttpCode(HttpStatus.NO_CONTENT)
    async changePassword(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() changePasswordDto: ChangePasswordDto,
        @CurrentUser() actor: AuthenticatedUser,
    ): Promise<void> {
        await this.usersService.changePassword(
            id,
            changePasswordDto.password,
            actor,
        );
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param("id", ParseUUIDPipe) id: string,
        @CurrentUser() actor: AuthenticatedUser,
    ): Promise<void> {
        await this.usersService.delete(id, actor);
    }
}
