import {query} from '@/shared/configs/api';

import {Article} from '../types';

import {
    ArticleApi,
    DtoCreateArticle,
    DtoUpdateArticle,
    DtoUpdateArticleContent,
    DtoUpdateArticleDraftStatus,
    DtoUpdateArticleImage,
    DtoUpdateArticleReadTime,
    DtoUpdateArticleTags,
    DtoUpdateArticleTitle,
} from './types';

const api: ArticleApi = {
    create: async (createData: DtoCreateArticle): Promise<Article> => {
        const response = await query.post<Article>('articles', createData);
        return response;
    },

    update: async (updateData: DtoUpdateArticle): Promise<Article> => {
        const {id, ...data} = updateData;
        const response = await query.patch<Article>(`articles/${id}`, data);
        return response;
    },

    updateTitle: async (data: DtoUpdateArticleTitle): Promise<Article> => {
        const {id, title} = data;
        const response = await query.patch<Article>(`articles/${id}/title`, {
            title,
        });
        return response;
    },

    updateContent: async (data: DtoUpdateArticleContent): Promise<Article> => {
        const {id, content} = data;
        const response = await query.patch<Article>(`articles/${id}/content`, {
            content,
        });
        return response;
    },

    updateImage: async (data: DtoUpdateArticleImage): Promise<Article> => {
        const {id, image} = data;
        const response = await query.patch<Article>(`articles/${id}/image`, {
            image,
        });
        return response;
    },

    updateReadTime: async (
        data: DtoUpdateArticleReadTime
    ): Promise<Article> => {
        const {id, readTime} = data;
        const response = await query.patch<Article>(
            `articles/${id}/read-time`,
            {readTime}
        );
        return response;
    },

    updateTags: async (data: DtoUpdateArticleTags): Promise<Article> => {
        const {id, tags} = data;
        const response = await query.patch<Article>(`articles/${id}/tags`, {
            tags,
        });
        return response;
    },

    updateDraftStatus: async (
        data: DtoUpdateArticleDraftStatus
    ): Promise<Article> => {
        const {id, isDraft} = data;
        const response = await query.patch<Article>(
            `articles/${id}/draft-status`,
            {isDraft}
        );
        return response;
    },

    delete: async (id: string): Promise<void> => {
        return await query.delete(`articles/${id}`);
    },

    getById: async (id: string): Promise<Article> => {
        const response = await query.get<Article>(`articles/${id}`);
        return response;
    },

    getDrafts: async (): Promise<Article[]> => {
        const response = await query.get<Article[]>(`articles/drafts`);
        return response;
    },

    getByAuthorId: async (authorId: string): Promise<Article[]> => {
        const response = await query.get<Article[]>(
            `articles/author/${authorId}`
        );
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
