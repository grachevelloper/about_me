import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import {Request} from "express";

import {CreateArticleDto, ResponseArticle} from "./article.dto";
import {Article} from "./articles.entity";
import {ArticlesService} from "./articles.service";

@ApiTags("Статьи")
@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    @ApiOperation({
        summary: "Создание новой статьи",
        description: "Создает новую статью с указанным автором и контентом",
    })
    @ApiBody({
        type: CreateArticleDto,
        description: "Данные для создания статьи",
    })
    @ApiCreatedResponse({
        type: Article,
        description: "Статья успешно создана",
    })
    @ApiBadRequestResponse({
        description: "Неверные входные данные",
    })
    @ApiNotFoundResponse({
        description: "Автор не найден",
    })
    async create(
        @Body() createArticleData: CreateArticleDto,
    ): Promise<ResponseArticle> {
        return await this.articlesService.create(createArticleData);
    }

    @Get(":id")
    @ApiOperation({
        summary: "Получение статьи по ID",
        description: "Возвращает статью с указанным идентификатором",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "Идентификатор статьи",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiOkResponse({
        type: Article,
        description: "Статья найдена",
    })
    @ApiNotFoundResponse({
        description: "Статья не найдена",
    })
    async findOne(
        @Req() req: Request,
        @Param("id") id: string,
    ): Promise<ResponseArticle> {
        const authorId = req.user.id;
        return await this.articlesService.findOne(id, authorId);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: "Удаление статьи",
        description: "Удаляет статью с указанным идентификатором",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "Идентификатор статьи",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiNoContentResponse({
        description: "Статья успешно удалена",
    })
    @ApiNotFoundResponse({
        description: "Статья не найдена",
    })
    async delete(@Param("id") id: string): Promise<void> {
        await this.articlesService.delete(id);
    }

    @Post(":id/publish")
    @ApiOperation({
        summary: "Опубликовать статью",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "Идентификатор статьи",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiNotFoundResponse({
        description: "Статья не найдена",
    })
    async publichArticle(
        @Req() req: Request,
        @Param("id") id: string,
    ): Promise<Article> {
        const authorId = req.user.id;
        return await this.articlesService.publish(id, authorId);
    }

    @Post(":id/like")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: "Увеличить количество лайков",
        description: "Инкрементирует счетчик лайков статьи",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "Идентификатор статьи",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiNoContentResponse({
        description: "Лайк успешно добавлен",
    })
    @ApiNotFoundResponse({
        description: "Статья не найдена",
    })
    async incrementLikes(@Param("id") id: string): Promise<void> {
        await this.articlesService.incrementLikesCount(id);
    }

    @Post(":id/unlike")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: "Уменьшить количество лайков",
        description: "Декрементирует счетчик лайков статьи (но не ниже 0)",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "Идентификатор статьи",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiNoContentResponse({
        description: "Лайк успешно убран",
    })
    @ApiNotFoundResponse({
        description: "Статья не найдена",
    })
    async decrementLikes(@Param("id") id: string): Promise<void> {
        await this.articlesService.decrementLikesCount(id);
    }

    @Get()
    @ApiOperation({
        summary: "Получение всех статей",
        description: "Возвращает список всех статей с пагинацией",
    })
    @ApiOkResponse({
        type: [Article],
        description: "Список статей",
    })
    async findAll(@Param("authorId") authorId: string): Promise<Article[]> {
        return await this.articlesService.findAllByAuthorId(authorId);
    }

    @Get("drafts")
    @ApiOperation({
        summary: "Получение всех черновиков",
        description: "Возвращает список всех статей с пагинацией",
    })
    @ApiOkResponse({
        type: [Article],
        description: "Список статей",
    })
    async findAllDrafts(
        @Param("authorId") authorId: string,
    ): Promise<Article[]> {
        return await this.articlesService.findAllByAuthorId(authorId, true);
    }
}
