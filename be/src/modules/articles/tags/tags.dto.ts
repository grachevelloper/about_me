import {IsNotEmpty, IsString} from "class-validator";

export class CreateTagDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}

export class TagResponseDto {
    id!: string;
    name!: string;
}
