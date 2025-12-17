import {useMutation, useQuery} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';

import api from '../api/tags';
import {Tag} from '../types';

import {tagsKeys} from './constants';

export const useGetTags = () => {
    return useQuery<Tag[], Error>({
        queryKey: tagsKeys.lists(),
        queryFn: () => api.getTags(),
    });
};

export const useCreateTag = () => {
    return useMutation<Tag, Error, string>({
        mutationFn: (name) => api.createTag(name),
        onSuccess: (newTag) => {
            queryClient.setQueryData<Tag[]>(
                tagsKeys.lists(),
                (oldTags = []) => [...oldTags, newTag]
            );

            queryClient.setQueryData(tagsKeys.detail(newTag.id), newTag);
        },
    });
};

export const useUpdateTag = () => {
    return useMutation<Tag, Error, {id: string; name: string}>({
        mutationFn: ({id, name}) => api.updateTag(id, name),
        onSuccess: (updatedTag, variables) => {
            queryClient.setQueryData(tagsKeys.detail(variables.id), updatedTag);

            queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldTags = []) =>
                oldTags.map((tag) =>
                    tag.id === variables.id ? updatedTag : tag
                )
            );
        },
    });
};

export const useDeleteTag = () => {
    return useMutation<boolean, Error, string>({
        mutationFn: (id) => api.deleteTag(id),
        onSuccess: (_, id) => {
            queryClient.removeQueries({queryKey: tagsKeys.detail(id)});

            queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldTags = []) =>
                oldTags.filter((tag) => tag.id !== id)
            );
        },
    });
};
