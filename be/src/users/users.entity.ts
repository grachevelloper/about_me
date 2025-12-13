import {Column, Entity} from "typeorm";

import {Role} from "../types";
import {UserStatus} from "../types/user";
import {BaseEntity} from "../utils/entity";

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
    nowListening?: string;

    @Column({nullable: true})
    status?: UserStatus;
}
