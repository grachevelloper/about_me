import {CommentType} from '../types';

type EntityCommentType = 'todo' | 'article';

export interface CreateCommentDto {
    content: string;

    parentId: string | null;

    entityId: string;

    entityType: EntityCommentType;
}

export interface UpdateCommentDto {
    id: string;

    content: string;
}

export interface ListComments {
    entityId: string;
    entityType: EntityCommentType;
}

export interface CommentsApi {
    createComment: (
        createCommentData: CreateCommentDto
    ) => Promise<CommentType>;

    deleteComment: (commentId: string) => Promise<void>;

    updateComment: (
        updateCommentData: UpdateCommentDto
    ) => Promise<CommentType>;

    listComments: (ListCommentsData: ListComments) => Promise<CommentType[]>;

    getComment: (commentId: string) => Promise<CommentType>;
}
