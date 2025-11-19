import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import {IsString} from "class-validator";

import {ChecklistService} from "./checklists.service";

class AddItemDto {
    text: string;
}

class UpdateItemTextDto {
    @IsString()
    text: string;
}

class UpdateProgressDto {
    delta: number;
}

@Controller("todos/:todoId/checklist")
export class ChecklistController {
    constructor(private readonly checklistService: ChecklistService) {}

    @Post()
    createChecklist(@Param("todoId") todoId: string) {
        return this.checklistService.create(todoId, []);
    }

    @Get()
    getChecklist(@Param("todoId") todoId: string) {
        return this.checklistService.getByTodoId(todoId);
    }

    @Post("items")
    addItem(@Param("todoId") todoId: string, @Body() dto: AddItemDto) {
        return this.checklistService.addItem(todoId, dto.text);
    }

    @Patch("items/:index")
    updateItemText(
        @Param("todoId") todoId: string,
        @Param("index") index: number,
        @Body() dto: UpdateItemTextDto,
    ) {
        return this.checklistService.updateItemText(todoId, index, dto.text);
    }

    @Patch("progress")
    updateProgress(
        @Param("todoId") todoId: string,
        @Body() dto: UpdateProgressDto,
    ) {
        return this.checklistService.updateProgress(todoId, dto.delta);
    }

    @Delete("items/:index")
    removeItem(@Param("todoId") todoId: string, @Param("index") index: number) {
        return this.checklistService.removeItem(todoId, index);
    }

    @Delete()
    deleteChecklist(@Param("todoId") todoId: string) {
        return this.checklistService.deleteChecklist(todoId);
    }
}
