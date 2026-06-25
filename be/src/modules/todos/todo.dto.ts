import {IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";

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
