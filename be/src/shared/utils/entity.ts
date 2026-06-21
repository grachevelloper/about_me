import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export class UnUpdatableBaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn()
    createdAt!: string;
}

export class BaseEntity extends UnUpdatableBaseEntity {
    @UpdateDateColumn()
    updatedAt!: string;
}

export class LikedEntity {
    hasLiked!: boolean;
}
