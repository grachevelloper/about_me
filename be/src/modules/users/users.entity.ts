import {Column, Entity} from "typeorm";

import {BaseEntity} from "../../shared/utils/entity";
import {Role} from "../../types";
import {UserStatus} from "../../types/user";

@Entity("users")
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enumName: "user_role",
        enum: Role,
        default: "User",
    })
    role: Role;

    @Column({nullable: true})
    avatar?: string;

    @Column({nullable: true})
    nowReading?: string;

    @Column({nullable: true})
    nowWatch?: string;

    @Column({nullable: true})
    nowBeingIn?: string;

    @Column({nullable: true})
    nowListening?: string;

    @Column({nullable: true})
    status?: UserStatus;
}
