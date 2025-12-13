import {type CommentType} from '@/shared/entities/Comment';
import {LikedEntity} from '@/typings/common';

import {User} from '../../users/types';

export interface Article extends LikedEntity {
    title: string;
    image: string;
    content: string;
    tags?: Tag[];
    comments: CommentType[];
    likesCount: number;
    readTime?: number;
    author: User;
    isDraft: boolean;
}

export interface Tag {
    id: string;
    name: string;
}
