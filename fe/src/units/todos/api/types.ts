import type {Todo} from '../types';

export type DtoUpdateTodo = {
    id: string;
} & Partial<Pick<Todo, 'content' | 'state' | 'priority' | 'title'>>;

export type DtoCreateTodo = PartialFields<
    Pick<Todo, 'content' | 'state' | 'priority' | 'title'>,
    'state' | 'priority'
>;
export interface TodoApi {
    listTodos: () => Promise<Todo[]>;
    getTodoById: (todoId: string) => Promise<Nullable<Todo>>;
    createTodo: (CreateTodoDto: DtoCreateTodo) => Promise<Todo>;
    updateTodoById: (updateData: DtoUpdateTodo) => Promise<Todo>;
}
