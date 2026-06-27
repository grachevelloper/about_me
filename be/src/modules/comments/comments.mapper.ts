import {UsersMapper} from "../users/users.mapper";
import {CommentResponseDto} from "./comments.dto";
import {Comment} from "./comments.entity";

export class CommentsMapper {
    static toResponse(comment: Comment): CommentResponseDto {
        return {
            id: comment.id,
            content: comment.content,
            entityType: comment.entityType,
            entityId: comment.entityId,
            parentId: comment.parentId,
            depth: comment.depth,
            likesCount: comment.likesCount,
            author: UsersMapper.toResponse(comment.author),
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }
}
