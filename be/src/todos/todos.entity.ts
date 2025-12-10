import {Column, Entity, OneToOne} from "typeorm";

import {BaseEntity} from "src/utils/entity";
import {TodoPriority, TodoState} from "@/types/todo";

import {CheckList} from "./checklists/checklists.entity";

@Entity("todos")
export class Todo extends BaseEntity {
    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    authorId: string;

    @Column({default: TodoPriority.MEDIUM})
    priority?: TodoPriority;

    @Column({default: TodoState.PLANNING})
    state?: TodoState;

    @OneToOne(() => CheckList, (item) => item.todo, {
        cascade: true,
        nullable: true,
    })
    checklist?: CheckList;

    @Column({default: 0})
    likesCount?: number;
}
