import {Column, Entity} from "typeorm";

import {UnUpdatableBaseEntity} from "../../shared/utils/entity";
import {EntityImageType} from "./attachments.interface";

@Entity("attachments")
export class Attachment extends UnUpdatableBaseEntity {
    @Column()
    url: string;

    @Column()
    s3Key: string;

    @Column({
        type: "enum",
        enum: ["user", "article", "todo"],
        enumName: "entity_image_type",
    })
    entityType: EntityImageType;

    @Column("uuid")
    entityId: string;
}
