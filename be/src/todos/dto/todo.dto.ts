import {User} from "@/users/users.entity";

import {type TodoPriority, type TodoState} from "../../types/todo";

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
