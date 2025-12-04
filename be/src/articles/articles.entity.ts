import {ApiProperty} from "@nestjs/swagger";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from "class-validator";
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from "typeorm";

import {BaseEntity} from "../base/entity";
import {User} from "../users/users.entity";
import {Tag} from "./tag.entity";

@Entity("articles")
export class Article extends BaseEntity {
    @ApiProperty({
        description: "Заголовок статьи",
        example: "Новые тенденции в веб-разработке",
    })
    @Column()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: "URL изображения статьи",
        example: "https://example.com/image.jpg",
    })
    @Column()
    @IsUrl()
    @IsNotEmpty()
    image: string;

    @ApiProperty({
        description: "Содержимое статьи",
        example: "В этой статье мы рассмотрим...",
    })
    @Column("text")
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: "Теги статьи",
        type: () => [Tag],
    })
    @ManyToMany(() => Tag, {cascade: true, eager: true})
    @JoinTable({
        name: "article_tags",
        joinColumn: {name: "articleId", referencedColumnName: "id"},
        inverseJoinColumn: {name: "tagId", referencedColumnName: "id"},
    })
    @IsArray()
    @IsOptional()
    tags?: Tag[];

    @ApiProperty({
        description: "Время чтения в минутах",
        example: 5,
        required: false,
    })
    @Column({nullable: true})
    @IsNumber()
    @Min(1)
    @IsOptional()
    readTime?: number;

    @ApiProperty({
        description: "Количество лайков",
        example: 42,
        default: 0,
    })
    @Column({default: 0})
    @IsNumber()
    @Min(0)
    likesCount: number;

    @ApiProperty({
        description: "Автор статьи",
        type: () => User,
    })
    @ManyToOne(() => User)
    @JoinColumn({name: "authorId"})
    author: User;
}
