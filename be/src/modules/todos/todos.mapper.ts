import {TodoResponseDto} from "./todo.dto";
import {Todo} from "./todos.entity";

export class TodosMapper {
    static toResponse(todo: Todo): TodoResponseDto {
        return {
            id: todo.id,
            title: todo.title,
            content: todo.content,
            authorId: todo.authorId,
            priority: todo.priority ?? null,
            state: todo.state ?? null,
            likesCount: todo.likesCount ?? 0,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
        };
    }
}
