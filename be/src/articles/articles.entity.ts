import {Length} from "class-validator";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {BaseEntity} from "../base/entity";
import {User} from "../users/users.entity";

@Entity("articles")
export class Article extends BaseEntity {
    @Column()
    @Length(3, 170)
    title: string;

    @Column()
    content: string;

    @ManyToOne(() => User)
    @JoinColumn()
    author: User;

    @Column({default: 0})
    likesCount: number;
}
