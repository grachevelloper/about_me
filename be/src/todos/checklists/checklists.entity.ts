import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import {Todo} from "../todos.entity";

@Entity("checklists")
export class CheckList {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "simple-array"})
    text: string[];

    @Column({default: 0})
    progress: number;

    @OneToOne(() => Todo, (todo) => todo.checklist, {onDelete: "CASCADE"})
    @JoinColumn()
    todo: Todo;
}
