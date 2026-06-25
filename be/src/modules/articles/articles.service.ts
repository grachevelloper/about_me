import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";

import {PaginatedResponseDto} from "../../shared/dto/paginated-response.dto";
import {AuthenticatedUser, Order, Role, SortBy} from "../../types";
import {Attachment} from "../attachments/attachments.entity";
import {AttachmentsService} from "../attachments/attachments.service";
import {Comment} from "../comments/comments.entity";
import {Like} from "../likes/likes.entity";
import {LikesService} from "../likes/likes.service";
import {UsersService} from "../users/users.service";
import {
    ArticleResponseDto,
    CreateArticleDto,
    RequestGetArticles,
    ResponseArticle,
    ResponseGetArticles,
    UpdateArticleDto,
} from "./article.dto";
import {Article} from "./articles.entity";
import {ArticlesMapper} from "./articles.mapper";
import {Tag} from "./tags/tags.entity";
import {TagsService} from "./tags/tags.service";

interface CreateArticleCommand {
    actor: AuthenticatedUser;
    data: CreateArticleDto;
}

interface UpdateArticleCommand {
    actor: AuthenticatedUser;
    data: UpdateArticleDto;
    id: string;
}

interface FindArticleCommand {
    actor: AuthenticatedUser;
    id: string;
}

interface DeleteArticleCommand {
    actor: AuthenticatedUser;
    id: string;
}

interface PublishArticleCommand {
    actor: AuthenticatedUser;
    id: string;
}

type FindArticlesQuery = Omit<RequestGetArticles, "tags"> & {
    tags?: string[];
};

interface FindArticlesByAuthorQuery {
    actor?: AuthenticatedUser;
    authorId: string;
    drafts?: boolean;
}

const DEFAULT_ARTICLE_IMAGE = `${
    process.env.S3_PUBLIC_DOMAIN ?? ""
}/draft-placeholder/image.png`;

const SORT_COLUMNS: Record<SortBy, string> = {
    createdAt: "article.createdAt",
    updatedAt: "article.updatedAt",
};

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
        private likesService: LikesService,
        private usersService: UsersService,
        private tagsService: TagsService,
        private attachmentsService: AttachmentsService,
    ) {}

    async create({
        actor,
        data,
    }: CreateArticleCommand): Promise<ResponseArticle> {
        const author = await this.usersService.findById(actor.id);
        const tags = await this.resolveTags(data.tags);
        const article = this.articlesRepository.create({
            author,
            content: data.content,
            image: DEFAULT_ARTICLE_IMAGE,
            isDraft: true,
            readTime: data.readTime,
            tags,
            title: data.title,
        });

        return ArticlesMapper.toResponse(
            await this.articlesRepository.save(article),
            false,
        );
    }

    async update({
        id,
        actor,
        data,
    }: UpdateArticleCommand): Promise<ResponseArticle> {
        const article = await this.findOneForMutation(id, actor);
        const tags = await this.resolveTags(data.tags);

        Object.assign(article, {
            content: data.content ?? article.content,
            image: data.image ?? article.image,
            readTime: data.readTime ?? article.readTime,
            tags: data.tags ? tags : article.tags,
            title: data.title ?? article.title,
        });

        return ArticlesMapper.toResponse(
            await this.articlesRepository.save(article),
            false,
        );
    }

    async publish({
        id,
        actor,
    }: PublishArticleCommand): Promise<ResponseArticle> {
        const article = await this.findOneForMutation(id, actor);
        if (!article.isDraft) {
            throw new BadRequestException("Article has already been published");
        }

        article.isDraft = false;
        return ArticlesMapper.toResponse(
            await this.articlesRepository.save(article),
            false,
        );
    }

    async findAll(filters: FindArticlesQuery): Promise<ResponseGetArticles> {
        const {
            page = 1,
            limit = 10,
            search,
            authorId,
            tags,
            minLikes,
            createdAfter,
            sortBy = SortBy.CREATED_AT,
            order = Order.DESC,
        } = filters;

        const queryBuilder = this.articlesRepository
            .createQueryBuilder("article")
            .leftJoinAndSelect("article.author", "author")
            .leftJoinAndSelect("article.tags", "tags")
            .andWhere("article.isDraft = :isDraft", {isDraft: false});

        if (search) {
            queryBuilder.andWhere("article.title ILIKE :search", {
                search: `%${search}%`,
            });
        }
        if (authorId) {
            queryBuilder.andWhere("article.authorId = :authorId", {authorId});
        }
        if (tags && tags.length > 0) {
            queryBuilder
                .andWhere((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select("1")
                        .from("article_tags", "article_tag")
                        .innerJoin(
                            Tag,
                            "tag",
                            'tag.id = article_tag."tagId"',
                        )
                        .where('article_tag."articleId" = article.id')
                        .andWhere("tag.name IN (:...tags)")
                        .getQuery();

                    return `EXISTS ${subQuery}`;
                })
                .setParameter("tags", tags);
        }
        if (minLikes !== undefined) {
            queryBuilder.andWhere("article.likesCount >= :minLikes", {
                minLikes,
            });
        }
        if (createdAfter) {
            queryBuilder.andWhere("article.createdAt >= :createdAfter", {
                createdAfter: new Date(createdAfter),
            });
        }

        queryBuilder
            .orderBy(SORT_COLUMNS[sortBy], order)
            .skip((page - 1) * limit)
            .take(limit);

        const [articles, total] = await queryBuilder.getManyAndCount();
        const items = articles.map((article) =>
            ArticlesMapper.toResponse(article, false),
        );

        return new PaginatedResponseDto<ArticleResponseDto>(
            items,
            page,
            limit,
            total,
        );
    }

    async findOne({
        id,
        actor,
    }: FindArticleCommand): Promise<ResponseArticle> {
        const article = await this.articlesRepository.findOne({
            where: {id},
            relations: ["author", "tags"],
        });
        if (!article) {
            throw new NotFoundException("Article not found");
        }
        if (article.isDraft) {
            this.assertCanMutate(article, actor);
        }

        const likedArticle = await this.likesService.hasLiked({
            entityId: id,
            userId: actor.id,
            entityType: "article",
        });

        return ArticlesMapper.toResponse(article, Boolean(likedArticle));
    }

    async findAllByAuthorId({
        authorId,
        actor,
        drafts = false,
    }: FindArticlesByAuthorQuery): Promise<ResponseArticle[]> {
        if (drafts) {
            this.assertCanReadDrafts(authorId, actor);
        }

        const articles = await this.articlesRepository.find({
            where: {author: {id: authorId}, isDraft: drafts},
            relations: ["author", "tags"],
            order: {
                createdAt: "DESC",
            },
        });

        return articles.map((article) => ArticlesMapper.toResponse(article));
    }

    async delete({id, actor}: DeleteArticleCommand): Promise<void> {
        const article = await this.findOneForMutation(id, actor);
        await this.attachmentsService.deleteEntityFiles("article", article.id);

        await this.articlesRepository.manager.transaction(
            async (transactionalEntityManager) => {
                const comments = await transactionalEntityManager.find(Comment, {
                    select: ["id"],
                    where: {entityType: "article", entityId: article.id},
                });
                const commentIds = comments.map((comment) => comment.id);

                if (commentIds.length > 0) {
                    await transactionalEntityManager.delete(Like, {
                        entityType: "comment",
                        entityId: In(commentIds),
                    });
                }

                await transactionalEntityManager.delete(Comment, {
                    entityType: "article",
                    entityId: article.id,
                });
                await transactionalEntityManager.delete(Like, {
                    entityType: "article",
                    entityId: article.id,
                });
                await transactionalEntityManager.delete(Attachment, {
                    entityType: "article",
                    entityId: article.id,
                });
                await transactionalEntityManager.delete(Article, article.id);
            },
        );
    }

    async incrementLikesCount(articleId: string): Promise<void> {
        await this.articlesRepository
            .createQueryBuilder()
            .update(Article)
            .set({
                likesCount: () => "likesCount + 1",
            })
            .where("id = :articleId", {articleId})
            .execute();
    }

    async decrementLikesCount(articleId: string): Promise<void> {
        await this.articlesRepository
            .createQueryBuilder()
            .update(Article)
            .set({
                likesCount: () => "likesCount - 1",
            })
            .where("id = :articleId", {articleId})
            .andWhere("likesCount > 0")
            .execute();
    }

    private async findOneForMutation(
        id: string,
        actor: AuthenticatedUser,
    ): Promise<Article> {
        const article = await this.articlesRepository.findOne({
            where: {id},
            relations: ["author", "tags"],
        });
        if (!article) {
            throw new NotFoundException("Article not found");
        }
        this.assertCanMutate(article, actor);
        return article;
    }

    private assertCanMutate(
        article: Article,
        actor: AuthenticatedUser,
    ): void {
        if (article.author.id === actor.id || actor.role === Role.ADMIN) {
            return;
        }

        throw new ForbiddenException("You do not have access to this article");
    }

    private assertCanReadDrafts(
        authorId: string,
        actor?: AuthenticatedUser,
    ): void {
        if (actor && (actor.id === authorId || actor.role === Role.ADMIN)) {
            return;
        }

        throw new ForbiddenException("You do not have access to these drafts");
    }

    private async resolveTags(tags?: CreateArticleDto["tags"]): Promise<Tag[]> {
        if (!tags || tags.length === 0) {
            return [];
        }

        const tagNames = tags
            .map((tag) => tag.name.trim().toLowerCase())
            .filter((name) => name.length > 0);

        return this.tagsService.findOrCreateByNames([...new Set(tagNames)]);
    }
}
