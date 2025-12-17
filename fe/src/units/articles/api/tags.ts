import {query} from '@/shared/configs/api';

import {Tag} from '../types';

import {TagsApi} from './types';

const tagsApi: TagsApi = {
    getTags: async (): Promise<Tag[]> => {
        const response = await query.get<Tag[]>('tags');
        return response;
    },

    createTag: async (name: string): Promise<Tag> => {
        const response = await query.post<Tag>('tags', {name});
        return response;
    },

    deleteTag: async (id: string): Promise<boolean> => {
        const response = await query.delete(`tags/${id}`);
        return response.status === 204 || response.status === 200;
    },
};
export default tagsApi;
