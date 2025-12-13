import {
    BadRequestException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {LikesService} from "../likes/likes.service";
import {UsersService} from "../users/users.service";
import {
    CreateArticleDto,
    RequestGetArticles,
    ResponseArticle,
    ResponseGetArticles,
    UpdateArticleDto,
} from "./article.dto";
import {Article} from "./articles.entity";

type FindAll = Omit<RequestGetArticles, "tags"> & {
    tags?: string[];
};

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
        private likesService: LikesService,
        private usersService: UsersService,
    ) {}

    async create(
        createArticleData: CreateArticleDto,
    ): Promise<ResponseArticle> {
        const {authorId, title, content, readTime} = createArticleData;
        const author = await this.usersService.findById(authorId);

        const result = this.articlesRepository.create({
            author,
            content,
            readTime,
            title,
        });

        const resultWithLike: ResponseArticle = {...result, hasLiked: false};

        return await this.articlesRepository.save(resultWithLike);
    }

    async update(id: string, updateArticleData: UpdateArticleDto) {
        const article = await this.findOneForUpdate(id);

        Object.assign(article, updateArticleData);

        return await this.articlesRepository.save(article);
    }

    async findOne(id: string, userId: string): Promise<ResponseArticle> {
        const article = await this.articlesRepository.findOne({
            where: {id, isDraft: false},
            relations: ["author", "tags"],
        });
        if (!article) {
            throw new NotFoundException("Article not found");
        }

        const likedArticle = await this.likesService.hasLiked({
            entityId: id,
            userId,
            entityType: "article",
        });

        return {...article, hasLiked: Boolean(likedArticle)};
    }

    async findAll(filters: FindAll): Promise<ResponseGetArticles> {
        const {
            page,
            limit,
            search,
            authorId,
            tags,
            minLikes,
            createdAfter,
            sortBy,
            order,
        } = filters;

        const skip = (page - 1) * limit;

        const queryBuilder = this.articlesRepository
            .createQueryBuilder("article")
            .leftJoinAndSelect("article.author", "author")
            .leftJoinAndSelect("article.tags", "tags");

        if (search) {
            queryBuilder.andWhere("article.title ILIKE :search", {
                search: `%${search}%`,
            });
        }
        if (authorId) {
            queryBuilder.andWhere("article.authorId = :authorId", {authorId});
        }
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            queryBuilder
                .innerJoin("article.tags", "tag")
                .andWhere("tag.name IN (:...tags)", {tags: tagArray});
        }
        if (minLikes) {
            queryBuilder.andWhere("article.likesCount >= :minLikes", {
                minLikes,
            });
        }
        if (createdAfter) {
            queryBuilder.andWhere("article.createdAt >= :createdAfter", {
                createdAfter: new Date(createdAfter),
            });
        }

        queryBuilder.orderBy(`article.${sortBy}`, order as "ASC" | "DESC");

        queryBuilder.skip(skip).take(limit + 1);

        const result = await queryBuilder.getMany();

        const articles = result.slice(0, -1);

        const next = result.at(-1)?.id;

        return {
            articles,
            page,
            limit,
            next,
        };
    }

    async findOneForUpdate(id: string): Promise<Article> {
        const article = await this.articlesRepository.findOne({
            where: {id},
            relations: ["tags"],
        });
        if (!article) {
            throw new NotFoundException("Article not found");
        }
        return article;
    }

    async findAllByAuthorId(authorId: string, drafts = false) {
        return await this.articlesRepository.find({
            where: {author: {id: authorId}, isDraft: drafts},
            relations: ["author", "tags"],
            order: {
                createdAt: "DESC",
            },
        });
    }

    async publish(id: string, userId: string) {
        const article = await this.articlesRepository.findOne({
            where: {id},
            relations: ["author"],
        });
        if (userId !== article?.author.id) {
            throw new NotAcceptableException();
        }
        if (article.isDraft === true) {
            throw new BadRequestException(
                "Article have been publiched already",
            );
        }
        article.isDraft = true;
        await this.articlesRepository.save(article);
        return true;
    }

    async delete(id: string) {
        const result = await this.articlesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException("Article not found");
        }
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
}
