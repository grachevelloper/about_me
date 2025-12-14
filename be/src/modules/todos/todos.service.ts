import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {TodoState} from "@/types/todo";

import {CommentsService} from "../comments/comments.service";
import {CreateTodoDto, UpdateTodoDto} from "./todo.interface";
import {Todo} from "./todos.entity";

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>,
        private commentsService: CommentsService,
    ) {}

    async create(createTodoData: CreateTodoDto): Promise<Todo> {
        const todo = this.todosRepository.create(createTodoData);
        return await this.todosRepository.save(todo);
    }

    async delete(id: string): Promise<void> {
        const todo = await this.todosRepository.findOne({where: {id}});
        if (!todo) {
            throw new NotFoundException("Todo not found");
        }
        await this.todosRepository.delete(id);
    }

    async update(id: string, updatedTodo: UpdateTodoDto): Promise<Todo> {
        const todo = await this.todosRepository.findOne({where: {id}});
        if (!todo) {
            throw new NotFoundException("Todo not found");
        }

        Object.assign(todo, updatedTodo);
        return this.todosRepository.save(todo);
    }

    async incrementLikesCount(todoId: string): Promise<void> {
        await this.todosRepository
            .createQueryBuilder()
            .update(Todo)
            .set({
                likesCount: () => "likesCount + 1",
            })
            .where("id = :todoId", {todoId})
            .execute();
    }

    async decrementLikesCount(todoId: string): Promise<void> {
        await this.todosRepository
            .createQueryBuilder()
            .update(Todo)
            .set({
                likesCount: () => "likesCount - 1",
            })
            .where("id = :todoId", {todoId})
            .andWhere("likesCount > 0")
            .execute();
    }

    async findOne(id: string): Promise<Todo> {
        const todo = await this.todosRepository.findOne({where: {id}});
        if (!todo) {
            throw new NotFoundException("Todo not found");
        }
        return todo;
    }

    async findAll(authorId: string): Promise<Todo[]> {
        const todos = await this.todosRepository.find({where: {authorId}});
        return todos;
    }

    async findActive(authorId: string): Promise<Todo[]> {
        const todos = await this.todosRepository.find({
            where: {
                state: TodoState.IN_WORK,
                authorId,
            },
        });
        return todos;
    }

    async findTodoWithComments(todoId: string) {
        const [todo, comments] = await Promise.all([
            this.todosRepository.findOne({where: {id: todoId}}),
            this.commentsService.findByEntity("todo", todoId),
        ]);
        return {...todo, comments};
    }
}
