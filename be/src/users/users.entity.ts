import {IsOptional, Length} from "class-validator";
import {Column, Entity} from "typeorm";

import {BaseEntity} from "../base/entity";
import {Role} from "../types";
import {UserStatus} from "../types/user";

@Entity("users")
export class User extends BaseEntity {
    @Column()
    @Length(1, 50)
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: Role;

    @IsOptional()
    @Column({nullable: true})
    avatar?: string;

    @IsOptional()
    @Column({nullable: true})
    nowReading?: string;

    @IsOptional()
    @Column({nullable: true})
    nowWaitch?: string;

    @IsOptional()
    @Column({nullable: true})
    nowListening?: string;

    @IsOptional()
    @Column({nullable: true})
    status?: UserStatus;
}
