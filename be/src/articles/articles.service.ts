import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Article} from "./articles.entity";

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
    ) {}

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
            .where("id = :commentId", {commentId: articleId})
            .execute();
    }

    async decrementLikesCount(articleId: string): Promise<void> {
        await this.articlesRepository
            .createQueryBuilder()
            .update(Article)
            .set({
                likesCount: () => "likesCount - 1",
            })
            .where("id = :commentId", {commentId: articleId})
            .andWhere("likesCount > 0")
            .execute();
    }
}
