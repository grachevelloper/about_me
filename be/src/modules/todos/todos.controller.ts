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
    Post,
    UseGuards,
} from "@nestjs/common";
import {CurrentUser} from "src/shared/decorators/current-user.decorator";
import {AuthGuard} from "src/shared/guards/auth.guard";
import {AuthenticatedUser} from "src/types";

import {CreateTodoDto, UpdateTodoDto} from "./todo.dto";
import {TodosService} from "./todos.service";

@UseGuards(AuthGuard)
@Controller("todos")
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Post()
    async create(
        @Body() createTodoData: CreateTodoDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return await this.todosService.create({
            data: createTodoData,
            actor: user,
        });
    }

    @Get()
    async findAll(@CurrentUser() user: AuthenticatedUser) {
        return await this.todosService.findAll(user.id);
    }

    @Get(":id")
    async findOne(
        @Param("id", ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.todosService.findOne({id, actor: user});
    }

    @Patch(":id")
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateTodo: UpdateTodoDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.todosService.update({id, data: updateTodo, actor: user});
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param("id", ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        await this.todosService.delete({id, actor: user});
    }
}
