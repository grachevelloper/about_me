import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import {User} from "../users/users.entity";

export type EntityCommentType = "todo" | "article";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    @JoinColumn()
    author: User;

    @Column()
    content: string;

    @Column({type: "varchar"})
    entityType: EntityCommentType;

    @Column({type: "uuid"})
    entityId: string;

    @Column({type: "uuid", nullable: true})
    parentId: string | null;

    @Column({default: 0})
    depth: number;

    @Column({default: 0})
    likesCount: number;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
