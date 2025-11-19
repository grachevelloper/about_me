import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export type EntityCommentType = "todo" | "article";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "uuid"})
    authorId: string;

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
    updatedAt: string;

    @CreateDateColumn()
    createdAt: string;
}
