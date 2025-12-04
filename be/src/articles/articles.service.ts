import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {UsersService} from "../users/users.service";
import {CreateArticleDto, UpdateArticleDto} from "./article.dto";
import {Article} from "./articles.entity";

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
        private usersService: UsersService,
    ) {}

    async create(createArticleData: CreateArticleDto) {
        const {authorId, title, content, readTime} = createArticleData;
        const author = await this.usersService.findById(authorId);

        const result = this.articlesRepository.create({
            author,
            content,
            readTime,
            title,
        });

        return await this.articlesRepository.save(result);
    }

    async update(id: string, updateArticleData: UpdateArticleDto) {
        const article = await this.findOne(id);

        Object.assign(article, updateArticleData);

        return await this.articlesRepository.save(article);
    }

    async findOne(id: string): Promise<Article> {
        const article = await this.articlesRepository.findOne({
            where: {id},
            relations: ["author"],
        });
        if (!article) {
            throw new NotFoundException("Comment not found");
        }
        return article;
    }

    async findAllByAuthorId(authorId: string) {
        return await this.articlesRepository.find({
            where: {author: {id: authorId}},
            relations: ["author"],
            order: {
                createdAt: "DESC",
            },
        });
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
