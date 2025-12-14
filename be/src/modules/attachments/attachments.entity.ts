import {Column, Entity} from "typeorm";

import {UnUpdatableBaseEntity} from "../../shared/utils/entity";
import {EntityAttachmentType} from "./attachments.interface";

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
    entityType: EntityAttachmentType;

    @Column("uuid")
    entityId: string;
}
