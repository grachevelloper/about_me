import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Attachment} from "src/modules/attachments/attachments.entity";
import {AttachmentsService} from "src/modules/attachments/attachments.service";
import {Comment} from "src/modules/comments/comments.entity";
import {Like} from "src/modules/likes/likes.entity";
import {AuthenticatedUser, Role} from "src/types";
import {In, Repository} from "typeorm";

import {PaginatedResponseDto} from "@/shared/dto/paginated-response.dto";
import {TodoState} from "@/types/todo";

import {CommentsService} from "../comments/comments.service";
import {CheckList} from "./checklists/checklists.entity";
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
        private attachmentsService: AttachmentsService,
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
        await this.attachmentsService.deleteEntityFiles("todo", id);

        await this.todosRepository.manager.transaction(async (manager) => {
            const comments = await manager.find(Comment, {
                select: {id: true},
                where: {entityType: "todo", entityId: id},
            });
            const commentIds = comments.map((comment) => comment.id);

            if (commentIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "comment",
                    entityId: In(commentIds),
                });
            }

            await manager.delete(Comment, {
                entityType: "todo",
                entityId: id,
            });
            await manager.delete(Like, {
                entityType: "todo",
                entityId: id,
            });
            await manager.delete(Attachment, {
                entityType: "todo",
                entityId: id,
            });
            await manager.delete(CheckList, {todo: {id}});
            await manager.delete(Todo, id);
        });
    }

    async update({id, data, actor}: UpdateTodoCommand): Promise<Todo> {
        const todo = await this.findOne({id, actor});

        Object.assign(todo, data);
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
