import {query} from '@/shared/configs/api';

import {Tag} from '../types';

import {DtoCreateTag, TagsApi} from './types';

const tagsApi: TagsApi = {
    getTags: async (): Promise<Tag[]> => {
        const response = await query.get<Tag[]>('tags');
        return response;
    },

    createTag: async (data: DtoCreateTag): Promise<Tag> => {
        const response = await query.post<Tag>('tags', data);
        return response;
    },

    updateTag: async (id: string, data: DtoCreateTag): Promise<Tag> => {
        const response = await query.patch<Tag>(`tags/${id}`, data);
        return response;
    },

    deleteTag: async (id: string): Promise<void> => {
        await query.delete(`tags/${id}`);
    },
};
export default tagsApi;
