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
    Query,
    ValidationPipe,
} from "@nestjs/common";

import {CurrentUser} from "../../shared/decorators/current-user.decorator";
import {AuthenticatedUser} from "../../types";
import {
    CreateArticleDto,
    RequestGetArticles,
    ResponseArticle,
    ResponseGetArticles,
    UpdateArticleDto,
} from "./article.interface";
import {Article} from "./articles.entity";
import {ArticlesService} from "./articles.service";
import {Tag} from "./tags/tags.entity";

@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    async create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() createArticleData: CreateArticleDto,
    ): Promise<ResponseArticle> {
        return await this.articlesService.create(user.id, createArticleData);
    }

    @Get("drafts")
    async findAllDrafts(
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<Article[]> {
        return await this.articlesService.findAllByAuthorId(user.id, true);
    }

    @Get(":id")
    async findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
    ): Promise<ResponseArticle> {
        return await this.articlesService.findOne(id, user.id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() data: UpdateArticleDto,
    ): Promise<Article> {
        return await this.articlesService.update(id, data);
    }

    @Patch(":id/title")
    async updateTitle(
        @Param("id") id: string,
        @Body("title") title: string,
    ): Promise<Article> {
        return await this.articlesService.updateTitle(id, title);
    }

    @Patch(":id/content")
    async updateContent(
        @Param("id") id: string,
        @Body("content") content: string,
    ): Promise<Article> {
        return await this.articlesService.updateContent(id, content);
    }

    @Patch(":id/image")
    async updateImage(
        @Param("id") id: string,
        @Body("image") image: string,
    ): Promise<Article> {
        return await this.articlesService.updateImage(id, image);
    }

    @Patch(":id/read-time")
    async updateReadTime(
        @Param("id") id: string,
        @Body("readTime") readTime: number,
    ): Promise<Article> {
        return await this.articlesService.updateReadTime(id, readTime);
    }

    @Patch(":id/tags")
    async updateTags(
        @Param("id") id: string,
        @Body("tags") tags: Tag[],
    ): Promise<Article> {
        return await this.articlesService.updateTags(id, tags);
    }

    @Patch(":id/draft-status")
    async updateDraftStatus(
        @Param("id") id: string,
        @Body("isDraft") isDraft: boolean,
    ): Promise<Article> {
        return await this.articlesService.updateDraftStatus(id, isDraft);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id") id: string): Promise<void> {
        return await this.articlesService.delete(id);
    }

    @Post(":id/publish")
    async publichArticle(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id") id: string,
    ): Promise<boolean> {
        return await this.articlesService.publish(id, user.id);
    }

    @Post(":id/like")
    @HttpCode(HttpStatus.NO_CONTENT)
    async incrementLikes(@Param("id") id: string): Promise<void> {
        await this.articlesService.incrementLikesCount(id);
    }

    @Post(":id/unlike")
    @HttpCode(HttpStatus.NO_CONTENT)
    async decrementLikes(@Param("id") id: string): Promise<void> {
        await this.articlesService.decrementLikesCount(id);
    }

    @Get("author/:authorId")
    async findAllByAuthorId(
        @Param("authorId") authorId: string,
    ): Promise<Article[]> {
        return await this.articlesService.findAllByAuthorId(authorId);
    }

    @Get()
    async findAll(
        @Query(
            new ValidationPipe({
                transform: true,
                transformOptions: {enableImplicitConversion: true},
                forbidNonWhitelisted: true,
            }),
        )
        query: RequestGetArticles,
    ): Promise<ResponseGetArticles> {
        const filters = {
            ...query,
            tags: query.tags ? query.tags.split(",") : undefined,
        };
        return await this.articlesService.findAll(filters);
    }
}
