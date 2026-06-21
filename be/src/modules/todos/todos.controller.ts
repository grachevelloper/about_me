import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import {CurrentUser} from "src/shared/decorators/current-user.decorator";
import {AuthGuard} from "src/shared/guards/auth.guard";
import {AuthenticatedUser} from "src/types";

import type {CreateTodoDto, UpdateTodoDto} from "./todo.interface";
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
        const createTodoDataWithUserId: CreateTodoDto = {
            ...createTodoData,
            authorId: user.id,
        };

        return await this.todosService.create(createTodoDataWithUserId);
    }

    @Get()
    async findAll(@CurrentUser() user: AuthenticatedUser) {
        return await this.todosService.findAll(user.id);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.todosService.findTodoWithComments(id);
    }
    @Patch(":id")
    async update(@Param("id") id: string, updateTodo: UpdateTodoDto) {
        return this.todosService.update(id, updateTodo);
    }
}
