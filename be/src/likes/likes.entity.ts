import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

export type EntityLikeType = "comment" | "todo" | "article";

@Entity("likes")
export class Like {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    authorId: string;

    @Column()
    entityType: EntityLikeType;

    @Column("uuid")
    entityId: string;

    @CreateDateColumn()
    createdAt: string;
}
