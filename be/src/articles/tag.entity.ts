import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {Column, Entity} from "typeorm";

import {BaseEntity} from "@/base/entity";

@Entity("tags")
export class Tag extends BaseEntity {
    @ApiProperty({
        description: "Название тега",
        example: "JavaScript",
    })
    @Column({unique: true})
    @IsString()
    @IsNotEmpty()
    name: string;
}
