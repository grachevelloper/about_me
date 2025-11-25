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

export interface getComment {
    id: string;
}

export interface CommentsApi {
    createComment: (createCommentData: CreateCommentDto) => Promise<Comment>;

    deleteComment: (commentId: string) => Promise<void>;

    updateComment: (updateCommentData: UpdateCommentDto) => Promise<Comment>;

    listComments: (ListCommentsData: ListComments) => Promise<Comment[]>;

    getComment: (commentId: string) => Promise<Comment>;
}
