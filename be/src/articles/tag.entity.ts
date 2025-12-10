import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {BaseEntity} from "src/utils/entity";
import {Column, Entity} from "typeorm";

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
