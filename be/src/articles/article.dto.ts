import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested,
} from "class-validator";

export class TagDto {
    @ApiProperty({
        description: "Название тега",
        example: "JavaScript",
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
export class CreateArticleDto {
    @ApiProperty({
        description: "Заголовок статьи",
        example: "Новые тенденции в веб-разработке",
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: "URL изображения статьи",
        example: "https://example.com/image.jpg",
    })
    @IsUrl()
    @IsNotEmpty()
    image: string;

    @ApiProperty({
        description: "Содержимое статьи",
        example: "В этой статье мы рассмотрим...",
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: "Теги статьи",
        type: [TagDto],
        example: [{name: "JavaScript"}, {name: "TypeScript"}],
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => TagDto)
    @IsOptional()
    tags?: TagDto[];

    @ApiProperty({
        description: "Время чтения в минутах",
        example: 5,
        required: false,
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    readTime?: number;

    @ApiProperty({
        description: "ID автора статьи",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsString()
    @IsNotEmpty()
    authorId: string;
}

export class UpdateArticleDto {
    @ApiProperty({
        description: "Заголовок статьи",
        example: "Обновленный заголовок",
        required: false,
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: "Содержимое статьи",
        example: "Обновленное содержимое...",
        required: false,
    })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({
        description: "Время чтения статьи в минутах",
        example: 7,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    readTime?: number;
}
