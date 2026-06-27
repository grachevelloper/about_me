import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import {In, Repository} from "typeorm";

import {RefreshToken} from "../../processes/auth/refresh-token/refresh-token.entity";
import {AuthenticatedUser, Role} from "../../types";
import {Article} from "../articles/articles.entity";
import {Attachment} from "../attachments/attachments.entity";
import {AttachmentsService} from "../attachments/attachments.service";
import {Comment} from "../comments/comments.entity";
import {Like} from "../likes/likes.entity";
import {CheckList} from "../todos/checklists/checklists.entity";
import {Todo} from "../todos/todos.entity";
import {CreateUserDto, UpdateUserDto} from "./user.dto";
import {User} from "./users.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private attachmentsService: AttachmentsService,
    ) {}

    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({where: {id}});
        if (!user) {
            throw new NotFoundException("User not found!");
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.email = :email", {email})
            .getOne();
    }

    async findForActor(id: string, actor: AuthenticatedUser): Promise<User> {
        this.assertSelfOrAdmin(id, actor);
        return this.findById(id);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const {email, password, role, username} = createUserDto;
        const emailExists = await this.usersRepository.findOneBy({email});
        if (emailExists) {
            throw new ConflictException("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.usersRepository.create({
            email,
            username,
            password: hashedPassword,
            role,
        });
        return this.usersRepository.save(user);
    }

    async delete(id: string, actor: AuthenticatedUser): Promise<void> {
        if (actor.role !== Role.ADMIN) {
            throw new ForbiddenException("Administrator access required");
        }
        await this.findById(id);

        const {articleIds, commentIds, todoIds} =
            await this.getOwnedContentIds(id);
        await this.deleteOwnedAttachmentFiles(id, articleIds, todoIds);

        await this.usersRepository.manager.transaction(async (manager) => {
            await manager.delete(RefreshToken, {userId: id});

            if (commentIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "comment",
                    entityId: In(commentIds),
                });
                await manager.delete(Comment, {id: In(commentIds)});
            }

            if (articleIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "article",
                    entityId: In(articleIds),
                });
                await manager.delete(Attachment, {
                    entityType: "article",
                    entityId: In(articleIds),
                });
                await manager
                    .createQueryBuilder()
                    .delete()
                    .from("article_tags")
                    .where('"articleId" IN (:...articleIds)', {articleIds})
                    .execute();
                await manager.delete(Article, {id: In(articleIds)});
            }

            if (todoIds.length > 0) {
                await manager.delete(Like, {
                    entityType: "todo",
                    entityId: In(todoIds),
                });
                await manager.delete(Attachment, {
                    entityType: "todo",
                    entityId: In(todoIds),
                });
                await manager
                    .createQueryBuilder()
                    .delete()
                    .from(CheckList)
                    .where("todo_id IN (:...todoIds)", {todoIds})
                    .execute();
                await manager.delete(Todo, {id: In(todoIds)});
            }

            await manager.delete(Like, {authorId: id});
            await manager.delete(Attachment, {entityType: "user", entityId: id});

            const result = await manager.delete(User, id);
            if (result.affected === 0) {
                throw new NotFoundException("User not found!");
            }
        });
    }

    async update(
        id: string,
        updateData: UpdateUserDto,
        actor: AuthenticatedUser,
    ): Promise<User> {
        this.assertSelfOrAdmin(id, actor);
        if (updateData.role !== undefined && actor.role !== Role.ADMIN) {
            throw new ForbiddenException("Only an administrator can change roles");
        }
        const user = await this.findById(id);

        Object.assign(user, updateData);

        return this.usersRepository.save(user);
    }

    async changePassword(
        id: string,
        currentPassword: string,
        newPassword: string,
        actor: AuthenticatedUser,
    ): Promise<void> {
        if (id !== actor.id) {
            throw new ForbiddenException("You can only change your own password");
        }
        const user = await this.findByIdWithPassword(id);
        if (!(await bcrypt.compare(currentPassword, user.password))) {
            throw new UnauthorizedException("Invalid current password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.update(id, {password: hashedPassword});
    }

    private async getOwnedContentIds(id: string): Promise<{
        articleIds: string[];
        commentIds: string[];
        todoIds: string[];
    }> {
        const manager = this.usersRepository.manager;
        const articles = await manager.find(Article, {
            select: ["id"],
            where: {author: {id}},
        });
        const articleIds = articles.map((article) => article.id);

        const todos = await manager.find(Todo, {
            select: ["id"],
            where: {authorId: id},
        });
        const todoIds = todos.map((todo) => todo.id);

        const comments = await manager.find(Comment, {
            select: ["id", "parentId", "entityId", "entityType"],
            where: [
                {author: {id}},
                ...(articleIds.length > 0
                    ? [{entityType: "article" as const, entityId: In(articleIds)}]
                    : []),
                ...(todoIds.length > 0
                    ? [{entityType: "todo" as const, entityId: In(todoIds)}]
                    : []),
            ],
        });
        const commentRootIds = comments.map((comment) => comment.id);
        const allComments = await manager.find(Comment, {
            select: ["id", "parentId"],
        });

        return {
            articleIds,
            commentIds: this.getCommentBranchIds(allComments, commentRootIds),
            todoIds,
        };
    }

    private async deleteOwnedAttachmentFiles(
        userId: string,
        articleIds: string[],
        todoIds: string[],
    ): Promise<void> {
        await this.attachmentsService.deleteEntityFiles("user", userId);

        for (const articleId of articleIds) {
            await this.attachmentsService.deleteEntityFiles("article", articleId);
        }

        for (const todoId of todoIds) {
            await this.attachmentsService.deleteEntityFiles("todo", todoId);
        }
    }

    private async findByIdWithPassword(id: string): Promise<User> {
        const user = await this.usersRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", {id})
            .getOne();

        if (!user) {
            throw new NotFoundException("User not found!");
        }

        return user;
    }

    private assertSelfOrAdmin(id: string, actor: AuthenticatedUser): void {
        if (id !== actor.id && actor.role !== Role.ADMIN) {
            throw new ForbiddenException("Access to this user is forbidden");
        }
    }

    private getCommentBranchIds(
        comments: Pick<Comment, "id" | "parentId">[],
        rootIds: string[],
    ): string[] {
        const ids = new Set(rootIds);
        let changed = true;

        while (changed) {
            changed = false;
            for (const comment of comments) {
                if (
                    comment.parentId &&
                    ids.has(comment.parentId) &&
                    !ids.has(comment.id)
                ) {
                    ids.add(comment.id);
                    changed = true;
                }
            }
        }

        return [...ids];
    }
}
