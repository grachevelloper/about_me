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
    Query,
} from "@nestjs/common";

import {Public} from "../../shared/decorators/auth.decorator";
import {CurrentUser} from "../../shared/decorators/current-user.decorator";
import {AuthenticatedUser} from "../../types";
import {
    CreateArticleDto,
    RequestGetArticles,
    ResponseArticle,
    ResponseGetArticles,
    UpdateArticleDto,
} from "./article.dto";
import {ArticlesService} from "./articles.service";

@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    async create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() createArticleData: CreateArticleDto,
    ): Promise<ResponseArticle> {
        return await this.articlesService.create({
            actor: user,
            data: createArticleData,
        });
    }

    @Get("drafts")
    async findAllDrafts(
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<ResponseArticle[]> {
        return await this.articlesService.findAllByAuthorId({
            authorId: user.id,
            actor: user,
            drafts: true,
        });
    }

    @Get("author/:authorId")
    @Public()
    async findAllByAuthorId(
        @Param("authorId", ParseUUIDPipe) authorId: string,
    ): Promise<ResponseArticle[]> {
        return await this.articlesService.findAllByAuthorId({authorId});
    }

    @Get(":id")
    @Public()
    async findOne(
        @CurrentUser() user: AuthenticatedUser | undefined,
        @Param("id", ParseUUIDPipe) id: string,
    ): Promise<ResponseArticle> {
        return await this.articlesService.findOne({id, actor: user});
    }

    @Patch(":id")
    async update(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id", ParseUUIDPipe) id: string,
        @Body() data: UpdateArticleDto,
    ): Promise<ResponseArticle> {
        return await this.articlesService.update({id, actor: user, data});
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id", ParseUUIDPipe) id: string,
    ): Promise<void> {
        await this.articlesService.delete({id, actor: user});
    }

    @Post(":id/publish")
    async publishArticle(
        @CurrentUser() user: AuthenticatedUser,
        @Param("id", ParseUUIDPipe) id: string,
    ): Promise<ResponseArticle> {
        return await this.articlesService.publish({id, actor: user});
    }

    @Get()
    @Public()
    async findAll(
        @Query() query: RequestGetArticles,
    ): Promise<ResponseGetArticles> {
        return await this.articlesService.findAll({
            ...query,
            tags: query.tags
                ? query.tags
                      .split(",")
                      .map((tag) => tag.trim().toLowerCase())
                      .filter((tag) => tag.length > 0)
                : undefined,
        });
    }
}
