import {Article} from '../types';

export const EMPTY_ARTICLE_BASE: Omit<Article, 'author' | 'image' | 'title'> = {
    comments: [],
    content: '',
    hasLiked: false,
    isDraft: true,
    likesCount: 0,
};
