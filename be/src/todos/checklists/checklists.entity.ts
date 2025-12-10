import {Column, Entity, JoinColumn, OneToOne} from "typeorm";

import {BaseEntity} from "src/utils/entity";

import {Todo} from "../todos.entity";

@Entity("checklists")
export class CheckList extends BaseEntity {
    @Column({type: "simple-array"})
    text: string[];

    @Column({default: 0})
    progress: number;

    @OneToOne(() => Todo, (todo) => todo.checklist, {onDelete: "CASCADE"})
    @JoinColumn()
    todo: Todo;
}
