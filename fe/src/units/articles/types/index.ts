import {type CommentType} from '@/shared/entities/Comment';
export interface Article {
    id?: string;
    title: string;
    image: string;
    content: string;
    tags: Tag[];
    comments: CommentType[];
    likesCount: number;
    readTime?: number;
    updatedAt?: string;
    createdAt?: string;
}

export interface Tag {
    id: string;
    name: string;
}
