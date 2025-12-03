import {Column, Entity} from "typeorm";

import {UnUpdatableBaseEntity} from "../base/entity";

export type EntityLikeType = "comment" | "todo" | "article";

@Entity("likes")
export class Like extends UnUpdatableBaseEntity {
    @Column("uuid")
    authorId: string;

    @Column()
    entityType: EntityLikeType;

    @Column("uuid")
    entityId: string;
}
