import {Article} from '../types';

export const EMPTY_ARTICLE_BASE: Omit<Article, 'author' | 'image' | 'title'> = {
    id: Math.random().toString(36),
    content: '',
    hasLiked: false,
    isDraft: true,
    likesCount: 0,
};
