import {User} from '@/users/types';

export type EntityCommentType = 'todo' | 'article';

export interface CommentType {
    id?: string;

    author: User;

    content: string;

    entityType: EntityCommentType;

    entityId: string;

    parentId: string | null;

    depth: number;

    likesCount: number;

    updatedAt?: Date;

    createdAt?: Date;
}
