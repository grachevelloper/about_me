import {Column, Entity} from "typeorm";

import {UnUpdatableBaseEntity} from "../utils/entity";

export type EntityLikeType = "comment" | "todo" | "article";

@Entity("likes")
export class Like extends UnUpdatableBaseEntity {
    @Column("uuid")
    authorId: string;

    @Column({
        type: "enum",
        enumName: "entity_liked_type",
        enum: ["comment", "todo", "article"],
    })
    entityType: EntityLikeType;

    @Column("uuid")
    entityId: string;
}
