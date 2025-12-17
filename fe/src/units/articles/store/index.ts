import {useMutation, useQuery} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';

import api from '../api';
import {DtoCreateArticle, DtoUpdateArticle} from '../api/types';
import {Article} from '../types';

import {articleKeys} from './constants';

export const useGetAllArticles = () => {
    return useQuery<Article[], Error>({
        queryKey: articleKeys.lists(),
        queryFn: () => api.getAll(),
    });
};

export const useGetArticleById = (id?: string) => {
    return useQuery<Article, Error>({
        queryKey: articleKeys.detail(id!),
        queryFn: () => {
            if (!id) {
                throw new Error('Article ID is required');
            }
            return api.getById(id);
        },
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetAuthorDrafts = () => {
    return useQuery<Article[], Error>({
        queryKey: articleKeys.drafts(),
        queryFn: () => api.getDrafts(),
    });
};

export const useGetArticlesByAuthor = (authorId: string | undefined) => {
    return useQuery<Article[], Error>({
        queryKey: articleKeys.byAuthor(authorId || ''),
        queryFn: () => api.getByAuthorId(authorId!),
        enabled: !!authorId,
    });
};

export const useCreateArticle = () => {
    return useMutation<Article, Error, DtoCreateArticle>({
        mutationFn: (data) => api.create(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: articleKeys.lists()});
            queryClient.setQueryData(articleKeys.detail(data.id), data);
        },
    });
};

export const useUpdateArticle = () => {
    return useMutation<Article, Error, DtoUpdateArticle>({
        mutationFn: (data) => api.update(data),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(articleKeys.detail(variables.id!), data);
            queryClient.invalidateQueries({queryKey: articleKeys.lists()});
        },
    });
};

export const useDeleteArticle = () => {
    return useMutation<void, Error, string>({
        mutationFn: (id) => api.delete(id),
        onSuccess: (_, id) => {
            queryClient.removeQueries({queryKey: articleKeys.detail(id)});
            queryClient.invalidateQueries({queryKey: articleKeys.lists()});
        },
    });
};

export const usePublishArticle = () => {
    return useMutation<boolean, Error, string>({
        mutationFn: (id) => api.publish(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({queryKey: articleKeys.detail(id)});
            queryClient.invalidateQueries({queryKey: articleKeys.lists()});
        },
    });
};
