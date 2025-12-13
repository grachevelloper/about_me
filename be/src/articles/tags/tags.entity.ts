import {BaseEntity} from "src/utils/entity";
import {Column, Entity, ManyToMany} from "typeorm";

import {Article} from "../articles.entity";

@Entity("tags")
export class Tag extends BaseEntity {
    @Column({unique: true})
    name: string;

    @ManyToMany(() => Article, (article) => article.tags)
    articles?: Article[];
}
