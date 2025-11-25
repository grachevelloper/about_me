import {User} from '@/typings/entities';

export type EntityCommentType = 'todo' | 'article';

export interface Comment {
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
