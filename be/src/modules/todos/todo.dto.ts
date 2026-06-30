import {Type} from "class-transformer";
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from "class-validator";

import {PaginatedResponseDto} from "@/shared/dto/paginated-response.dto";
import {TodoPriority, TodoState} from "@/types/todo";

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsOptional()
    @IsEnum(TodoPriority)
    priority?: TodoPriority;

    @IsOptional()
    @IsEnum(TodoState)
    state?: TodoState;
}

export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsEnum(TodoPriority)
    priority?: TodoPriority;

    @IsOptional()
    @IsEnum(TodoState)
    state?: TodoState;
}

export class QueryTodosDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

export class TodoResponseDto {
    id!: string;
    title!: string;
    content!: string;
    authorId!: string;
    priority!: TodoPriority | null;
    state!: TodoState | null;
    likesCount!: number;
    hasLiked!: boolean;
    createdAt!: string;
    updatedAt!: string;
}

export class ResponseGetTodos extends PaginatedResponseDto<TodoResponseDto> {}
