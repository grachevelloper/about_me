import {Column, Entity, Index} from "typeorm";

import {UnUpdatableBaseEntity} from "../../shared/utils/entity";
import {EntityAttachmentType} from "./attachments.interface";

@Entity("attachments")
@Index("IDX_attachments_entity", ["entityType", "entityId"])
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
