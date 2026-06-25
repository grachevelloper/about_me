import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from "@nestjs/common";

import {CreateTagDto, TagResponseDto} from "./tags.dto";
import {TagsMapper} from "./tags.mapper";
import {TagsService} from "./tags.service";

@Controller("tags")
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    async create(@Body() data: CreateTagDto): Promise<TagResponseDto> {
        return TagsMapper.toResponse(await this.tagsService.create(data));
    }

    @Get()
    async findAll(): Promise<TagResponseDto[]> {
        return (await this.tagsService.findAll()).map((tag) =>
            TagsMapper.toResponse(tag),
        );
    }

    @Patch(":id")
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() data: CreateTagDto,
    ): Promise<TagResponseDto> {
        return TagsMapper.toResponse(await this.tagsService.update(id, data.name));
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
        await this.tagsService.delete(id);
    }
}
