import {query} from '@/shared/configs/api';

import {Article} from '../types';

import {ArticleApi, DtoCreateArticle, DtoUpdateArticle} from './types';

const api: ArticleApi = {
    create: async (createData: DtoCreateArticle): Promise<Article> => {
        const response = await query.post<Article>('articles', createData);
        return response;
    },

    update: async (updateData: DtoUpdateArticle): Promise<Article> => {
        const {id, ...data} = updateData;
        const response = await query.put<Article>(`articles/${id}`, data);
        return response;
    },

    delete: async (id: string): Promise<void> => {
        return await query.delete(`articles/${id}`);
    },

    getById: async (id: string): Promise<Article> => {
        const response = await query.get<Article>(`articles/${id}`);
        return response;
    },

    getDrafts: async (authorId: string): Promise<Article[]> => {
        const response = await query.get<Article[]>(
            `articles/drafts${authorId}`
        );
        return response;
    },

    getByAuthorId: async (authorId: string): Promise<Article[]> => {
        const response = await query.get<Article[]>(`articles/${authorId}`);
        return response;
    },

    getAll: async (): Promise<Article[]> => {
        const response = await query.get<Article[]>('articles');
        return response;
    },

    publish: async (id: string): Promise<boolean> => {
        const response = await query.post(`articles/${id}/publish`);
        return response.status === 200;
    },
};

export default api;
