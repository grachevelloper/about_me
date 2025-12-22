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

    deleteTag: async (id: string): Promise<boolean> => {
        const response = await query.delete(`tags/${id}`);
        return response;
    },
};
export default tagsApi;
