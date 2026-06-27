import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";

import {BaseEntity} from "../../shared/utils/entity";
import {User} from "../users/users.entity";

export type EntityCommentType = "todo" | "article";

@Entity("comments")
export class Comment extends BaseEntity {
    @ManyToOne(() => User)
    @JoinColumn()
    author!: User;

    @Column()
    content!: string;

    @Column({
        type: "enum",
        enumName: "entity_commented_type",
        enum: ["todo", "article"],
    })
    entityType!: EntityCommentType;

    @Column({type: "uuid"})
    entityId!: string;

    @Column({type: "uuid", nullable: true})
    parentId!: string | null;

    @Column({default: 0})
    depth!: number;

    @Column({default: 0})
    likesCount!: number;
}
