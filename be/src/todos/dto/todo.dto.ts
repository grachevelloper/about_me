import {type TodoPriority, type TodoState} from "@/types/todo";
import {User} from "@/users/users.entity";

export interface CreateTodoDto {
    authorId: string;
    content: string;
    title: string;
    priority?: TodoPriority;
    state?: TodoState;
    likedBy: User[];
    likesCount: number;
}
export type UpdateTodoDto = Partial<CreateTodoDto> & {
    isActive?: boolean;
};
