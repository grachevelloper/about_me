import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from "@nestjs/common";

import {Tag} from "./tags.entity";
import {TagsService} from "./tags.service";

@Controller("tags")
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    async create(@Body() name: string): Promise<Tag> {
        return await this.tagsService.create(name);
    }

    @Get()
    async findAll(): Promise<Tag[]> {
        return await this.tagsService.findAll();
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() newName: string,
    ): Promise<Tag> {
        return await this.tagsService.update(id, newName);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param("id") id: string): Promise<void> {
        await this.tagsService.delete(id);
    }
}
