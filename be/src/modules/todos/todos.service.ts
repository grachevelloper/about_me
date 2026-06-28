import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthenticatedUser, Role} from "src/types";
import {Repository} from "typeorm";

import {PaginatedResponseDto} from "@/shared/dto/paginated-response.dto";
import {TodoState} from "@/types/todo";

import {AggregateDeletionService} from "../../processes/aggregate-deletion/aggregate-deletion.service";
import {CommentsService} from "../comments/comments.service";
import {CreateTodoDto, QueryTodosDto, ResponseGetTodos, UpdateTodoDto} from "./todo.dto";
import {Todo} from "./todos.entity";

interface CreateTodoCommand {
    actor: AuthenticatedUser;
    data: CreateTodoDto;
}

interface DeleteTodoCommand {
    actor: AuthenticatedUser;
    id: string;
}

interface FindTodoCommand {
    actor: AuthenticatedUser;
    id: string;
}

interface FindTodoWithCommentsCommand {
    actor: AuthenticatedUser;
    todoId: string;
}

interface UpdateTodoCommand {
    actor: AuthenticatedUser;
    data: UpdateTodoDto;
    id: string;
}

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>,
        @Inject(forwardRef(() => CommentsService))
        private commentsService: CommentsService,
        private aggregateDeletionService: AggregateDeletionService,
    ) {}

    async create({data, actor}: CreateTodoCommand): Promise<Todo> {
        const todo = this.todosRepository.create({
            title: data.title,
            content: data.content,
            priority: data.priority,
            state: data.state,
            authorId: actor.id,
        });
        return await this.todosRepository.save(todo);
    }

    async delete({id, actor}: DeleteTodoCommand): Promise<void> {
        await this.findOne({id, actor});
        await this.aggregateDeletionService.deleteTodoAggregate(id);
    }

    async update({id, data, actor}: UpdateTodoCommand): Promise<Todo> {
        const todo = await this.findOne({id, actor});

        Object.assign(todo, data);
        return this.todosRepository.save(todo);
    }

    async findOne({id, actor}: FindTodoCommand): Promise<Todo> {
        const todo = await this.todosRepository.findOne({where: {id}});
        if (!todo) {
            throw new NotFoundException("Todo not found");
        }
        this.assertCanAccess(todo, actor);
        return todo;
    }

    async findAll(
        authorId: string,
        query: QueryTodosDto = {},
    ): Promise<ResponseGetTodos> {
        const {page = 1, limit = 10} = query;
        const [todos, total] = await this.todosRepository.findAndCount({
            where: {authorId},
            order: {createdAt: "DESC", id: "DESC"},
            skip: (page - 1) * limit,
            take: limit,
        });

        return new PaginatedResponseDto<Todo>(todos, page, limit, total);
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

    async findTodoWithComments({todoId, actor}: FindTodoWithCommentsCommand) {
        const todo = await this.findOne({id: todoId, actor});
        const comments = await this.commentsService.findByEntity({
            actor,
            entityType: "todo",
            entityId: todoId,
        });
        return {...todo, comments: comments.items};
    }

    private assertCanAccess(todo: Todo, actor: AuthenticatedUser): void {
        if (todo.authorId === actor.id || actor.role === Role.ADMIN) {
            return;
        }

        throw new ForbiddenException("You do not have access to this todo");
    }
}
