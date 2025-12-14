import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {CheckList} from "./checklists.entity";

@Injectable()
export class ChecklistService {
    constructor(
        @InjectRepository(CheckList)
        private checklistRepo: Repository<CheckList>,
    ) {}

    private async getChecklistById(checklistId: string): Promise<CheckList> {
        const checklist = await this.checklistRepo.findOne({
            where: {id: checklistId},
        });

        if (!checklist) {
            throw new NotFoundException(
                `Checklist with ID ${checklistId} not found`,
            );
        }

        return checklist;
    }

    async create(
        todoId: string,
        initialText: string[] = [],
    ): Promise<CheckList> {
        const checklist = this.checklistRepo.create({
            text: initialText,
            progress: 0,
            todo: {id: todoId},
        });

        return await this.checklistRepo.save(checklist);
    }

    async addItem(todoId: string, itemText: string): Promise<CheckList> {
        const checklist = await this.getChecklistByTodoId(todoId);
        checklist.text.push(itemText);
        return await this.checklistRepo.save(checklist);
    }

    async updateProgress(todoId: string, delta: number): Promise<CheckList> {
        const checklist = await this.getChecklistByTodoId(todoId);
        const newProgress = checklist.progress + delta;
        checklist.progress = Math.max(
            0,
            Math.min(newProgress, checklist.text.length),
        );
        return await this.checklistRepo.save(checklist);
    }

    async deleteChecklist(todoId: string): Promise<void> {
        const checklist = await this.getChecklistByTodoId(todoId);
        const result = await this.checklistRepo.delete(checklist.id);

        if (result.affected === 0) {
            throw new NotFoundException(
                `Checklist for todo ${todoId} not found`,
            );
        }
    }

    async updateItemText(
        todoId: string,
        itemIndex: number,
        newText: string,
    ): Promise<CheckList> {
        const checklist = await this.getChecklistByTodoId(todoId);

        if (itemIndex < 0 || itemIndex >= checklist.text.length) {
            throw new NotFoundException(
                `Item with index ${itemIndex} not found`,
            );
        }

        checklist.text[itemIndex] = newText;
        return await this.checklistRepo.save(checklist);
    }

    async removeItem(todoId: string, itemIndex: number): Promise<CheckList> {
        const checklist = await this.getChecklistByTodoId(todoId);

        if (itemIndex < 0 || itemIndex >= checklist.text.length) {
            throw new NotFoundException(
                `Item with index ${itemIndex} not found`,
            );
        }

        checklist.text.splice(itemIndex, 1);

        if (itemIndex < checklist.progress) {
            checklist.progress -= 1;
        }

        return await this.checklistRepo.save(checklist);
    }

    async getByTodoId(todoId: string): Promise<CheckList | null> {
        return await this.checklistRepo.findOne({
            where: {todo: {id: todoId}},
        });
    }

    private async getChecklistByTodoId(todoId: string): Promise<CheckList> {
        const checklist = await this.getByTodoId(todoId);
        if (!checklist) {
            throw new NotFoundException(
                `Checklist for todo ${todoId} not found`,
            );
        }
        return checklist;
    }
}
