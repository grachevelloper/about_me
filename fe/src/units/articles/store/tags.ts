import {useMutation, useQuery} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';

import api from '../api/tags';
import {DtoCreateTag} from '../api/types';
import {Tag} from '../types';

import {tagsKeys} from './constants';

export const useGetTags = () => {
    return useQuery<Tag[], Error>({
        queryKey: tagsKeys.lists(),
        queryFn: () => api.getTags(),
    });
};

export const useCreateTag = () => {
    return useMutation<Tag, Error, DtoCreateTag>({
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

export const useDeleteTag = () => {
    return useMutation<void, Error, string>({
        mutationFn: (id) => api.deleteTag(id),
        onSuccess: (_, id) => {
            queryClient.removeQueries({queryKey: tagsKeys.detail(id)});

            queryClient.setQueryData<Tag[]>(tagsKeys.lists(), (oldTags = []) =>
                oldTags.filter((tag) => tag.id !== id)
            );
        },
    });
};
