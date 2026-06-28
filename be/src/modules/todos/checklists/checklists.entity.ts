import {BaseEntity} from "src/shared/utils/entity";
import {Column, Entity, JoinColumn, OneToOne} from "typeorm";

import {Todo} from "../todos.entity";

@Entity("checklists")
export class CheckList extends BaseEntity {
    @Column({type: "simple-array"})
    text!: string[];

    @Column({default: 0})
    progress!: number;

    @Column({name: "todo_id", type: "uuid", unique: true})
    todoId!: string;

    @OneToOne(() => Todo, (todo) => todo.checklist, {onDelete: "CASCADE"})
    @JoinColumn({name: "todo_id"})
    todo!: Todo;
}
