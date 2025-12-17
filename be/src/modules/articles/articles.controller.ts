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
    Req,
    ValidationPipe,
} from "@nestjs/common";
import {Request} from "express";

import {
    CreateArticleDto,
    RequestGetArticles,
    ResponseArticle,
    ResponseGetArticles,
    UpdateArticleDto,
} from "./article.interface";
import {Article} from "./articles.entity";
import {ArticlesService} from "./articles.service";

@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    async create(
        @Req() req: Request,
        @Body() createArticleData: CreateArticleDto,
    ): Promise<ResponseArticle> {
        const authorId = req.user.id;

        return await this.articlesService.create(authorId, createArticleData);
    }

    @Get("drafts")
    async findAllDrafts(@Req() req: Request): Promise<Article[]> {
        const authorId = req.user.id;
        return await this.articlesService.findAllByAuthorId(authorId, true);
    }

    @Get(":id")
    async findOne(
        @Req() req: Request,
        @Param("id") id: string,
    ): Promise<ResponseArticle> {
        const authorId = req.user.id;
        return await this.articlesService.findOne(id, authorId);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() data: UpdateArticleDto,
    ): Promise<Article> {
        return await this.articlesService.update(id, data);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id") id: string): Promise<void> {
        return await this.articlesService.delete(id);
    }

    @Post(":id/publish")
    async publichArticle(
        @Req() req: Request,
        @Param("id") id: string,
    ): Promise<boolean> {
        const authorId = req.user.id;
        return await this.articlesService.publish(id, authorId);
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
