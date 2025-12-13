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

import {User} from "../users/users.entity";
import {BaseEntity} from "../utils/entity";
import {Tag} from "./tags/tags.entity";

@Entity("articles")
export class Article extends BaseEntity {
    @Column()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsUrl()
    @IsNotEmpty()
    image: string;

    @Column("text")
    @IsString()
    @IsNotEmpty()
    content: string;

    @ManyToMany(() => Tag, {cascade: true, eager: true})
    @JoinTable({
        name: "article_tags",
        joinColumn: {name: "articleId", referencedColumnName: "id"},
        inverseJoinColumn: {name: "tagId", referencedColumnName: "id"},
    })
    @IsArray()
    @IsOptional()
    tags?: Tag[];

    @Column({nullable: true})
    @IsNumber()
    @Min(1)
    @IsOptional()
    readTime?: number;

    @Column({default: 0})
    @IsNumber()
    @Min(0)
    likesCount: number;

    @ManyToOne(() => User)
    @JoinColumn({name: "authorId"})
    author: User;

    @Column({default: true})
    isDraft: boolean;
}
