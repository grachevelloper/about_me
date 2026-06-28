import {Column, Entity, Unique} from "typeorm";

import {UnUpdatableBaseEntity} from "../../shared/utils/entity";

export type EntityLikeType = "comment" | "todo" | "article";

@Entity("likes")
@Unique("UQ_likes_author_entity", ["authorId", "entityType", "entityId"])
export class Like extends UnUpdatableBaseEntity {
    @Column("uuid")
    authorId!: string;

    @Column({
        type: "enum",
        enumName: "entity_liked_type",
        enum: ["comment", "todo", "article"],
    })
    entityType!: EntityLikeType;

    @Column("uuid")
    entityId!: string;
}
