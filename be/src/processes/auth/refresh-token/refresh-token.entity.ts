import {Column, Entity} from "typeorm";

import {UnUpdatableBaseEntity} from "../../../shared/utils/entity";

@Entity("refresh_tokens")
export class RefreshToken extends UnUpdatableBaseEntity {
    @Column("uuid")
    userId!: string;

    @Column()
    tokenHash!: string;

    @Column()
    expiresAt!: Date;

    @Column({default: false})
    revoked!: boolean;
}
